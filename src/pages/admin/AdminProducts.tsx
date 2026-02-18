import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/admin/ProductForm';
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  DbProduct,
  ProductInput 
} from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<DbProduct | null>(null);
  
  const { data: products, isLoading } = useProducts(true);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.flavor.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreate = async (data: ProductInput) => {
    try {
      await createProduct.mutateAsync(data);
      toast({ title: 'Product created successfully!' });
      setShowForm(false);
    } catch (error: any) {
      toast({ title: 'Error creating product', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdate = async (data: ProductInput) => {
    if (!editingProduct) return;
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, ...data });
      toast({ title: 'Product updated successfully!' });
      setEditingProduct(null);
    } catch (error: any) {
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      toast({ title: 'Product deleted successfully!' });
      setDeletingProduct(null);
    } catch (error: any) {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Light': return 'bg-blue-100 text-blue-800';
      case 'Regular': return 'bg-green-100 text-green-800';
      case 'Strong': return 'bg-orange-100 text-orange-800';
      case 'Extra Strong': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12"
          />
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Brand</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Strength</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Flavor</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.strength_mg}mg</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">{product.brand}</td>
                      <td className="p-4">
                        <Badge className={getStrengthColor(product.strength)}>
                          {product.strength}
                        </Badge>
                      </td>
                      <td className="p-4 text-foreground">{product.flavor}</td>
                      <td className="p-4 text-foreground font-medium">€{Number(product.price).toFixed(2)}</td>
                      <td className="p-4">
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingProduct(product)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        {(showForm || editingProduct) && (
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            isLoading={createProduct.isPending || updateProduct.isPending}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteProduct.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
