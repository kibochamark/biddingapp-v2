import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="animate-spin text-primary w-12 h-12" />
            <p className="text-lg text-muted-foreground">Loading address details...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
