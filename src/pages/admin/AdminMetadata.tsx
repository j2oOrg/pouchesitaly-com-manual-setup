import { useState } from 'react';
import { Pencil, Search, Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MetadataForm } from '@/components/admin/MetadataForm';
import { 
  useAllPageMetadata, 
  useUpdatePageMetadata,
  PageMetadata,
  PageMetadataInput 
} from '@/hooks/usePageMetadata';
import { useToast } from '@/hooks/use-toast';

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/premium-brands': 'Premium Brands',
  '/shipping-info': 'Shipping Info',
  '/why-choose-us': 'Why Choose Us',
  '/strengths-guide': 'Strengths Guide',
  '/tobacco-free': 'Tobacco Free',
  '/faq': 'FAQ',
  '/snus-brands': 'Marchi Snus',
  '/snus-cose': 'Cos\'è lo Snus',
  '/spedizione-snus': 'Spedizione Snus',
  '/perche-scegliere-pouchesitaly': 'Perché Pouchesitaly',
  '/guida-intensita-gusti': 'Guida Intensità',
  '/snus-vs-nicotine-pouches': 'Snus vs Pouches',
  '/domande-frequenti-snus': 'Domande Frequenti',
};

export default function AdminMetadata() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMetadata, setEditingMetadata] = useState<PageMetadata | null>(null);
  const [languageFilter, setLanguageFilter] = useState<'all' | 'en' | 'it'>('all');
  
  const { data: allMetadata, isLoading } = useAllPageMetadata();
  const updateMetadata = useUpdatePageMetadata();
  const { toast } = useToast();

  const filteredMetadata = allMetadata?.filter(meta => {
    const matchesSearch = 
      meta.page_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      PAGE_LABELS[meta.page_path]?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = languageFilter === 'all' || meta.language === languageFilter;
    
    return matchesSearch && matchesLanguage;
  }) || [];

  const handleUpdate = async (data: PageMetadataInput) => {
    if (!editingMetadata) return;
    try {
      await updateMetadata.mutateAsync({ id: editingMetadata.id, ...data });
      toast({ title: 'Metadata updated successfully!' });
      setEditingMetadata(null);
    } catch (error: any) {
      toast({ title: 'Error updating metadata', description: error.message, variant: 'destructive' });
    }
  };

  const getCompletionStatus = (meta: PageMetadata) => {
    const fields = [meta.title, meta.meta_description, meta.og_title, meta.og_image];
    const filled = fields.filter(f => f && f.trim() !== '').length;
    return { filled, total: fields.length };
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Page Metadata</h1>
            <p className="text-muted-foreground mt-1">Manage SEO and social sharing settings for all pages</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
          <div className="flex gap-2">
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
        </div>

        {/* Metadata by Language */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredMetadata.length === 0 ? (
          <div className="bg-card rounded-xl border border-border text-center py-12">
            <p className="text-muted-foreground">No pages found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Group by language */}
            {(['en', 'it'] as const)
              .filter(lang => languageFilter === 'all' || languageFilter === lang)
              .map(lang => {
                const langMetadata = filteredMetadata.filter(m => m.language === lang);
                if (langMetadata.length === 0) return null;
                
                return (
                  <div key={lang} className="space-y-4">
                    {/* Language Header */}
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-heading font-semibold text-foreground">
                        {lang === 'en' ? 'English' : 'Italian'}
                      </h2>
                      <Badge variant="secondary" className="uppercase">
                        {langMetadata.length} pages
                      </Badge>
                    </div>
                    
                    {/* Table for this language */}
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-4 font-medium text-muted-foreground">Page</th>
                              <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                              <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                              <th className="text-left p-4 font-medium text-muted-foreground">Completion</th>
                              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {langMetadata.map((meta) => {
                              const completion = getCompletionStatus(meta);
                              const pageLabel = PAGE_LABELS[meta.page_path] || meta.page_path;
                              
                              return (
                                <tr key={meta.id} className="hover:bg-muted/50 transition-colors">
                                  <td className="p-4">
                                    <div>
                                      <p className="font-medium text-foreground">{pageLabel}</p>
                                      <p className="text-sm text-muted-foreground">{meta.page_path}</p>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <p className="text-foreground max-w-xs truncate">
                                      {meta.title || <span className="text-muted-foreground italic">Not set</span>}
                                    </p>
                                  </td>
                                  <td className="p-4">
                                    <p className="text-muted-foreground max-w-xs truncate">
                                      {meta.meta_description || <span className="italic">Not set</span>}
                                    </p>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-primary rounded-full transition-all"
                                          style={{ width: `${(completion.filled / completion.total) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        {completion.filled}/{completion.total}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center justify-end">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingMetadata(meta)}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Metadata Form Modal */}
        {editingMetadata && (
          <MetadataForm
            metadata={editingMetadata}
            onSubmit={handleUpdate}
            onCancel={() => setEditingMetadata(null)}
            isLoading={updateMetadata.isPending}
          />
        )}
      </div>
    </AdminLayout>
  );
}

