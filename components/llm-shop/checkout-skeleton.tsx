'use client';

export function CheckoutSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="bg-zinc-900 text-left p-2 rounded-lg flex flex-row gap-2 h-[30px] w-full"></div>
        <div className="bg-zinc-900 text-left p-2 rounded-lg flex flex-row gap-2 h-[90px] w-full"></div>
      </div>
    </>
  );
}
