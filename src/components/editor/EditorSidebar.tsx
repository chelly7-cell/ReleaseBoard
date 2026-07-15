"use client";

import { Calendar, FileText, Tag, Globe } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EditorSidebarProps {
  update: {
    version: string;
    status: string;
    type?: string;
    publishDate?: string | null;
  };
}

export default function EditorSidebar({
  update,
}: EditorSidebarProps) {
  return (
    <aside className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Release Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Tag className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Version
              </p>

              <p className="font-medium">
                {update.version}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Type
              </p>

              <p className="font-medium">
                {update.type || "Release"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Status
              </p>

              <Badge>
                {update.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Publish Date
              </p>

              <p className="font-medium">
                {update.publishDate
                  ? new Date(update.publishDate).toLocaleDateString()
                  : "Not published"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Publishing
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Publish this update to make it visible on your public changelog page.
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}