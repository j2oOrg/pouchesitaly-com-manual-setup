import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
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
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

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
        // Extract file path from URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(-2).join('/'); // products/filename.ext

        // Delete from storage
        await supabase.storage
          .from('product-images')
          .remove([filePath]);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Update images array
    const newImages = [...images];
    newImages[index] = null;
    onChange(newImages);
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
                  isUploading && "opacity-50",
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
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="p-2 bg-destructive/80 rounded-full hover:bg-destructive transition-colors"
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
        Drag & drop or click to upload. Max 5MB per image.
      </p>
    </div>
  );
}
