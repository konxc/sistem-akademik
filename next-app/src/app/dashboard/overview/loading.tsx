import { Skeleton } from "@/components/ui/skeleton"

export default function OverviewLoading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full md:col-span-2" />
      </div>
    </div>
  )
}
