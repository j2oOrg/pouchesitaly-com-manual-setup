# pouchesitaly-com-manual-setup
Repository for pouchesitaly.com

## Storefront UI Notes

- The homepage includes a full-width black compliance bar directly below the header with `100% tobacco free` and `18+` in white text.
- Product cards on the homepage use a single pack-size dropdown and display one total pack price only. They do not show separate per-can and total-price blocks at the same time.
- The product details page uses the same pricing pattern as the homepage cards: one pack-size dropdown and one displayed total price for the selected pack.

## Main Files Updated For This Behavior

- `src/pages/Index.tsx`
- `src/components/ProductCardRounded.tsx`
- `src/pages/ProductPage.tsx`
- `src/context/LanguageContext.tsx`

## SEO And Production Routing Notes

- Italian is the canonical default locale and uses unprefixed URLs like `/`, `/product/:id`, and `/faq`.
- English uses `/en/...` URLs.
- Legacy `/it/...` URLs are treated as non-canonical and are redirected to the equivalent Italian root path.
- SEO metadata is not left to client-side hydration only. The production build now writes route-specific HTML files into `dist` so raw HTML contains canonical tags, `hreflang`, Open Graph, Twitter metadata, and JSON-LD.
- Structured data now includes:
  - `Organization` on all indexable pages
  - `WebSite` on all indexable pages
  - `FAQPage` on homepage, FAQ, shipping, ZYN, and VELO landing pages where applicable
  - `Product` and `BreadcrumbList` on product detail pages
- The sitemap is generated from the production build output and excludes legacy `/it/...` URLs and CMS test pages.
- A static `404.html` is generated for production so unknown public routes can return real `404` responses.

## Build And Deployment Notes

- `npm run build` runs the Vite production build and then `scripts/postbuild-seo.mjs`.
- `scripts/postbuild-seo.mjs` fetches products, CMS pages, and page metadata from Supabase and writes SEO-ready HTML files plus `dist/sitemap.xml` and `dist/404.html`.
- `nginx/default.conf` is configured to:
  - redirect `/it` and `/it/...` to canonical Italian URLs
  - return real `404` responses for unknown public URLs
  - keep SPA fallback only for private app routes such as `login`, `checkout`, and `admin`
  - add `X-Robots-Tag: noindex, nofollow` on those private routes

## Main Files Updated For SEO / Routing

- `scripts/postbuild-seo.mjs`
- `nginx/default.conf`
- `src/components/SEOHead.tsx`
- `src/components/LocalizedLink.tsx`
- `src/App.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/lib/structured-data.ts`
- `src/lib/seo-content.ts`
- `public/sitemap.xml`
- `public/logo.png`
