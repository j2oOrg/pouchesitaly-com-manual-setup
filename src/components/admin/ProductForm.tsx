import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProductImageUpload } from './ProductImageUpload';
import type { DbProduct, ProductInput } from '@/hooks/useProducts';

interface ProductFormProps {
  product?: DbProduct | null;
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const brands = ['ZYN', 'LYFT', 'VELO', 'NORDIC SPIRIT', 'SKRUF', 'ACE'];
const strengths = ['Light', 'Regular', 'Strong', 'Extra Strong'];
const flavors = ['Mint', 'Citrus', 'Berry', 'Coffee', 'Fruit', 'Tobacco', 'Wintergreen', 'Spearmint'];

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    brand: 'ZYN',
    strength: 'Regular',
    strength_mg: 6,
    flavor: 'Mint',
    price: 4.99,
    image: null,
    image_2: null,
    image_3: null,
    description: '',
    description_it: '',
    popularity: 50,
    is_active: true,
  });

  // Helper to get images array from form data
  const getImagesArray = (): (string | null)[] => [
    formData.image || null,
    formData.image_2 || null,
    formData.image_3 || null,
  ];

  // Helper to update form data from images array
  const handleImagesChange = (images: (string | null)[]) => {
    setFormData({
      ...formData,
      image: images[0] || null,
      image_2: images[1] || null,
      image_3: images[2] || null,
    });
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        strength: product.strength,
        strength_mg: product.strength_mg,
        flavor: product.flavor,
        price: Number(product.price),
        image: product.image || null,
        image_2: product.image_2 || null,
        image_3: product.image_3 || null,
        description: product.description || '',
        description_it: product.description_it || '',
        popularity: product.popularity || 50,
        is_active: product.is_active ?? true,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-heading font-bold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Polar Freeze 10mg"
              required
            />
          </div>

          {/* Brand & Flavor Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand *</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) => setFormData({ ...formData, brand: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Flavor *</Label>
              <Select
                value={formData.flavor}
                onValueChange={(value) => setFormData({ ...formData, flavor: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {flavors.map((flavor) => (
                    <SelectItem key={flavor} value={flavor}>{flavor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Strength Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Strength Category *</Label>
              <Select
                value={formData.strength}
                onValueChange={(value) => setFormData({ ...formData, strength: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {strengths.map((strength) => (
                    <SelectItem key={strength} value={strength}>{strength}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strength_mg">Nicotine (mg) *</Label>
              <Input
                id="strength_mg"
                type="number"
                min="1"
                max="50"
                value={formData.strength_mg}
                onChange={(e) => setFormData({ ...formData, strength_mg: parseInt(e.target.value) || 6 })}
                required
              />
            </div>
          </div>

          {/* Price & Popularity Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (€) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="popularity">Popularity (1-100)</Label>
              <Input
                id="popularity"
                type="number"
                min="1"
                max="100"
                value={formData.popularity}
                onChange={(e) => setFormData({ ...formData, popularity: parseInt(e.target.value) || 50 })}
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <ProductImageUpload
              images={getImagesArray()}
              onChange={handleImagesChange}
              maxImages={3}
            />
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description (English)</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description in English..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_it">Description (Italian)</Label>
              <Textarea
                id="description_it"
                value={formData.description_it || ''}
                onChange={(e) => setFormData({ ...formData, description_it: e.target.value })}
                placeholder="Descrizione del prodotto in italiano..."
                rows={3}
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <Label htmlFor="is_active" className="font-medium">Active</Label>
              <p className="text-sm text-muted-foreground">Product is visible in the store</p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : product ? (
                'Update Product'
              ) : (
                'Add Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
