'use client';

import { useActions, useUIState } from 'ai/rsc';

import type { AI } from '../../app/action';
import { Button } from '../ui/button';
import { type Product } from '@/lib/schemas/product.schema';

export function Products({ products }: { products: Product[] }) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <div className="flex flex-wrap gap-4 justify-stretch">
      {products.map((product) => (
        <div
          key={product.id}
          className="space-y-3 sm:max-w-[200px] border-transparent border shadow-sm hover:border-primary-foreground basis-full"
        >
          <div className="overflow-hidden rounded-md">
            <img
              alt={`Image of ${product.name}`}
              loading="lazy"
              width="150"
              height="150"
              decoding="async"
              data-nimg="1"
              className="h-auto object-cover transition-all hover:scale-105 max-h-[150px] min-h-[150px] w-full"
              src={product.image}
            />
          </div>
          <div className="space-y-1 text-sm flex flex-col justify-between">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium leading-none">{product.name}</h3>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(product.price)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {product.description.slice(0, 150)}...
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant={'default'}
                onClick={async () => {
                  const response = await submitUserMessage(
                    `Purchasing ${product.name} with id ${product.id} [run \`show_purchase_ui\` function]`,
                  );
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    response,
                  ]);
                }}
              >
                Purchase
              </Button>
              <Button
                variant={'secondary'}
                onClick={async () => {
                  const response = await submitUserMessage(
                    `Show details for ${product.name}`,
                  );
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    response,
                  ]);
                }}
              >
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
