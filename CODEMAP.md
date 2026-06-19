# AnhCMS_Solution — Codemap

## Tech Stack
- **Frontend:** React (CRA), react-router-dom v6, react-query (@tanstack/react-query)
- **UI:** Bootstrap 4.6.2 (CDN) + Tailwind CSS (CDN v3.4 via `<script>`)
- **Icons:** Material Symbols (CDN)
- **API:** ASP.NET Core backend tại `https://localhost:7224`
- **Auth:** JWT token + localStorage (`token` key)

## Project Structure
```
cms.frontend/src/
  api/          — axios instance, interceptor (gắn JWT Bearer)
  components/   — Header, Footer, ProductCard, PostCard
  hooks/        — useAuth, usePosts, useProducts, useCart, useOrders
  pages/
    home/       — HeroBanner, CategoryMenu, FeaturedProducts, LatestBlog
    shop/       — ShopHeader, ShopProducts
    product-detail/
    blog/       — BlogSidebar
    blog-detail/
    cart/       — CartTable
    checkout/
    login/
    register/
  contexts/     — AuthContext
  App.tsx       — Router + route definitions
```

## Design System (defined in `public/index.html`)

### Colors
| Token          | Value     | Usage                          |
|----------------|-----------|--------------------------------|
| `bg-primary`   | #000000   | Nút chính, header, footer      |
| `text-primary` | #000000   | Tiêu đề, link                  |
| `bg-surface`   | #ffffff   | Nền trang                      |
| `text-secondary` | #555555 | Mô tả, thông tin phụ           |
| `text-on-primary` | #ffffff | Chữ trên nền đen              |
| `text-error`   | #dc2626   | Lỗi, xóa                       |
| `bg-surface-container-low` | #f5f5f5 | Nền section nhẹ

### Typography
- `font-label-sm`: 10px, `text-label-sm`: 10px — dùng cho uppercase tracking labels
- Global: system-ui stack

### Bootstrap Override (CSS `!important`)
Bootstrap 4.6 xung đột `.text-primary { color: #007bff !important }` → override trong `public/index.html`:
- `.text-primary` → `#000000 !important`
- `.text-secondary` → `#555555 !important`
- `.bg-primary` → `#000000 !important`
- `.border-primary` → `#000000 !important`
- `a` → `#000000 !important` (trừ `text-error`)

## Button Effects System (`public/index.html`)
6 class luxury button styles với pseudo-element + `cubic-bezier(0.16, 1, 0.3, 1)`:

| Class | Effect | Cơ chế |
|---|---|---|
| `btn-luxury` (base) | `active:scale-96`, `cursor:pointer`, `overflow:hidden` | Gắn vào mọi button |
| `btn-primary-luxury` | Shine sweep (sáng chạy ngang qua nút) | `::before` gradient + `translateX(-100%) → translateX(100%)` |
| `btn-outline-luxury` | Fill dọc từ dưới lên (nền đen dâng lên) | `::before` `translateY(100%) → 0` |
| `btn-outline-light-luxury` | Fill dọc từ dưới lên phiên bản sáng (dùng trên hero nền gradient) | Giống outline nhưng `#fff` fill |
| `btn-link-luxury` | Gạch chân mở rộng từ giữa | `::before` + `scaleX(0) → scaleX(1)` |
| `btn-ghost-luxury` | Soft scale compress + opacity | `scale(0.96)`, `opacity: 0.8` |
| `btn-pill-luxury` | Fill ngang phải→trái (cho pill/category filters) | `::before` `translateX(100%) → 0` |
| `btn-overlay-luxury` | Scale nhẹ khi hover (overlay product card) | `scale(1.05)` |

## API Hooks
| Hook | Endpoint | Key |
|---|---|---|
| `useProducts(filters?)` | `GET /api/products` | `['products', filters]` |
| `useProduct(id)` | `GET /api/products/{id}` | `['product', id]` |
| `usePosts(page, pageSize?)` | `GET /api/posts?page=&pageSize=` | `['posts', page, pageSize]` |
| `usePost(id)` | `GET /api/posts/{id}` | `['post', id]` |
| `useCategories()` | `GET /api/categories` | `['categories']` |
| `useAuth()` — `useSignUp()`, `useSignIn()`, `useLogout()`, `useProfile()` | POST/PUT/DELETE auth endpoints | — |
| `useCart()` — `fetchCart()`, `useAddToCart()`, `useUpdateCart()`, `useRemoveFromCart()` | Cart CRUD | `['cart']` |
| `useOrders()` — `useCreateOrder()`, `useOrderHistory()` | Order endpoints | `['orders']` |

## Auth Flow
- `AuthContext` quản lý state login (`isAuthenticated`, `user`, `token`)
- `api/axios.ts` auto gắn `Authorization: Bearer {token}` từ localStorage
- `App.tsx` check token khi mount → gọi `GET /api/auth/profile`

## Recent Changes (Session 2026-06-20)

1. **Design overhaul** — Match LuxeAura design sample: black/white palette, sans-serif, clean minimal
2. **Tailwind config** — spacing, borderRadius, fontFamily, animation presets
3. **Button effects** — 6 luxury button CSS classes added to `public/index.html`
4. **Bootstrap override** — Fix `.text-primary` xanh bằng `!important`
5. **Mock data removal** — BlogSidebar, blog-detail, product-detail, CartTable: thay placeholder/hardcode bằng API data
6. **Design tokens applied** — `text-secondary`, `bg-surface-container-low`, `text-error` thay thế hardcoded colors
7. **Button classes applied** — Toàn bộ pages: home, shop, blog, blog-detail, product-detail, cart, checkout, login, register, + Header/Footer

### Changed Files (18 files, +291/-141 lines)
- `public/index.html` — Tailwind config + Bootstrap overrides + Button effects CSS
- `src/App.tsx` — PageLoader/NotFound styling
- `src/components/Header.tsx` — Ghost buttons + active states
- `src/components/Footer.tsx` — Newsletter subscribe link
- `src/components/PostCard.tsx` — Read Narrative link
- `src/components/ProductCard.tsx` — Overlay buttons + hover/active
- `src/pages/home/HeroBanner.tsx` — Primary/outline-light buttons
- `src/pages/home/CategoryMenu.tsx` — Pill buttons
- `src/pages/home/LatestBlog.tsx` — View All link
- `src/pages/blog/BlogSidebar.tsx` — Mock → API
- `src/pages/blog-detail/index.tsx` — Mock → API + buttons
- `src/pages/cart/index.tsx` — Checkout buttons
- `src/pages/cart/CartTable.tsx` — Placeholder URL removed
- `src/pages/checkout/index.tsx` — Confirm Transaction button
- `src/pages/login/index.tsx` — Design tokens + button
- `src/pages/register/index.tsx` — Design tokens + button
- `src/pages/product-detail/index.tsx` — Mock → API + buttons

## Known Issues / Pending
- ESLint warnings: unused imports (`useMutation`, `useQueryClient`, `toast` in `useProducts.ts`; `Product`, `addToCart` in `blog-detail/index.tsx`; `href` accessibility in `Footer.tsx`)
- Footer social links dùng `href="#"` — cần route thật
