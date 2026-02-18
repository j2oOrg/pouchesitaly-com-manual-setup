import { useState, useEffect } from 'react';
import { X, Loader2, Globe, Share2, Twitter, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageMetadata, PageMetadataInput } from '@/hooks/usePageMetadata';
import { MetadataImageUpload } from './MetadataImageUpload';

interface MetadataFormProps {
  metadata: PageMetadata | null;
  onSubmit: (data: PageMetadataInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MetadataForm({ metadata, onSubmit, onCancel, isLoading }: MetadataFormProps) {
  const [formData, setFormData] = useState<PageMetadataInput>({
    page_path: '',
    language: 'en',
    title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    keywords: '',
    canonical_url: '',
  });

  useEffect(() => {
    if (metadata) {
      setFormData({
        page_path: metadata.page_path,
        language: metadata.language,
        title: metadata.title || '',
        meta_description: metadata.meta_description || '',
        og_title: metadata.og_title || '',
        og_description: metadata.og_description || '',
        og_image: metadata.og_image || '',
        twitter_card: metadata.twitter_card || 'summary_large_image',
        twitter_title: metadata.twitter_title || '',
        twitter_description: metadata.twitter_description || '',
        twitter_image: metadata.twitter_image || '',
        keywords: metadata.keywords || '',
        canonical_url: metadata.canonical_url || '',
      });
    }
  }, [metadata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateField = (field: keyof PageMetadataInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const titleLength = formData.title?.length || 0;
  const descriptionLength = formData.meta_description?.length || 0;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Edit Page Metadata
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {metadata?.page_path} ({metadata?.language?.toUpperCase()})
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="opengraph" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Open Graph
              </TabsTrigger>
              <TabsTrigger value="twitter" className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Page Title
                  <span className={`ml-2 text-xs ${titleLength > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    ({titleLength}/60)
                  </span>
                </Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Page title for search engines"
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Keep under 60 characters for optimal display in search results
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">
                  Meta Description
                  <span className={`ml-2 text-xs ${descriptionLength > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    ({descriptionLength}/160)
                  </span>
                </Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description || ''}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  placeholder="Brief description for search results"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Keep under 160 characters for optimal display
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords || ''}
                  onChange={(e) => updateField('keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of relevant keywords
                </p>
              </div>
            </TabsContent>

            <TabsContent value="opengraph" className="space-y-4">
              <div className="p-4 bg-muted rounded-lg mb-4">
                <p className="text-sm text-muted-foreground">
                  Open Graph tags control how your page appears when shared on Facebook, LinkedIn, and other platforms.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={formData.og_title || ''}
                  onChange={(e) => updateField('og_title', e.target.value)}
                  placeholder="Leave empty to use page title"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  value={formData.og_description || ''}
                  onChange={(e) => updateField('og_description', e.target.value)}
                  placeholder="Leave empty to use meta description"
                  rows={3}
                />
              </div>

              <MetadataImageUpload
                label="OG Image"
                value={formData.og_image || ''}
                onChange={(url) => updateField('og_image', url)}
                recommendedSize="1200x630 pixels"
              />
            </TabsContent>

            <TabsContent value="twitter" className="space-y-4">
              <div className="p-4 bg-muted rounded-lg mb-4">
                <p className="text-sm text-muted-foreground">
                  Twitter Card tags control how your page appears when shared on Twitter/X.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_card">Card Type</Label>
                <select
                  id="twitter_card"
                  value={formData.twitter_card || 'summary_large_image'}
                  onChange={(e) => updateField('twitter_card', e.target.value)}
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary with Large Image</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_title">Twitter Title</Label>
                <Input
                  id="twitter_title"
                  value={formData.twitter_title || ''}
                  onChange={(e) => updateField('twitter_title', e.target.value)}
                  placeholder="Leave empty to use OG/page title"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_description">Twitter Description</Label>
                <Textarea
                  id="twitter_description"
                  value={formData.twitter_description || ''}
                  onChange={(e) => updateField('twitter_description', e.target.value)}
                  placeholder="Leave empty to use OG/meta description"
                  rows={3}
                />
              </div>

              <MetadataImageUpload
                label="Twitter Image"
                value={formData.twitter_image || ''}
                onChange={(url) => updateField('twitter_image', url)}
                recommendedSize="1200x600 pixels (or leave empty to use OG image)"
              />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  value={formData.canonical_url || ''}
                  onChange={(e) => updateField('canonical_url', e.target.value)}
                  placeholder="https://example.com/page"
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  The preferred URL for this page. Leave empty to use the current URL.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
