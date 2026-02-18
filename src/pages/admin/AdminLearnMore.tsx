import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, BookOpen, Link2, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '@/hooks/useMenuItems';
import { usePages } from '@/hooks/usePages';
import { MenuItem, MenuItemInput } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';

interface LearnMoreFormData {
  title: string;
  title_it: string;
  description: string;
  description_it: string;
  url: string | null;
  page_id: string | null;
  target: '_self' | '_blank';
  is_active: boolean;
}

function LearnMoreForm({
  item,
  onSave,
  onCancel,
  isLoading,
}: {
  item: MenuItem | null;
  onSave: (data: LearnMoreFormData & { id?: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const { data: pages = [] } = usePages();
  const publishedPages = pages.filter(p => p.status === 'published');

  // Parse existing title/description for translations (stored as JSON or plain text)
  const parseTranslations = (value: string | null) => {
    if (!value) return { en: '', it: '' };
    try {
      const parsed = JSON.parse(value);
      return { en: parsed.en || '', it: parsed.it || '' };
    } catch {
      return { en: value, it: '' };
    }
  };

  const existingTitle = parseTranslations(item?.title || null);
  
  const [formData, setFormData] = useState<LearnMoreFormData>({
    title: existingTitle.en || item?.title || '',
    title_it: existingTitle.it || '',
    description: '',
    description_it: '',
    url: item?.url || null,
    page_id: item?.page_id || null,
    target: (item?.target as '_self' | '_blank') || '_self',
    is_active: item?.is_active ?? true,
  });

  const [linkType, setLinkType] = useState<'page' | 'url'>(item?.page_id ? 'page' : 'url');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: LearnMoreFormData & { id?: string } = {
      ...formData,
      url: linkType === 'url' ? formData.url : null,
      page_id: linkType === 'page' ? formData.page_id : null,
    };
    
    if (item) {
      submitData.id = item.id;
    }
    
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold">
              {item ? 'Edit Learn More Link' : 'Add Learn More Link'}
            </h2>
            <p className="text-sm text-muted-foreground">Configure link with translations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title - English */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Titles</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">EN</Badge>
                  Title (English)
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Premium Nicotine Brands"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">IT</Badge>
                  Title (Italian)
                </Label>
                <Input
                  value={formData.title_it}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_it: e.target.value }))}
                  placeholder="Marchi Premium di Nicotina"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Descriptions</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">EN</Badge>
                  Description (English)
                </Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Discover our selection of leading brands..."
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">IT</Badge>
                  Description (Italian)
                </Label>
                <Input
                  value={formData.description_it}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_it: e.target.value }))}
                  placeholder="Scopri la nostra selezione..."
                />
              </div>
            </div>
          </div>

          {/* Link Type Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Link2 className="w-4 h-4" />
              <span>Link Destination</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant={linkType === 'page' ? 'default' : 'outline'}
                onClick={() => setLinkType('page')}
                className="flex-1"
              >
                Link to Page
              </Button>
              <Button
                type="button"
                variant={linkType === 'url' ? 'default' : 'outline'}
                onClick={() => setLinkType('url')}
                className="flex-1"
              >
                Custom URL
              </Button>
            </div>

            {linkType === 'page' ? (
              <div className="space-y-2">
                <Label>Select Page</Label>
                <Select
                  value={formData.page_id || ''}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, page_id: v || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a page..." />
                  </SelectTrigger>
                  <SelectContent>
                    {publishedPages.map(page => (
                      <SelectItem key={page.id} value={page.id}>
                        <span className="flex items-center gap-2">
                          {page.title}
                          <Badge variant="outline" className="text-xs uppercase">{page.language}</Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {publishedPages.length === 0 && (
                  <p className="text-sm text-muted-foreground">No published pages available. Create and publish a page first.</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={formData.url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value || null }))}
                  placeholder="/shipping-info or https://..."
                />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="_self">Same Window</SelectItem>
                  <SelectItem value="_blank">New Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-3 h-10 px-3 rounded-md border border-input bg-background">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <span className="text-sm">{formData.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : item ? 'Save Changes' : 'Add Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminLearnMore() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const { data: allItems = [], isLoading } = useMenuItems();
  const { data: pages = [] } = usePages();
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const { toast } = useToast();

  // Filter to only show learn_more items
  const learnMoreItems = allItems.filter(item => item.menu_location === 'learn_more');

  const getPageTitle = (pageId: string | null) => {
    if (!pageId) return null;
    const page = pages.find(p => p.id === pageId);
    return page?.title || 'Unknown Page';
  };

  const handleSave = async (data: LearnMoreFormData & { id?: string }) => {
    try {
      // Store translations in title as JSON
      const titleWithTranslations = JSON.stringify({
        en: data.title,
        it: data.title_it,
        description_en: data.description,
        description_it: data.description_it,
      });

      const menuItemData: MenuItemInput = {
        menu_location: 'learn_more' as any,
        title: titleWithTranslations,
        url: data.url,
        page_id: data.page_id,
        target: data.target,
        is_active: data.is_active,
      };

      if (data.id) {
        await updateItem.mutateAsync({ id: data.id, ...menuItemData });
        toast({ title: 'Link updated successfully!' });
      } else {
        await createItem.mutateAsync(menuItemData);
        toast({ title: 'Link added successfully!' });
      }
      
      setShowForm(false);
      setEditingItem(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this Learn More link?')) return;
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: 'Link deleted!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const toggleActive = async (item: MenuItem) => {
    try {
      await updateItem.mutateAsync({ id: item.id, is_active: !item.is_active });
      toast({ title: item.is_active ? 'Link deactivated' : 'Link activated' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const parseTitle = (title: string) => {
    try {
      const parsed = JSON.parse(title);
      return {
        en: parsed.en || title,
        it: parsed.it || '',
        description_en: parsed.description_en || '',
        description_it: parsed.description_it || '',
      };
    } catch {
      return { en: title, it: '', description_en: '', description_it: '' };
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold">Learn More</h1>
                <p className="text-muted-foreground">Manage informational links with localization</p>
              </div>
            </div>
          </div>
          <Button onClick={() => { setEditingItem(null); setShowForm(true); }} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 mb-8 border border-primary/20">
          <h3 className="font-heading font-semibold mb-2">How Learn More Links Work</h3>
          <p className="text-sm text-muted-foreground">
            These links appear in the "Learn More" section on your site. Each link can point to a CMS page or custom URL, 
            with full support for English and Italian translations.
          </p>
        </div>

        {/* Links List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : learnMoreItems.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">No Learn More links yet</h3>
            <p className="text-muted-foreground mb-6">Add links to help users discover more about your products and services.</p>
            <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Link
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {learnMoreItems.map(item => {
              const parsed = parseTitle(item.title);
              const pageTitle = getPageTitle(item.page_id);
              
              return (
                <div 
                  key={item.id} 
                  className={`bg-card rounded-xl border transition-all hover:shadow-md ${
                    item.is_active ? 'border-border' : 'border-border/50 opacity-60'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Titles */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading font-semibold text-lg truncate">{parsed.en}</h3>
                          {!item.is_active && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        
                        {parsed.it && (
                          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">IT</Badge>
                            {parsed.it}
                          </p>
                        )}

                        {/* Description preview */}
                        {parsed.description_en && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                            {parsed.description_en}
                          </p>
                        )}

                        {/* Link info */}
                        <div className="flex items-center gap-2 text-sm">
                          <Link2 className="w-4 h-4 text-muted-foreground" />
                          {pageTitle ? (
                            <span className="text-primary">Page: {pageTitle}</span>
                          ) : item.url ? (
                            <code className="bg-muted px-2 py-0.5 rounded text-xs">{item.url}</code>
                          ) : (
                            <span className="text-muted-foreground">No link set</span>
                          )}
                          {item.target === '_blank' && (
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(item)}
                          title={item.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {item.is_active ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingItem(item); setShowForm(true); }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <LearnMoreForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
            isLoading={createItem.isPending || updateItem.isPending}
          />
        )}
      </div>
    </AdminLayout>
  );
}
