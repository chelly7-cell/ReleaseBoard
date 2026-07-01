"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

export default function UploadLogo({
  onChange,
}: {
  onChange: (url: string) => void;
}) {
  const [preview, setPreview] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.url;
          if (url) {
            setPreview(url);
            onChange(url);
          }
        }}
        onUploadError={(error) => {
          alert(error.message);
        }}
      />

      {preview && (
        <div className="w-20 h-20 rounded-xl overflow-hidden border">
          <img src={preview} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}