import { useState } from "react";
import { ShoppingCart, Menu, X, Globe, ChevronDown } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { useMenuTree } from "@/hooks/useMenuItems";
import { usePages } from "@/hooks/usePages";
import { MenuItem } from "@/types/cms";
import type { CartItem } from "@/types/product";

interface PageHeaderProps {
  cart?: CartItem[];
  onCartClick?: () => void;
}

export function PageHeader({ cart = [], onCartClick }: PageHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const { data: menuItems = [] } = useMenuTree('header');
  const { data: pages = [] } = usePages();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fallback nav links if no menu items exist
  const fallbackLinks = [
    { to: "/", label: t("home") },
    { to: "/#products", label: t("products") },
    { to: "/premium-brands", label: t("brands") },
    { to: "/shipping-info", label: t("shipping") },
    { to: "/faq", label: t("faq") },
  ];

  // Get URL for a menu item
  const getMenuItemUrl = (item: MenuItem): string | null => {
    if (item.url) return item.url;
    if (item.page_id) {
      const page = pages.find(p => p.id === item.page_id);
      if (page) return `/p/${page.slug}`;
    }
    return null;
  };

  const isExternalUrl = (url: string) => /^(https?:|mailto:)/i.test(url);

  const renderMenuLink = (
    url: string,
    label: string,
    key: string,
    className: string,
    onClick?: () => void,
    target?: string
  ) => {
    if (isExternalUrl(url)) {
      const linkTarget = target || "_blank";
      return (
        <a
          key={key}
          href={url}
          target={linkTarget}
          rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
          className={className}
          onClick={onClick}
        >
          {label}
        </a>
      );
    }

    return (
      <LocalizedLink
        key={key}
        to={url}
        className={className}
        onClick={onClick}
      >
        {label}
      </LocalizedLink>
    );
  };

  const renderMenuItem = (item: MenuItem, isMobile = false) => {
    const url = getMenuItemUrl(item);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openDropdown === item.id;

    if (hasChildren) {
      return (
        <div 
          key={item.id} 
          className={`relative ${isMobile ? '' : 'group'}`}
          onMouseEnter={() => !isMobile && setOpenDropdown(item.id)}
          onMouseLeave={() => !isMobile && setOpenDropdown(null)}
        >
          <button
            onClick={() => isMobile && setOpenDropdown(isOpen ? null : item.id)}
            className={`flex items-center gap-1 ${
              isMobile 
                ? 'w-full py-3 text-muted-foreground hover:text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground transition-colors font-medium'
            }`}
          >
            {item.title}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown */}
          <div className={`${
            isMobile 
              ? `overflow-hidden transition-all ${isOpen ? 'max-h-96' : 'max-h-0'}`
              : `absolute left-0 top-full pt-2 ${isOpen ? 'block' : 'hidden'}`
          }`}>
            <div className={`${
              isMobile 
                ? 'pl-4 border-l border-border ml-2' 
                : 'min-w-[190px] rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,23,40,0.98),rgba(11,17,29,0.98))] py-2 shadow-[0_24px_44px_-24px_rgba(0,0,0,0.8)]'
            }`}>
              {item.children?.map(child => {
                const childUrl = getMenuItemUrl(child);
                if (!childUrl) return null;
                return (
                  <div key={child.id}>
                    {renderMenuLink(
                      childUrl,
                      child.title,
                      child.id,
                      `block ${isMobile
                        ? 'py-2 text-muted-foreground hover:text-foreground transition-colors'
                        : 'px-4 py-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors'
                      }`,
                      () => isMobile && setIsMobileMenuOpen(false),
                      child.target
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (!url) return null;

    return (
      <div key={item.id}>
      {renderMenuLink(
        url,
        item.title,
        item.id,
        `${isMobile
          ? 'block py-3 text-muted-foreground hover:text-foreground transition-colors font-medium'
          : 'text-muted-foreground hover:text-foreground transition-colors font-medium'
        }`,
        () => isMobile && setIsMobileMenuOpen(false),
        item.target
      )}
      </div>
    );
  };

  const navItems = menuItems.length > 0 ? menuItems : null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(180deg,rgba(7,11,22,0.96),rgba(10,16,29,0.84))] backdrop-blur-xl shadow-[0_22px_46px_-34px_rgba(0,0,0,0.82)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <LocalizedLink
            to="/"
            className="group relative inline-flex items-center py-1"
            aria-label="Pouches Italy"
          >
            <span className="font-heading text-base font-black uppercase tracking-[0.16em] text-white/95 drop-shadow-[0_12px_22px_rgba(0,0,0,0.4)] transition-opacity duration-300 group-hover:opacity-90 sm:text-lg md:text-[1.4rem]">
              Pouches
            </span>
            <span className="ml-2 font-heading text-base font-black uppercase tracking-[0.2em] text-transparent bg-[linear-gradient(135deg,hsl(var(--primary))_0%,#9cefff_100%)] bg-clip-text drop-shadow-[0_12px_22px_rgba(24,198,255,0.16)] transition-transform duration-300 group-hover:translate-x-0.5 sm:text-lg md:text-[1.4rem]">
              Italy
            </span>
            <span className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(56,217,255,0.95),transparent)] opacity-80 transition-transform duration-300 group-hover:scale-x-110" />
          </LocalizedLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems ? (
              navItems.map(item => renderMenuItem(item))
            ) : (
              fallbackLinks.map((link) => (
                <LocalizedLink
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.label}
                </LocalizedLink>
              ))
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline uppercase text-sm font-medium">{language}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,23,40,0.98),rgba(11,17,29,0.98))] shadow-[0_24px_44px_-24px_rgba(0,0,0,0.8)]">
                  <button
                    onClick={() => { setLanguage("en"); setIsLangOpen(false); }}
                    className={`block w-full px-4 py-2 text-left transition-colors hover:bg-white/5 ${language === "en" ? "bg-primary/15 text-primary" : ""}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage("it"); setIsLangOpen(false); }}
                    className={`block w-full px-4 py-2 text-left transition-colors hover:bg-white/5 ${language === "it" ? "bg-primary/15 text-primary" : ""}`}
                  >
                    Italiano
                  </button>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            {navItems ? (
              navItems.map(item => renderMenuItem(item, true))
            ) : (
              fallbackLinks.map((link) => (
                <LocalizedLink
                  key={link.to}
                  to={link.to}
                  className="block py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </LocalizedLink>
              ))
            )}
          </nav>
        )}
      </div>
    </header>
  );
}


