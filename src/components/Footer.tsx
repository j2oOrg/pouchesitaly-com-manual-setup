import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useMenuTree } from "@/hooks/useMenuItems";
import { usePages } from "@/hooks/usePages";
import { MenuItem } from "@/types/cms";

export function Footer() {
  const { t } = useTranslation();
  const { data: footerItems = [] } = useMenuTree('footer');
  const { data: pages = [] } = usePages();

  // Get URL for a menu item
  const getMenuItemUrl = (item: MenuItem): string => {
    if (item.url) return item.url;
    if (item.page_id) {
      const page = pages.find(p => p.id === item.page_id);
      if (page) return `/p/${page.slug}`;
    }
    return '#';
  };

  // Fallback links for Quick Links section
  const defaultQuickLinks = [
    { to: "/", label: t("home") },
    { to: "/premium-brands", label: t("brands") },
    { to: "/shipping-info", label: t("shipping") },
    { to: "/faq", label: t("faq") },
  ];

  // Fallback links for Customer Service section
  const defaultServiceLinks = [
    { to: "/faq", label: t("faqTitle") },
    { to: "mailto:support@nicoxpress.com", label: t("contactUs"), isEmail: true },
    { to: "/shipping-info", label: t("returns") },
  ];

  // Group footer items by their parent (top-level items become section headers)
  const footerSections = footerItems.filter(item => !item.parent_id);

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-lg">N</span>
              </div>
              <span className="font-heading font-bold text-xl">NicoXpress</span>
            </div>
            <p className="text-background/70 text-sm">
              {t("aboutUsDesc")}
            </p>
          </div>

          {/* Dynamic Footer Sections OR Fallback */}
          {footerSections.length > 0 ? (
            footerSections.slice(0, 3).map(section => (
              <div key={section.id}>
                <h4 className="font-heading font-bold text-lg mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.children?.map(child => {
                    const url = getMenuItemUrl(child);
                    const isExternal = url.startsWith('http') || url.startsWith('mailto:');
                    
                    return (
                      <li key={child.id}>
                        {isExternal ? (
                          <a 
                            href={url} 
                            target={child.target}
                            className="text-background/70 hover:text-background transition-colors text-sm"
                          >
                            {child.title}
                          </a>
                        ) : (
                          <Link 
                            to={url} 
                            className="text-background/70 hover:text-background transition-colors text-sm"
                          >
                            {child.title}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Quick Links */}
              <div>
                <h4 className="font-heading font-bold text-lg mb-4">{t("quickLinks")}</h4>
                <ul className="space-y-2">
                  {defaultQuickLinks.map(link => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-background/70 hover:text-background transition-colors text-sm">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h4 className="font-heading font-bold text-lg mb-4">{t("customerService")}</h4>
                <ul className="space-y-2">
                  {defaultServiceLinks.map(link => (
                    <li key={link.to}>
                      {link.isEmail ? (
                        <a href={link.to} className="text-background/70 hover:text-background transition-colors text-sm">
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.to} className="text-background/70 hover:text-background transition-colors text-sm">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-heading font-bold text-lg mb-4">{t("legal")}</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/privacy" className="text-background/70 hover:text-background transition-colors text-sm">
                      {t("privacyPolicy")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-background/70 hover:text-background transition-colors text-sm">
                      {t("termsConditions")}
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} NicoXpress. {t("allRightsReserved")}
            </p>
            <p className="text-background/60 text-xs">
              {t("ageDisclaimer")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}