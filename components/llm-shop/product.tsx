'use client';

import { useActions, useUIState } from 'ai/rsc';

import type { AI } from '../../app/action';
import { Button } from '../ui/button';
import { type Product } from '@/lib/schemas/product.schema';

export function Product({ product }: { product: Product }) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <>
      <div
        key={product.id}
        className="space-y-3 max-w-full border-transparent border shadow-sm hover:border-primary-foreground flex flex-row gap-4"
      >
        <div className="overflow-hidden rounded-md w-fit">
          <img
            alt={`Image of ${product.name}`}
            loading="lazy"
            width="150"
            height="150"
            decoding="async"
            data-nimg="1"
            className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square max-w-[100px]"
            src={product.image}
          />
        </div>
        <div className="space-y-1 text-sm flex flex-col justify-between w-full">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium leading-none text-xl">
                {product.name}
              </h3>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(product.price)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          variant={'default'}
          onClick={async () => {
            const response = await submitUserMessage(
              `Purchasing ${product.name} with id ${product.id}`,
            );
            setMessages((currentMessages) => [...currentMessages, response]);
          }}
        >
          Purchase
        </Button>
      </div>
    </>
  );
}
