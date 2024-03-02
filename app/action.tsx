import 'server-only';

import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc';
import OpenAI from 'openai';

import { runOpenAICompletion } from '@/lib/utils';
import { z } from 'zod';
import { BotCard, BotMessage } from '@/components/llm-shop/message';
import { spinner } from '@/components/llm-shop/spinner';
import { Products } from '@/components/llm-shop/products';
import { Product } from '@/components/llm-shop/product';
import { Checkout } from '@/components/llm-shop/checkout';

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
});

export type Product = z.infer<typeof productSchema>;

const products = [
  {
    id: '1',
    name: 'Book',
    description: 'A book',
    price: 10,
    image: 'https://source.unsplash.com/random/900×700/?book',
  },
  {
    id: '2',
    name: 'Shoes',
    description: 'A pair of shoes',
    price: 20,
    image: 'https://source.unsplash.com/random/900×700/?shoes',
  },
  {
    id: '3',
    name: 'Phone',
    description: 'A phone',
    price: 30,
    image: 'https://source.unsplash.com/random/900×700/?phone',
  },
  {
    id: '4',
    name: 'Laptop',
    description: 'A laptop',
    price: 40,
    image: 'https://source.unsplash.com/random/900×700/?laptop',
  },
  {
    id: '5',
    name: 'Headphones',
    description: 'A pair of headphones',
    price: 50,
    image: 'https://source.unsplash.com/random/900×700/?headphones',
  },
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>,
  );

  const completion = runOpenAICompletion(openai, {
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `
You are a friendly ecommerce assistant. You can help users with purchasing products, showing products, purchasing products, and other ecommerce-related tasks. You can also chat with users to request additional information or provide help.

Messages inside [] means that it's a UI element or a user event. For example:
- "[Showing product card - book with id 123]" means that the UI is showing a product card for a book with id 123.
- "[Showing images of book with id 123]" means that the UI is showing images of a book with id 123.
- "[Purchasing book with id 123]" means that the user is purchasing a book with id 123.
- "[User has successfully purchased book with id 123]" means that the user has successfully purchased a book with id 123.
- "[User has failed to purchase book with id 123]" means that the user has failed to purchase a book with id 123.

If you want to show list of products, call \`show_products\`.
If user requests to buy a certain product, directly show purchase UI using \`show_purchase_ui\`.
If user searches for a result that returns only one product, directly show product using \`show_product\`. Before that indicate that search returned only one product.
If user wants to complete impossible task, respond that you are a demo and cannot do that.
If user request to buy a product in any way (e.g. "I want to buy a book" or "Purchasing book with id 123"), show purchase UI using \`show_purchase_ui\`. Dont ever respond with "I'm a demo assistant and cannot process real purchases" directly, always show purchase UI.

Products: ${products.map((product) => Object.values(product).join(', ')).join('; ')}

Besides that, you can also chat with users and do some calculations if needed.
Users don't need to know the id of product you can use the name.
`,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [
      {
        name: 'show_products',
        description: `
Show a list of products to the user. 
The user can then click on a product to view more details.
`,
        parameters: z.object({
          products: productSchema.array(),
        }),
      },
      {
        name: 'show_product',
        description: `
Show a product to the user.

The user can then click on a purchase button to purchase the product.
`,
        parameters: z.object({
          product: productSchema,
        }),
      },

      {
        name: 'show_purchase_ui',
        description: `
Show a purchase UI to the user.
The user can enter their BLIK code and click on a purchase button to purchase the product.
`,
        parameters: z.object({
          product: productSchema,
        }),
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(<BotMessage>{content}</BotMessage>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: 'assistant', content }]);
    }
  });

  completion.onFunctionCall('show_products', async ({ products }) => {
    reply.update(<BotCard>Loading products...</BotCard>);

    reply.done(
      <BotCard>
        <Products products={products} />
      </BotCard>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'show_products',
        content: JSON.stringify(products),
      },
    ]);
  });

  completion.onFunctionCall('show_product', async ({ product }) => {
    reply.update(<BotCard>Loading product details...</BotCard>);

    reply.done(
      <BotCard>
        <Product product={product} />
      </BotCard>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'show_product',
        content: JSON.stringify(product),
      },
    ]);
  });

  completion.onFunctionCall('show_purchase_ui', async ({ product }) => {
    reply.update(<BotCard>Loading purchase UI...</BotCard>);

    reply.done(
      <BotCard>
        <Checkout product={product} />
      </BotCard>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: 'function',
        name: 'show_purchase_ui',
        content: JSON.stringify(product),
      },
    ]);
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}

// Define necessary types and create the AI.

const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
