import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProductImageUpload } from './ProductImageUpload';
import { useProducts } from '@/hooks/useProducts';
import type { DbProduct, ProductInput } from '@/hooks/useProducts';

interface ProductFormProps {
  product?: DbProduct | null;
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultBrands = ['ZYN', 'LYFT', 'VELO', 'NORDIC SPIRIT', 'SKRUF', 'ACE'];
const strengths = ['Light', 'Regular', 'Strong', 'Extra Strong'];
const defaultFlavors = ['Mint', 'Citrus', 'Berry', 'Coffee', 'Fruit', 'Tobacco', 'Wintergreen', 'Spearmint'];

const normalizeBrandValue = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ');

const normalizeFlavorValue = (value: string) =>
  value
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
    .join(', ');

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const { data: existingProducts = [] } = useProducts(true);
  const [formData, setFormData] = useState<ProductInput>({
    sku: '',
    name: '',
    brand: 'ZYN',
    strength: 'Regular',
    strength_mg: 6,
    flavor: '',
    price: 4.99,
    stock_count: 0,
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
        sku: product.sku || '',
        name: product.name,
        brand: product.brand,
        strength: product.strength,
        strength_mg: product.strength_mg,
        flavor: product.flavor,
        price: Number(product.price),
        stock_count: product.stock_count ?? 0,
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

  const flavorSuggestions = Array.from(
    new Set([
      ...defaultFlavors,
      ...existingProducts.flatMap((item) =>
        normalizeFlavorValue(item.flavor || '')
          .split(',')
          .map((token) => token.trim())
          .filter(Boolean)
      ),
    ])
  ).sort((a, b) => a.localeCompare(b));
  const brandSuggestions = Array.from(
    new Set([
      ...defaultBrands,
      ...existingProducts
        .map((item) => normalizeBrandValue(item.brand || ''))
        .filter(Boolean),
    ])
  ).sort((a, b) => a.localeCompare(b));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedBrand = normalizeBrandValue(formData.brand);
    const normalizedFlavor = normalizeFlavorValue(formData.flavor);
    await onSubmit({
      ...formData,
      brand: normalizedBrand,
      sku: formData.sku?.trim() ? formData.sku.trim() : null,
      flavor: normalizedFlavor,
      stock_count: Math.max(0, Number(formData.stock_count) || 0),
    });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., Z-CWM-6"
              />
            </div>
          </div>

          {/* Brand & Flavor Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                list="product-brand-suggestions"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., VELO"
                required
              />
              <datalist id="product-brand-suggestions">
                {brandSuggestions.map((brand) => (
                  <option key={brand} value={brand} />
                ))}
              </datalist>
              <p className="text-xs text-muted-foreground">
                Type a new brand or pick an existing one.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flavor">Flavor *</Label>
              <Input
                id="flavor"
                list="product-flavor-suggestions"
                value={formData.flavor}
                onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                placeholder="e.g., Mint or Citrus, Lime"
                required
              />
              <datalist id="product-flavor-suggestions">
                {flavorSuggestions.map((flavor) => (
                  <option key={flavor} value={flavor} />
                ))}
              </datalist>
              <p className="text-xs text-muted-foreground">
                Type a new flavor or pick an existing one. Use commas for multi-note flavors.
              </p>
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

          {/* Price, Stock & Popularity Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="stock_count">Stock Count</Label>
              <Input
                id="stock_count"
                type="number"
                min="0"
                value={formData.stock_count ?? 0}
                onChange={(e) => setFormData({ ...formData, stock_count: Math.max(0, parseInt(e.target.value, 10) || 0) })}
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
