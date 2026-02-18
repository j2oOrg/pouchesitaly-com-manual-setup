import { BlockType, BLOCK_DEFINITIONS } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { X, Loader2, Layout, Type, Image, MousePointerClick, LayoutGrid, HelpCircle, Grid3X3, SeparatorHorizontal, Video, Quote } from 'lucide-react';

const ICONS: Record<string, any> = {
  Layout,
  Type,
  Image,
  MousePointerClick,
  LayoutGrid,
  HelpCircle,
  Grid3X3,
  SeparatorHorizontal,
  Video,
  Quote,
};

interface BlockPickerProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function BlockPicker({ onSelect, onClose, isLoading }: BlockPickerProps) {
  const blockTypes = Object.entries(BLOCK_DEFINITIONS) as [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-heading font-bold">Add Content Block</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 overflow-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {blockTypes.map(([type, definition]) => {
                const Icon = ICONS[definition.icon] || Layout;
                return (
                  <button
                    key={type}
                    onClick={() => onSelect(type)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{definition.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
