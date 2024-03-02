import { Purchase, purchaseSchema } from '@/lib/schemas/purchase.schema';
import { DataTable } from './purchase-table';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'product.name',
    header: 'Product',
  },
  {
    accessorKey: 'product.price',
    header: 'Price',
  },
  {
    accessorKey: 'invoiceUrl',
    header: 'Invoice',
  },
];

export function UserPurchases({ purchases }: { purchases: Purchase[] }) {
  return (
    <div className="relative mx-auto max-w-2xl" id="user-purchases">
      <h1 className="text-2xl font-bold mb-4">Your Purchases</h1>
      <div className="space-y-4">
        <DataTable columns={columns} data={purchases} />
      </div>
    </div>
  );
}
