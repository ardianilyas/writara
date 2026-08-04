'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DeckDetailSkeleton() {
  return (
    <Card className="w-full h-full flex flex-col p-4 sm:p-8 bg-card border-border shadow-xs overflow-y-auto max-h-[calc(100vh-4.5rem)] space-y-8 select-none">
      {/* Top Toolbar Skeleton */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-2">
        <Skeleton className="h-8 w-36 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg hidden sm:block" />
        </div>
      </div>

      {/* Main Canvas Skeleton */}
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Document Header Skeleton */}
        <div className="space-y-4 border-b border-border pb-6">
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>
          <Skeleton className="h-9 w-4/5 sm:w-3/4 rounded-xl" />
        </div>

        {/* Executive Overview Card Skeleton */}
        <Card className="p-5 border border-sky-100 bg-sky-50/20 space-y-3">
          <Skeleton className="h-4 w-36 rounded-md bg-sky-200/60" />
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3.5 w-4/5 rounded-md" />
        </Card>

        {/* Chapter Modules Skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-4 border-b border-border/60 pb-6">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-7 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />

              <div className="space-y-2 pt-2">
                <Skeleton className="h-3.5 w-1/2 rounded-md" />
                <Skeleton className="h-3.5 w-2/3 rounded-md" />
                <Skeleton className="h-3.5 w-3/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
