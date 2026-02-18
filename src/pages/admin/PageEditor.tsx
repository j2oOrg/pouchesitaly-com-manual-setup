import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Eye, Loader2, GripVertical, Trash2, EyeOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePage, useUpdatePage } from '@/hooks/usePages';
import { usePageBlocks, useCreateBlock, useUpdateBlock, useDeleteBlock, useReorderBlocks } from '@/hooks/usePages';
import { PageBlock, BlockType, BLOCK_DEFINITIONS, BlockContent } from '@/types/cms';
import { BlockRenderer } from '@/components/cms/BlockRenderer';
import { BlockEditor } from '@/components/cms/BlockEditor';
import { BlockPicker } from '@/components/cms/BlockPicker';
import { useToast } from '@/hooks/use-toast';

export default function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isPreview, setIsPreview] = useState(false);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number>(0);

  const { data: page, isLoading: pageLoading } = usePage(id!);
  const { data: blocks = [], isLoading: blocksLoading } = usePageBlocks(id!);
  const updatePage = useUpdatePage();
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  const reorderBlocks = useReorderBlocks();

  const isLoading = pageLoading || blocksLoading;

  const handleAddBlock = async (blockType: BlockType) => {
    if (!id) return;
    try {
      const definition = BLOCK_DEFINITIONS[blockType];
      await createBlock.mutateAsync({
        page_id: id,
        block_type: blockType,
        content: definition.defaultContent,
        position: insertPosition,
      });
      
      // Reorder blocks after insert
      const newBlocks = blocks.map(b => ({
        id: b.id,
        position: b.position >= insertPosition ? b.position + 1 : b.position,
      }));
      if (newBlocks.length > 0) {
        await reorderBlocks.mutateAsync({ pageId: id, blocks: newBlocks });
      }
      
      setShowBlockPicker(false);
      toast({ title: 'Block added!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateBlock = async (blockId: string, content: BlockContent) => {
    if (!id) return;
    try {
      await updateBlock.mutateAsync({ id: blockId, pageId: id, content });
      setEditingBlock(null);
      toast({ title: 'Block updated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!id || !confirm('Delete this block?')) return;
    try {
      await deleteBlock.mutateAsync({ id: blockId, pageId: id });
      toast({ title: 'Block deleted!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleToggleVisibility = async (block: PageBlock) => {
    if (!id) return;
    try {
      await updateBlock.mutateAsync({ 
        id: block.id, 
        pageId: id, 
        is_visible: !block.is_visible 
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handlePublish = async () => {
    if (!page) return;
    try {
      await updatePage.mutateAsync({ 
        id: page.id, 
        status: page.status === 'published' ? 'draft' : 'published' 
      });
      toast({ 
        title: page.status === 'published' ? 'Page unpublished' : 'Page published!' 
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const moveBlock = async (blockId: string, direction: 'up' | 'down') => {
    if (!id) return;
    const currentIndex = blocks.findIndex(b => b.id === blockId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];
    
    const updates = newBlocks.map((b, i) => ({ id: b.id, position: i }));
    
    try {
      await reorderBlocks.mutateAsync({ pageId: id, blocks: updates });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!page) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Page not found</p>
          <Button onClick={() => navigate('/admin/pages')} className="mt-4">
            Back to Pages
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-screen">
        {/* Editor Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pages')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-heading font-bold">{page.title}</h1>
              <p className="text-sm text-muted-foreground">/p/{page.slug}</p>
            </div>
            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
              {page.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? <Settings className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button 
              onClick={handlePublish}
              variant={page.status === 'published' ? 'outline' : 'default'}
              disabled={updatePage.isPending}
            >
              {updatePage.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : page.status === 'published' ? (
                'Unpublish'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto bg-muted/30">
          <div className="max-w-4xl mx-auto py-8">
            {/* Add block at top */}
            {!isPreview && (
              <div className="flex justify-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setInsertPosition(0); setShowBlockPicker(true); }}
                  className="opacity-50 hover:opacity-100"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Block
                </Button>
              </div>
            )}

            {/* Blocks */}
            {blocks.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground mb-4">No content blocks yet</p>
                <Button onClick={() => { setInsertPosition(0); setShowBlockPicker(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Block
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div key={block.id} className="group">
                    {isPreview ? (
                      block.is_visible && <BlockRenderer block={block} />
                    ) : (
                      <div className={`relative bg-card rounded-xl border ${block.is_visible ? 'border-border' : 'border-dashed border-muted-foreground/30 opacity-50'}`}>
                        {/* Block Controls */}
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => moveBlock(block.id, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-muted disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <GripVertical className="w-4 h-4 text-muted-foreground mx-auto" />
                          <button
                            onClick={() => moveBlock(block.id, 'down')}
                            disabled={index === blocks.length - 1}
                            className="p-1 rounded hover:bg-muted disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Block Header */}
                        <div className="flex items-center justify-between p-3 border-b border-border">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {BLOCK_DEFINITIONS[block.block_type as BlockType]?.label || block.block_type}
                            </Badge>
                            {!block.is_visible && (
                              <span className="text-xs text-muted-foreground">(Hidden)</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleVisibility(block)}
                            >
                              {block.is_visible ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingBlock(block)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteBlock(block.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {/* Block Preview */}
                        <div className="p-4" onClick={() => setEditingBlock(block)}>
                          <BlockRenderer block={block} isEditing />
                        </div>
                      </div>
                    )}

                    {/* Add block between */}
                    {!isPreview && (
                      <div className="flex justify-center my-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setInsertPosition(index + 1); setShowBlockPicker(true); }}
                          className="opacity-0 group-hover:opacity-50 hover:!opacity-100"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <BlockPicker
          onSelect={handleAddBlock}
          onClose={() => setShowBlockPicker(false)}
          isLoading={createBlock.isPending}
        />
      )}

      {/* Block Editor Modal */}
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          onSave={(content) => handleUpdateBlock(editingBlock.id, content)}
          onClose={() => setEditingBlock(null)}
          isLoading={updateBlock.isPending}
        />
      )}
    </AdminLayout>
  );
}
