import { useState } from 'react';
import { Plus, GripVertical, Pencil, Trash2, ChevronRight, ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAllMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '@/hooks/useMenuItems';
import { usePages } from '@/hooks/usePages';
import { MenuItem, MenuItemInput } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';

function MenuItemRow({ 
  item, 
  level = 0, 
  onEdit, 
  onDelete,
  allItems,
}: { 
  item: MenuItem; 
  level?: number;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  allItems: MenuItem[];
}) {
  const [expanded, setExpanded] = useState(true);
  const children = allItems.filter(i => i.parent_id === item.id).sort((a, b) => a.position - b.position);
  const hasChildren = children.length > 0;

  return (
    <>
      <div 
        className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
        style={{ marginLeft: level * 24 }}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
        
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="p-1">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{item.title}</span>
            {item.target === '_blank' && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground">{item.url || '(No URL)'}</p>
        </div>

        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'Active' : 'Hidden'}
        </Badge>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {expanded && children.map(child => (
        <MenuItemRow 
          key={child.id} 
          item={child} 
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          allItems={allItems}
        />
      ))}
    </>
  );
}

function MenuItemForm({
  item,
  allItems,
  pages,
  location,
  onSave,
  onCancel,
  isLoading,
}: {
  item: MenuItem | null;
  allItems: MenuItem[];
  pages: { id: string; title: string; slug: string }[];
  location: 'header' | 'footer';
  onSave: (data: MenuItemInput & { id?: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<MenuItemInput>({
    menu_location: item?.menu_location || location,
    title: item?.title || '',
    url: item?.url || '',
    page_id: item?.page_id || null,
    parent_id: item?.parent_id || null,
    target: item?.target || '_self',
    is_active: item?.is_active ?? true,
    position: item?.position ?? 0,
  });
  const [linkType, setLinkType] = useState<'url' | 'page'>(item?.page_id ? 'page' : 'url');

  const availableParents = allItems.filter(i => i.id !== item?.id && i.menu_location === location);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      url: linkType === 'url' ? formData.url : null,
      page_id: linkType === 'page' ? formData.page_id : null,
    };
    if (item) {
      onSave({ ...data, id: item.id });
    } else {
      onSave(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6">
        <h2 className="text-xl font-heading font-bold mb-6">
          {item ? 'Edit Menu Item' : 'Add Menu Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Menu item title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Link Type</Label>
            <Select value={linkType} onValueChange={(v: 'url' | 'page') => setLinkType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url">External URL</SelectItem>
                <SelectItem value="page">Dynamic Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {linkType === 'url' ? (
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={formData.url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="/page or https://..."
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Page</Label>
              <Select 
                value={formData.page_id || ''} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, page_id: v || null }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map(page => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title} (/{page.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Parent Item</Label>
            <Select 
              value={formData.parent_id || 'none'} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, parent_id: v === 'none' ? null : v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="No parent (top level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent (top level)</SelectItem>
                {availableParents.map(parent => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Open in</Label>
            <Select 
              value={formData.target} 
              onValueChange={(v: '_self' | '_blank') => setFormData(prev => ({ ...prev, target: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Same tab</SelectItem>
                <SelectItem value="_blank">New tab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label>Active</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminMenus() {
  const [activeLocation, setActiveLocation] = useState<'header' | 'footer'>('header');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: allItems = [], isLoading } = useAllMenuItems();
  const { data: pages = [] } = usePages();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const { toast } = useToast();

  const locationItems = allItems
    .filter(item => item.menu_location === activeLocation && !item.parent_id)
    .sort((a, b) => a.position - b.position);

  const handleSave = async (data: MenuItemInput & { id?: string }) => {
    try {
      if (data.id) {
        await updateMenuItem.mutateAsync({ id: data.id, ...data });
        toast({ title: 'Menu item updated!' });
      } else {
        // Set position to end of list
        const maxPosition = Math.max(0, ...locationItems.map(i => i.position));
        await createMenuItem.mutateAsync({ ...data, position: maxPosition + 1 });
        toast({ title: 'Menu item created!' });
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item and all its children?')) return;
    try {
      await deleteMenuItem.mutateAsync(id);
      toast({ title: 'Menu item deleted!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">Menu Management</h1>
            <p className="text-muted-foreground mt-1">Manage navigation menus for your site</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Location Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeLocation === 'header' ? 'default' : 'outline'}
            onClick={() => setActiveLocation('header')}
          >
            Header Menu
          </Button>
          <Button
            variant={activeLocation === 'footer' ? 'default' : 'outline'}
            onClick={() => setActiveLocation('footer')}
          >
            Footer Menu
          </Button>
        </div>

        {/* Menu Items */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : locationItems.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="text-muted-foreground mb-4">No menu items yet</p>
            <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {locationItems.map(item => (
              <MenuItemRow
                key={item.id}
                item={item}
                allItems={allItems.filter(i => i.menu_location === activeLocation)}
                onEdit={(item) => { setEditingItem(item); setShowForm(true); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <MenuItemForm
            item={editingItem}
            allItems={allItems}
            pages={pages}
            location={activeLocation}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
            isLoading={createMenuItem.isPending || updateMenuItem.isPending}
          />
        )}
      </div>
    </AdminLayout>
  );
}
