
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-10 w-1/2" />
        </Card>
      ))}
      <Card className="col-span-full md:col-span-2 lg:col-span-3 p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="pt-4">
          <Skeleton className="h-[200px] w-full" />
        </div>
      </Card>
    </div>
  );
};

export default LoadingState;
