import { z } from 'zod';
import { productSchema } from './product.schema';

export const purchaseSchema = z.object({
  id: z.string(),
  product: productSchema,
  invoiceUrl: z.string(),
});

export type Purchase = z.infer<typeof purchaseSchema>;
