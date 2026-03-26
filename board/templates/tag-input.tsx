"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [value, setValue] = useState("");

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;

    onChange([...tags, trimmed]);
    setValue("");
  }

  function removeTag(target: string) {
    onChange(tags.filter((t) => t !== target));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="태그 입력 후 Enter (쉼표로 구분)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
