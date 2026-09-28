import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

// Redimensionne (max 1920 px) et convertit en WebP avant envoi, pour alléger le site.
async function compressImage(file: File, maxSize = 1920, quality = 0.82): Promise<Blob | File> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", quality));
    return blob && blob.type === "image/webp" && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export function ImageUpload({ value, onChange, folder = "uploads", label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Format invalide", description: "Sélectionnez une image.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Maximum 5 Mo.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const optimized = await compressImage(file);
      const ext = optimized === file ? file.name.split(".").pop() || "jpg" : "webp";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("site-images").upload(path, optimized, {
        cacheControl: "31536000",
        contentType: optimized.type,
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: "Photo téléversée" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Upload impossible", variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Aperçu"
              className="h-24 w-24 object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-90"
              aria-label="Retirer la photo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="h-24 w-24 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground text-xs">
            Aucune photo
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {value ? "Remplacer la photo" : "Téléverser une photo"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="ou collez une URL https://..."
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}