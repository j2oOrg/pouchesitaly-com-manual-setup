// Menu Types
export type MenuLocation = 'header' | 'footer' | 'learn_more';

export interface MenuItem {
  id: string;
  parent_id: string | null;
  menu_location: MenuLocation;
  title: string;
  url: string | null;
  page_id: string | null;
  target: '_self' | '_blank';
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: MenuItem[];
}

export interface MenuItemInput {
  parent_id?: string | null;
  menu_location: MenuLocation;
  title: string;
  url?: string | null;
  page_id?: string | null;
  target?: '_self' | '_blank';
  position?: number;
  is_active?: boolean;
}

// Page Types
export interface Page {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  language: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PageInput {
  slug: string;
  title: string;
  status?: 'draft' | 'published';
  language?: string;
}

// Block Types
export type BlockType = 
  | 'hero'
  | 'text'
  | 'image'
  | 'cta'
  | 'cards'
  | 'faq'
  | 'grid'
  | 'spacer'
  | 'video'
  | 'testimonial';

export interface PageBlock {
  id: string;
  page_id: string;
  block_type: BlockType;
  content: BlockContent;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageBlockInput {
  page_id: string;
  block_type: BlockType;
  content: BlockContent;
  position?: number;
  is_visible?: boolean;
}

// Block Content Types
export interface HeroContent {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonUrl?: string;
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;
}

export interface TextContent {
  content: string; // HTML or markdown
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageContent {
  src: string;
  alt: string;
  caption?: string;
  width?: 'full' | 'medium' | 'small';
}

export interface CTAContent {
  title: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  variant?: 'primary' | 'secondary' | 'outline';
  backgroundColor?: string;
}

export interface CardItem {
  title: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface CardsContent {
  title?: string;
  columns?: 2 | 3 | 4;
  items: CardItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  title?: string;
  items: FAQItem[];
}

export interface GridItem {
  content: string;
  image?: string;
}

export interface GridContent {
  columns?: 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  items: GridItem[];
}

export interface SpacerContent {
  height: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface VideoContent {
  url: string;
  title?: string;
  autoplay?: boolean;
}

export interface TestimonialContent {
  quote: string;
  author: string;
  role?: string;
  image?: string;
}

export type BlockContent = 
  | HeroContent
  | TextContent
  | ImageContent
  | CTAContent
  | CardsContent
  | FAQContent
  | GridContent
  | SpacerContent
  | VideoContent
  | TestimonialContent
  | Record<string, any>;

// Block metadata for the editor
export const BLOCK_DEFINITIONS: Record<BlockType, { label: string; icon: string; defaultContent: BlockContent }> = {
  hero: {
    label: 'Hero Section',
    icon: 'Layout',
    defaultContent: { title: 'Hero Title', subtitle: 'Hero subtitle text', alignment: 'center' } as HeroContent,
  },
  text: {
    label: 'Text Block',
    icon: 'Type',
    defaultContent: { content: '<p>Enter your text here...</p>', alignment: 'left' } as TextContent,
  },
  image: {
    label: 'Image',
    icon: 'Image',
    defaultContent: { src: '', alt: 'Image description', width: 'full' } as ImageContent,
  },
  cta: {
    label: 'Call to Action',
    icon: 'MousePointerClick',
    defaultContent: { title: 'Ready to get started?', buttonText: 'Get Started', buttonUrl: '#', variant: 'primary' } as CTAContent,
  },
  cards: {
    label: 'Cards Grid',
    icon: 'LayoutGrid',
    defaultContent: { columns: 3, items: [{ title: 'Card 1', description: 'Card description' }] } as CardsContent,
  },
  faq: {
    label: 'FAQ Section',
    icon: 'HelpCircle',
    defaultContent: { title: 'Frequently Asked Questions', items: [{ question: 'Question?', answer: 'Answer.' }] } as FAQContent,
  },
  grid: {
    label: 'Content Grid',
    icon: 'Grid3X3',
    defaultContent: { columns: 2, gap: 'medium', items: [{ content: 'Grid item' }] } as GridContent,
  },
  spacer: {
    label: 'Spacer',
    icon: 'SeparatorHorizontal',
    defaultContent: { height: 'medium' } as SpacerContent,
  },
  video: {
    label: 'Video',
    icon: 'Video',
    defaultContent: { url: '', title: 'Video title' } as VideoContent,
  },
  testimonial: {
    label: 'Testimonial',
    icon: 'Quote',
    defaultContent: { quote: 'Amazing product!', author: 'John Doe', role: 'Customer' } as TestimonialContent,
  },
};
