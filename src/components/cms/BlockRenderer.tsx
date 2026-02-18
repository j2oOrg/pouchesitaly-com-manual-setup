import { PageBlock, BlockType, HeroContent, TextContent, ImageContent, CTAContent, CardsContent, FAQContent, SpacerContent, VideoContent, TestimonialContent } from '@/types/cms';

interface BlockRendererProps {
  block: PageBlock;
  isEditing?: boolean;
}

export function BlockRenderer({ block, isEditing }: BlockRendererProps) {
  const content = block.content as any;

  switch (block.block_type as BlockType) {
    case 'hero':
      return <HeroBlock content={content} isEditing={isEditing} />;
    case 'text':
      return <TextBlock content={content} isEditing={isEditing} />;
    case 'image':
      return <ImageBlock content={content} isEditing={isEditing} />;
    case 'cta':
      return <CTABlock content={content} isEditing={isEditing} />;
    case 'cards':
      return <CardsBlock content={content} isEditing={isEditing} />;
    case 'faq':
      return <FAQBlock content={content} isEditing={isEditing} />;
    case 'spacer':
      return <SpacerBlock content={content} />;
    case 'video':
      return <VideoBlock content={content} isEditing={isEditing} />;
    case 'testimonial':
      return <TestimonialBlock content={content} isEditing={isEditing} />;
    default:
      return (
        <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
          Unknown block type: {block.block_type}
        </div>
      );
  }
}

function HeroBlock({ content, isEditing }: { content: HeroContent; isEditing?: boolean }) {
  const alignment = content.alignment || 'center';
  const alignClass = alignment === 'left' ? 'text-left items-start' : alignment === 'right' ? 'text-right items-end' : 'text-center items-center';

  return (
    <div
      className={`relative py-16 px-8 rounded-xl overflow-hidden ${alignClass} flex flex-col justify-center min-h-[300px]`}
      style={{
        backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {content.overlay && content.backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div className="relative z-10">
        <h1 className={`text-4xl md:text-5xl font-heading font-bold ${content.backgroundImage ? 'text-white' : 'text-foreground'}`}>
          {content.title || 'Hero Title'}
        </h1>
        {content.subtitle && (
          <p className={`mt-4 text-lg ${content.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}>
            {content.subtitle}
          </p>
        )}
        {content.buttonText && (
          <button className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            {content.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

function TextBlock({ content, isEditing }: { content: TextContent; isEditing?: boolean }) {
  const alignment = content.alignment || 'left';
  
  return (
    <div 
      className={`prose prose-sm max-w-none text-${alignment}`}
      dangerouslySetInnerHTML={{ __html: content.content || '<p>Enter your text here...</p>' }}
    />
  );
}

function ImageBlock({ content, isEditing }: { content: ImageContent; isEditing?: boolean }) {
  const widthClass = content.width === 'small' ? 'max-w-sm' : content.width === 'medium' ? 'max-w-2xl' : 'w-full';

  if (!content.src) {
    return (
      <div className={`${widthClass} mx-auto aspect-video bg-muted rounded-lg flex items-center justify-center`}>
        <span className="text-muted-foreground">No image selected</span>
      </div>
    );
  }

  return (
    <figure className={`${widthClass} mx-auto`}>
      <img
        src={content.src}
        alt={content.alt || ''}
        className="w-full rounded-lg"
      />
      {content.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {content.caption}
        </figcaption>
      )}
    </figure>
  );
}

function CTABlock({ content, isEditing }: { content: CTAContent; isEditing?: boolean }) {
  return (
    <div 
      className="p-8 rounded-xl text-center"
      style={{ backgroundColor: content.backgroundColor || 'hsl(var(--primary) / 0.1)' }}
    >
      <h2 className="text-2xl font-heading font-bold text-foreground">
        {content.title || 'Call to Action'}
      </h2>
      {content.description && (
        <p className="mt-2 text-muted-foreground">{content.description}</p>
      )}
      <button className={`mt-4 px-6 py-3 rounded-lg font-medium transition-colors ${
        content.variant === 'outline' 
          ? 'border-2 border-primary text-primary hover:bg-primary/10' 
          : content.variant === 'secondary'
          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }`}>
        {content.buttonText || 'Click Here'}
      </button>
    </div>
  );
}

function CardsBlock({ content, isEditing }: { content: CardsContent; isEditing?: boolean }) {
  const columns = content.columns || 3;
  const gridClass = columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div>
      {content.title && (
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
          {content.title}
        </h2>
      )}
      <div className={`grid gap-4 ${gridClass}`}>
        {(content.items || []).map((item, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-4">
            {item.image && (
              <img src={item.image} alt="" className="w-full aspect-video object-cover rounded-lg mb-3" />
            )}
            <h3 className="font-medium text-foreground">{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            )}
            {item.buttonText && (
              <button className="mt-3 text-sm text-primary hover:underline">
                {item.buttonText} →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQBlock({ content, isEditing }: { content: FAQContent; isEditing?: boolean }) {
  return (
    <div>
      {content.title && (
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
          {content.title}
        </h2>
      )}
      <div className="space-y-3">
        {(content.items || []).map((item, index) => (
          <details key={index} className="group bg-card border border-border rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium">
              {item.question}
              <span className="ml-2 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function SpacerBlock({ content }: { content: SpacerContent }) {
  const heights = { small: 'h-8', medium: 'h-16', large: 'h-24', xlarge: 'h-32' };
  return <div className={heights[content.height] || 'h-16'} />;
}

function VideoBlock({ content, isEditing }: { content: VideoContent; isEditing?: boolean }) {
  // Extract YouTube/Vimeo ID if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
    return url;
  };

  if (!content.url) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No video URL</span>
      </div>
    );
  }

  return (
    <div>
      {content.title && (
        <h3 className="font-medium text-foreground mb-3">{content.title}</h3>
      )}
      <div className="aspect-video rounded-lg overflow-hidden">
        <iframe
          src={getEmbedUrl(content.url)}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}

function TestimonialBlock({ content, isEditing }: { content: TestimonialContent; isEditing?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <blockquote className="text-lg italic text-foreground">
        "{content.quote}"
      </blockquote>
      <div className="mt-4 flex items-center justify-center gap-3">
        {content.image && (
          <img src={content.image} alt="" className="w-12 h-12 rounded-full object-cover" />
        )}
        <div>
          <p className="font-medium text-foreground">{content.author}</p>
          {content.role && (
            <p className="text-sm text-muted-foreground">{content.role}</p>
          )}
        </div>
      </div>
    </div>
  );
}
