import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePages, useCreatePage, useUpdatePage, useDeletePage } from '@/hooks/usePages';
import { Page, PageInput } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';

function PageForm({
  page,
  onSave,
  onCancel,
  isLoading,
}: {
  page: Page | null;
  onSave: (data: PageInput & { id?: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<PageInput>({
    title: page?.title || '',
    slug: page?.slug || '',
    status: page?.status || 'draft',
    language: page?.language || 'en',
  });

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Auto-generate slug from title if creating new page
      slug: page ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (page) {
      onSave({ ...formData, id: page.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6">
        <h2 className="text-xl font-heading font-bold mb-6">
          {page ? 'Edit Page' : 'Create New Page'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="My New Page"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">/p/</span>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                placeholder="my-new-page"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v: 'draft' | 'published') => setFormData(prev => ({ ...prev, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, language: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : page ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPages() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [languageFilter, setLanguageFilter] = useState<'all' | 'en' | 'it'>('all');

  const { data: pages = [], isLoading } = usePages();
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();
  const { toast } = useToast();

  const filteredPages = pages.filter(page => 
    languageFilter === 'all' || page.language === languageFilter
  );

  const handleSave = async (data: PageInput & { id?: string }) => {
    try {
      if (data.id) {
        await updatePage.mutateAsync({ id: data.id, ...data });
        toast({ title: 'Page updated!' });
      } else {
        const newPage = await createPage.mutateAsync(data);
        toast({ title: 'Page created!' });
        navigate(`/admin/pages/${newPage.id}`);
        return;
      }
      setShowForm(false);
      setEditingPage(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page and all its content?')) return;
    try {
      await deletePage.mutateAsync(id);
      toast({ title: 'Page deleted!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const toggleStatus = async (page: Page) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    try {
      await updatePage.mutateAsync({ id: page.id, status: newStatus });
      toast({ title: `Page ${newStatus === 'published' ? 'published' : 'unpublished'}!` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">Pages</h1>
            <p className="text-muted-foreground mt-1">Create and manage dynamic pages</p>
          </div>
          <Button onClick={() => { setEditingPage(null); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>

        {/* Language Filter */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={languageFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setLanguageFilter('all')}
          >
            All
          </Button>
          <Button
            variant={languageFilter === 'en' ? 'default' : 'outline'}
            onClick={() => setLanguageFilter('en')}
          >
            <Globe className="w-4 h-4 mr-2" />
            English
          </Button>
          <Button
            variant={languageFilter === 'it' ? 'default' : 'outline'}
            onClick={() => setLanguageFilter('it')}
          >
            <Globe className="w-4 h-4 mr-2" />
            Italian
          </Button>
        </div>

        {/* Pages List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No pages yet</p>
            <Button onClick={() => { setEditingPage(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Page
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">URL</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Language</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Updated</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPages.map(page => (
                  <tr key={page.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium">{page.title}</p>
                    </td>
                    <td className="p-4">
                      <code className="text-sm bg-muted px-2 py-1 rounded">/p/{page.slug}</code>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="uppercase">{page.language}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                        {page.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleStatus(page)}
                          title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {page.status === 'published' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/admin/pages/${page.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(page.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <PageForm
            page={editingPage}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingPage(null); }}
            isLoading={createPage.isPending || updatePage.isPending}
          />
        )}
      </div>
    </AdminLayout>
  );
}
