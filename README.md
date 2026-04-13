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
