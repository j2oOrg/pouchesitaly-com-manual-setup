import { useState } from 'react';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageBlock, BlockType, BlockContent, HeroContent, TextContent, ImageContent, CTAContent, CardsContent, FAQContent, SpacerContent, VideoContent, TestimonialContent, BLOCK_DEFINITIONS } from '@/types/cms';
import { MetadataImageUpload } from '@/components/admin/MetadataImageUpload';

interface BlockEditorProps {
  block: PageBlock;
  onSave: (content: BlockContent) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function BlockEditor({ block, onSave, onClose, isLoading }: BlockEditorProps) {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(content);
  };

  const updateContent = (updates: Partial<BlockContent>) => {
    setContent(prev => ({ ...prev, ...updates }));
  };

  const blockLabel = BLOCK_DEFINITIONS[block.block_type as BlockType]?.label || block.block_type;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-heading font-bold">Edit {blockLabel}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {renderEditor(block.block_type as BlockType, content, updateContent)}
          </div>
        </form>

        <div className="flex justify-end gap-3 p-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function renderEditor(type: BlockType, content: any, update: (updates: any) => void) {
  switch (type) {
    case 'hero':
      return <HeroEditor content={content} update={update} />;
    case 'text':
      return <TextEditor content={content} update={update} />;
    case 'image':
      return <ImageEditor content={content} update={update} />;
    case 'cta':
      return <CTAEditor content={content} update={update} />;
    case 'cards':
      return <CardsEditor content={content} update={update} />;
    case 'faq':
      return <FAQEditor content={content} update={update} />;
    case 'spacer':
      return <SpacerEditor content={content} update={update} />;
    case 'video':
      return <VideoEditor content={content} update={update} />;
    case 'testimonial':
      return <TestimonialEditor content={content} update={update} />;
    default:
      return <p className="text-muted-foreground">No editor available for this block type</p>;
  }
}

function HeroEditor({ content, update }: { content: HeroContent; update: (c: Partial<HeroContent>) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={content.title || ''} onChange={e => update({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Textarea value={content.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} rows={2} />
      </div>
      <MetadataImageUpload
        label="Background Image"
        value={content.backgroundImage || ''}
        onChange={url => update({ backgroundImage: url })}
        recommendedSize="1920x800 pixels"
      />
      <div className="flex items-center gap-3">
        <Switch checked={content.overlay || false} onCheckedChange={checked => update({ overlay: checked })} />
        <Label>Dark overlay</Label>
      </div>
      <div className="space-y-2">
        <Label>Alignment</Label>
        <Select value={content.alignment || 'center'} onValueChange={v => update({ alignment: v as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input value={content.buttonText || ''} onChange={e => update({ buttonText: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Button URL</Label>
          <Input value={content.buttonUrl || ''} onChange={e => update({ buttonUrl: e.target.value })} />
        </div>
      </div>
    </>
  );
}

function TextEditor({ content, update }: { content: TextContent; update: (c: Partial<TextContent>) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Content (HTML)</Label>
        <Textarea 
          value={content.content || ''} 
          onChange={e => update({ content: e.target.value })} 
          rows={10}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">Supports HTML: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, etc.</p>
      </div>
      <div className="space-y-2">
        <Label>Alignment</Label>
        <Select value={content.alignment || 'left'} onValueChange={v => update({ alignment: v as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function ImageEditor({ content, update }: { content: ImageContent; update: (c: Partial<ImageContent>) => void }) {
  return (
    <>
      <MetadataImageUpload
        label="Image"
        value={content.src || ''}
        onChange={url => update({ src: url })}
        recommendedSize="1200x800 pixels"
      />
      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input value={content.alt || ''} onChange={e => update({ alt: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Caption</Label>
        <Input value={content.caption || ''} onChange={e => update({ caption: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Width</Label>
        <Select value={content.width || 'full'} onValueChange={v => update({ width: v as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function CTAEditor({ content, update }: { content: CTAContent; update: (c: Partial<CTAContent>) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={content.title || ''} onChange={e => update({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={content.description || ''} onChange={e => update({ description: e.target.value })} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input value={content.buttonText || ''} onChange={e => update({ buttonText: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Button URL</Label>
          <Input value={content.buttonUrl || ''} onChange={e => update({ buttonUrl: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Button Style</Label>
        <Select value={content.variant || 'primary'} onValueChange={v => update({ variant: v as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function CardsEditor({ content, update }: { content: CardsContent; update: (c: Partial<CardsContent>) => void }) {
  const items = content.items || [];

  const addItem = () => {
    update({ items: [...items, { title: 'New Card', description: '' }] });
  };

  const updateItem = (index: number, updates: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    update({ items: newItems });
  };

  const removeItem = (index: number) => {
    update({ items: items.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input value={content.title || ''} onChange={e => update({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Columns</Label>
        <Select value={String(content.columns || 3)} onValueChange={v => update({ columns: Number(v) as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Cards</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Add Card
          </Button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Card {index + 1}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Input placeholder="Title" value={item.title} onChange={e => updateItem(index, { title: e.target.value })} />
            <Textarea placeholder="Description" value={item.description || ''} onChange={e => updateItem(index, { description: e.target.value })} rows={2} />
            <Input placeholder="Button text" value={item.buttonText || ''} onChange={e => updateItem(index, { buttonText: e.target.value })} />
            <Input placeholder="Button URL" value={item.buttonUrl || ''} onChange={e => updateItem(index, { buttonUrl: e.target.value })} />
          </div>
        ))}
      </div>
    </>
  );
}

function FAQEditor({ content, update }: { content: FAQContent; update: (c: Partial<FAQContent>) => void }) {
  const items = content.items || [];

  const addItem = () => {
    update({ items: [...items, { question: 'New Question?', answer: 'Answer here...' }] });
  };

  const updateItem = (index: number, updates: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    update({ items: newItems });
  };

  const removeItem = (index: number) => {
    update({ items: items.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input value={content.title || ''} onChange={e => update({ title: e.target.value })} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Questions</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Add Question
          </Button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Q{index + 1}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Input placeholder="Question" value={item.question} onChange={e => updateItem(index, { question: e.target.value })} />
            <Textarea placeholder="Answer" value={item.answer} onChange={e => updateItem(index, { answer: e.target.value })} rows={3} />
          </div>
        ))}
      </div>
    </>
  );
}

function SpacerEditor({ content, update }: { content: SpacerContent; update: (c: Partial<SpacerContent>) => void }) {
  return (
    <div className="space-y-2">
      <Label>Height</Label>
      <Select value={content.height || 'medium'} onValueChange={v => update({ height: v as any })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="small">Small (32px)</SelectItem>
          <SelectItem value="medium">Medium (64px)</SelectItem>
          <SelectItem value="large">Large (96px)</SelectItem>
          <SelectItem value="xlarge">Extra Large (128px)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function VideoEditor({ content, update }: { content: VideoContent; update: (c: Partial<VideoContent>) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Video URL</Label>
        <Input 
          value={content.url || ''} 
          onChange={e => update({ url: e.target.value })}
          placeholder="YouTube or Vimeo URL"
        />
        <p className="text-xs text-muted-foreground">Supports YouTube and Vimeo URLs</p>
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={content.title || ''} onChange={e => update({ title: e.target.value })} />
      </div>
    </>
  );
}

function TestimonialEditor({ content, update }: { content: TestimonialContent; update: (c: Partial<TestimonialContent>) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Quote</Label>
        <Textarea value={content.quote || ''} onChange={e => update({ quote: e.target.value })} rows={3} />
      </div>
      <div className="space-y-2">
        <Label>Author Name</Label>
        <Input value={content.author || ''} onChange={e => update({ author: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Author Role</Label>
        <Input value={content.role || ''} onChange={e => update({ role: e.target.value })} />
      </div>
      <MetadataImageUpload
        label="Author Photo"
        value={content.image || ''}
        onChange={url => update({ image: url })}
        recommendedSize="100x100 pixels"
      />
    </>
  );
}
