import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImagePlus, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductImageUploadProps {
  images: (string | null)[];
  onChange: (images: (string | null)[]) => void;
  maxImages?: number;
}

export function ProductImageUpload({ 
  images, 
  onChange, 
  maxImages = 3 
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [removingBackground, setRemovingBackground] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  const getStoragePathFromPublicUrl = (publicUrl: string) => {
    try {
      const url = new URL(publicUrl);
      const marker = '/object/public/product-images/';
      const markerIndex = url.pathname.indexOf(marker);

      if (markerIndex === -1) {
        return null;
      }

      return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
    } catch (error) {
      console.error('Invalid image URL:', error);
      return null;
    }
  };

  const handleUpload = async (file: File, index: number) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ 
        title: 'Invalid file type', 
        description: 'Please upload an image file',
        variant: 'destructive' 
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: 'File too large', 
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive' 
      });
      return;
    }

    setUploading(index);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Update images array
      const newImages = [...images];
      newImages[index] = publicUrl;
      onChange(newImages);

      toast({ title: 'Image uploaded successfully!' });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Upload failed', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = async (index: number) => {
    const imageUrl = images[index];
    
    if (imageUrl) {
      try {
        const filePath = getStoragePathFromPublicUrl(imageUrl);

        if (filePath) {
          await supabase.storage
            .from('product-images')
            .remove([filePath]);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Update images array
    const newImages = [...images];
    newImages[index] = null;
    onChange(newImages);
  };

  const handleRemoveBackground = async (index: number) => {
    const imageUrl = images[index];
    if (!imageUrl) return;

    setRemovingBackground(index);

    try {
      const { data, error } = await supabase.functions.invoke('remove-bg', {
        body: {
          imageUrl,
          size: 'auto',
          format: 'png',
        },
      });

      if (error) throw error;
      if (!data?.url) {
        throw new Error('Background removal did not return an image URL')
      }

      const newImages = [...images];
      newImages[index] = data.url;
      onChange(newImages);

      toast({ title: 'Background removed successfully!' });
    } catch (error: any) {
      console.error('remove.bg error:', error);
      toast({
        title: 'Background removal failed',
        description: error.message || 'Unable to process the image',
        variant: 'destructive',
      });
    } finally {
      setRemovingBackground(null);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: maxImages }).map((_, index) => {
          const imageUrl = images[index];
          const isUploading = uploading === index;
          const isRemovingBackground = removingBackground === index;
          const isBusy = isUploading || isRemovingBackground;
          const isPrimary = index === 0;

          return (
            <div
              key={index}
              className={cn(
                "relative group",
                isPrimary && "col-span-3 md:col-span-1"
              )}
            >
              <div
                className={cn(
                  "relative aspect-square rounded-xl border-2 border-dashed transition-all overflow-hidden",
                  imageUrl 
                    ? "border-transparent" 
                    : "border-muted-foreground/25 hover:border-primary/50",
                  isBusy && "opacity-50",
                  isPrimary && "ring-2 ring-primary/20"
                )}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        disabled={isBusy}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        title="Replace image"
                      >
                        <Upload className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveBackground(index)}
                        disabled={isBusy}
                        className="p-2 bg-primary/80 rounded-full hover:bg-primary transition-colors disabled:opacity-60"
                        title="Remove background"
                      >
                        {isRemovingBackground ? (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        disabled={isBusy}
                        className="p-2 bg-destructive/80 rounded-full hover:bg-destructive transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-4"
                  >
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <ImagePlus className="w-8 h-8" />
                        <span className="text-xs text-center">
                          {isPrimary ? 'Main Image' : `Image ${index + 1}`}
                        </span>
                      </>
                    )}
                  </button>
                )}

                {/* Primary badge */}
                {isPrimary && imageUrl && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md">
                    Primary
                  </div>
                )}
              </div>

              {imageUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveBackground(index)}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15 disabled:opacity-60"
                  >
                    {isRemovingBackground ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    Remove BG
                  </button>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={(el) => fileInputRefs.current[index] = el}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file, index);
                  e.target.value = '';
                }}
              />
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Upload up to {maxImages} images. First image will be the primary display image. 
        Drag & drop or click to upload. Max 5MB per image. Use Remove BG to process the current image via remove.bg.
      </p>
    </div>
  );
}
