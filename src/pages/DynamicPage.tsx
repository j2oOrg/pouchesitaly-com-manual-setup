import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePageBySlug, usePageBlocks } from '@/hooks/usePages';
import { BlockRenderer } from '@/components/cms/BlockRenderer';
import { SEOHead } from '@/components/SEOHead';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: page, isLoading: pageLoading, error: pageError } = usePageBySlug(slug || '');
  const { data: blocks = [], isLoading: blocksLoading } = usePageBlocks(page?.id || '');

  const isLoading = pageLoading || blocksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pageError || !page) {
    return (
      <>
        <SEOHead
          noindex
          defaultTitle="Pouchesitaly - Page Not Found"
          defaultDescription="The requested content page does not exist."
        />
        <div className="min-h-screen bg-transparent">
          <PageHeader />
          <main className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Page Not Found</h1>
            <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const visibleBlocks = blocks.filter(b => b.is_visible);

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {visibleBlocks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">This page has no content yet.</p>
            </div>
          ) : (
            visibleBlocks.map(block => (
              <BlockRenderer key={block.id} block={block} />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
