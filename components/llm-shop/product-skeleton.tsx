'use client';

export function ProductSkeleton() {
  return (
    <>
      <div className="space-y-3 max-w-full border-transparent border shadow-sm hover:border-primary-foreground flex flex-row gap-4">
        <div className="overflow-hidden rounded-md w-fit">
          <img
            alt={`skeleton`}
            loading="lazy"
            width="150"
            height="150"
            decoding="async"
            data-nimg="1"
            className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square max-w-[100px]"
          />
        </div>
        <div className="space-y-1 text-sm flex flex-col justify-between w-full">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium leading-none text-xl"></h3>
              <span></span>
            </div>
            <p className="text-xs text-muted-foreground"></p>
          </div>
        </div>
      </div>
    </>
  );
}
