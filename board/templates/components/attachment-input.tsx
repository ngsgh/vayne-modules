"use client";

import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ModuleGate } from "@/components/module-gate";
import { useImageUpload } from "@/hooks/use-image-upload";
import { X, Upload } from "lucide-react";

interface AttachmentInputProps {
  attachments: string[];
  onChange: (attachments: string[]) => void;
}

export function AttachmentInput({ attachments, onChange }: AttachmentInputProps) {
  const { state, uploadFile, previewUrl, errorMessage } = useImageUpload();
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadComplete = useCallback(
    (url: string) => {
      onChange([...attachments, url]);
    },
    [attachments, onChange],
  );

  // previewUrl이 바뀌면 첨부 목록에 추가
  const lastAdded = useRef<string | null>(null);
  if (previewUrl && previewUrl !== lastAdded.current) {
    lastAdded.current = previewUrl;
    handleUploadComplete(previewUrl);
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  function removeAttachment(index: number) {
    onChange(attachments.filter((_, i) => i !== index));
  }

  return (
    <ModuleGate module="s3_upload">
      <div className="flex flex-col gap-2">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors cursor-pointer ${
            isDragOver
              ? "border-brand-400 bg-brand-50 dark:bg-brand-950"
              : "border-gray-300 dark:border-gray-600"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {state === "uploading" ? "업로드 중..." : "이미지를 드래그하거나 클릭"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm text-error-500">{errorMessage}</p>
        ) : null}

        {attachments.length > 0 ? (
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            {attachments.map((item, i) => (
              <li key={i} className="flex items-center gap-1">
                <span className="truncate flex-1">{item}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="hover:text-destructive shrink-0"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </ModuleGate>
  );
}
