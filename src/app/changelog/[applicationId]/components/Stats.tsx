import { Eye, Package, Globe } from "lucide-react";

export default function Stats({ app, updates }: any) {
  return (
    <div className="sticky top-20 space-y-4">
      <div className="rounded-xl border p-5">
        <h3 className="mb-4 font-semibold">
          Overview
        </h3>

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {app.views} views
          </div>

          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {updates.length} releases
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Public changelog
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-5">
        <h3 className="mb-3 font-semibold">
          About
        </h3>

        <p className="text-sm text-muted-foreground">
          Follow the latest updates and improvements
          published by this application.
        </p>
      </div>
    </div>
  );
}