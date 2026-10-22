"use client";

import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

type Uploading = { id: number; name: string; progress: number; error?: string };

/** Resize in the browser so phone photos (often 4–8 MB) upload quickly. */
async function prepare(file: File, max = 1600): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.86));
    return blob ?? file;
  } catch {
    return file; // browser couldn't decode it — upload as-is
  }
}

export function ImageManager({
  images,
  onChange,
  folder,
  baseName,
  max = 12,
  error,
}: {
  images: ProductImage[];
  onChange: (next: ProductImage[]) => void;
  folder: "products" | "categories";
  baseName: string;
  max?: number;
  error?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<Uploading[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  // Uploads finish one by one; keep the latest list so none overwrite each other.
  const latest = useRef(images);
  useEffect(() => {
    latest.current = images;
  }, [images]);

  const room = max - images.length;

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, room));
    if (!list.length) return;
    const slug = (baseName || "saree").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "saree";
    for (const file of list) {
      const id = Date.now() + Math.random();
      setUploads((u) => [...u, { id, name: file.name, progress: 0 }]);
      try {
        const body = await prepare(file);
        const blob = await upload(`${folder}/${slug}.jpg`, body, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          contentType: body.type || "image/jpeg",
          onUploadProgress: ({ percentage }) =>
            setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress: percentage } : x))),
        });
        const next = [...latest.current, { src: blob.url, alt: "" }];
        latest.current = next;
        onChange(next);
        setUploads((u) => u.filter((x) => x.id !== id));
      } catch (e) {
        const message = e instanceof Error ? e.message : "Upload failed";
        setUploads((u) => u.map((x) => (x.id === id ? { ...x, error: message } : x)));
      }
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length || from === to) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      {images.length > 0 && (
        <ul className={cn("grid gap-3", max === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3")}>
          {images.map((img, i) => (
            <li
              key={img.src}
              draggable={images.length > 1}
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) move(dragIndex, i);
                setDragIndex(null);
              }}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-white",
                dragIndex === i ? "border-gold-500 opacity-60" : "border-ivory-200",
              )}
            >
              <div className="relative aspect-[3/4] bg-ivory-100">
                <Image src={img.src} alt={img.alt || ""} fill sizes="200px" className="object-cover" />
                {i === 0 && max > 1 && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-maroon-950 px-2 py-0.5 text-[0.65rem] font-medium text-gold-200">
                    <Star className="h-3 w-3" /> Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, j) => j !== i))}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-700 shadow hover:bg-rani-600 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                {images.length > 1 && (
                  <div className="absolute inset-x-2 bottom-2 flex justify-between transition-opacity pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100">
                    <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move left" className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-700 shadow disabled:opacity-30">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => move(i, i + 1)} disabled={i === images.length - 1} aria-label="Move right" className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-700 shadow disabled:opacity-30">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <input
                value={img.alt}
                onChange={(e) => onChange(images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                placeholder="Describe photo"
                aria-label={`Description for photo ${i + 1}`}
                className="w-full border-t border-ivory-200 px-2.5 py-2 text-base text-ink-700 sm:text-xs placeholder:text-ink-500/60 focus:outline-none"
              />
            </li>
          ))}
        </ul>
      )}

      {uploads.length > 0 && (
        <ul className="mt-3 space-y-2">
          {uploads.map((u) => (
            <li key={u.id} className="rounded-lg border border-ivory-200 bg-white px-3 py-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-ink-700">{u.name}</span>
                {u.error ? (
                  <button type="button" className="text-rani-600" onClick={() => setUploads((x) => x.filter((y) => y.id !== u.id))}>
                    Dismiss
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-ink-500">
                    <Loader2 className="h-3 w-3 animate-spin" /> {Math.round(u.progress)}%
                  </span>
                )}
              </div>
              {u.error ? (
                <p className="mt-1 text-rani-600">{u.error}</p>
              ) : (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ivory-100">
                  <div className="h-full bg-gold-gradient transition-[width]" style={{ width: `${u.progress}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {room > 0 && (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "mt-3 flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
            dragOver ? "border-gold-500 bg-gold-200/30" : "border-ivory-200 bg-ivory-50 hover:border-gold-500/60",
            error && "border-rani-600/50",
          )}
        >
          <ImagePlus className="h-6 w-6 text-gold-700" />
          <span className="text-sm font-medium text-ink-900">{max === 1 ? "Upload a photo" : "Add photos"}</span>
          <span className="text-xs text-ink-500">
            <span className="pointer-fine:hidden">Tap to choose from your phone</span>
            <span className="pointer-coarse:hidden">Drag & drop or click · JPG, PNG or WebP</span>{max > 1 ? ` · ${room} more allowed` : ""}
          </span>
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        multiple={max > 1}
        hidden
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && (
        <p className="mt-2 text-[0.8rem] text-rani-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
