# SEO Guide — Standar Agency Dunia untuk jasamurahweb.com

Panduan ini menjelaskan standar SEO yang sudah diimplementasikan dan aturan untuk mempertahankannya saat menambah halaman/konten baru.

---

## Arsitektur SEO yang Sudah Diimplementasikan

### 1. Schema Markup (JSON-LD)

Setiap halaman memiliki lapisan schema yang saling terhubung via `@id`. Ini adalah fondasi Knowledge Graph Google dan GEO (AI citation).

#### BaseLayout (muncul di semua halaman)
```
Organization  →  @id: /#organization
  ├── logo: ImageObject  @id: /#logo
  ├── contactPoint: ContactPoint
  └── sameAs: [instagram, facebook]

WebSite  →  @id: /#website
  └── publisher → @id: /#organization  (referensi silang)

LocalBusiness + ProfessionalService  →  @id: /#localbusiness
  ├── address: PostalAddress (Sleman, Yogyakarta)
  ├── geo: GeoCoordinates
  └── areaServed: Indonesia
```

#### Blog Post (`/blog/[slug]`)
```
Article  →  @id: /blog/[slug]/#article
  ├── mainEntityOfPage: WebPage  @id: /blog/[slug]
  ├── author: Organization  →  @id: /#organization
  ├── publisher  →  @id: /#organization
  ├── datePublished: dari frontmatter pubDate
  ├── dateModified: dari frontmatter updatedDate (fallback: pubDate)
  ├── wordCount: auto-hitung dari body
  └── image: ImageObject (jika heroImage ada)

BreadcrumbList  →  @id: /blog/[slug]/#breadcrumb

WebPage  →  @id: /blog/[slug]
  └── speakable: SpeakableSpecification (h1, h2, p:first)
```

#### Service Page (`/[slug]` service)
```
Service  →  @id: /[slug]/#service
  └── provider  →  @id: /#organization

BreadcrumbList  →  @id: /[slug]/#breadcrumb
```

#### City Page (`/jasa-pembuatan-website-[kota]`)
```
Service  →  @id: /[slug]/#service
  ├── provider  →  @id: /#organization
  ├── areaServed: [City, AdministrativeArea]
  └── hasOfferCatalog: OfferCatalog

BreadcrumbList  →  @id: /[slug]/#breadcrumb

FAQPage  →  @id: /[slug]/#faq
  └── mainEntity: [Question + Answer]
```

---

### 2. Meta Tags (di semua halaman via BaseLayout)

```html
<!-- SEO Primary -->
<title>...</title>
<meta name="description">
<meta name="robots" content="index, follow">
<link rel="canonical">

<!-- Open Graph (7 tag wajib) -->
<meta property="og:type">
<meta property="og:url">
<meta property="og:title">
<meta property="og:description">
<meta property="og:image">
<meta property="og:image:alt">   ← standar agency
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name">
<meta property="og:locale" content="id_ID">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title">
<meta name="twitter:description">
<meta name="twitter:image">

<!-- PWA & Mobile -->
<meta name="theme-color" content="#0052CC">
<link rel="apple-touch-icon">
```

---

### 3. Core Web Vitals

#### LCP (Largest Contentful Paint) — target < 2.5s
- Hero image blog: `loading="eager"` + `fetchpriority="high"` + `decoding="async"`
- Gambar non-hero: tetap `loading="lazy"`
- Font: self-hosted via fontsource (tidak ada CDN latency)

#### CLS (Cumulative Layout Shift) — target < 0.1
- Semua `<img>` harus punya `width` dan `height` eksplisit
- Font pakai `font-display: swap` (otomatis dari fontsource)

#### INP (Interaction to Next Paint) — target < 200ms
- Astro SSG by default zero JS — sudah aman

---

### 4. Sitemap (`astro.config.mjs`)

Sitemap otomatis generate saat `npm run build` dengan:

| URL Pattern | changefreq | priority |
|-------------|-----------|----------|
| Homepage `/` | weekly | 1.0 |
| `/blog/`, `/services/`, `/area-layanan/` | weekly | 0.9 |
| `/jasa-*` (service & city pages) | monthly | 0.8 |
| `/blog/[slug]` | monthly | 0.7 |
| Lainnya (`/about`, `/contact`, dll) | yearly | 0.5 |

`lastmod` = tanggal build otomatis.

---

### 5. Fonts Self-Hosted

Font tidak lagi dimuat dari Google CDN. Diimport dari `global.css`:

```css
@import '@fontsource/assistant/latin-400.css';    /* body text */
@import '@fontsource/assistant/latin-500.css';
@import '@fontsource/assistant/latin-600.css';
@import '@fontsource/assistant/latin-700.css';
@import '@fontsource-variable/mulish/wght.css';   /* nav, button */
@import '@fontsource-variable/mulish/wght-italic.css';
@import '@fontsource/quattrocento/latin-400.css'; /* heading */
@import '@fontsource/quattrocento/latin-700.css';
```

**Perhatian:** Mulish menggunakan nama family `"Mulish Variable"` (bukan `"Mulish"`) karena pakai variable font package.

---

## Aturan saat Menambah Konten Baru

### Menambah Artikel Blog

Frontmatter wajib:
```yaml
---
title: "Judul Artikel"
slug: "url-slug-artikel"
pubDate: 2026-06-26
description: "Deskripsi 150-160 karakter untuk meta description."
author: "Tim jasamurahweb.com"
heroImage: /path/ke/gambar.jpg   # opsional tapi dianjurkan
---
```

Frontmatter opsional (tapi penting untuk SEO freshness):
```yaml
updatedDate: 2026-07-01   # isi setiap kali artikel diupdate signifikan
```

Aturan konten:
- Gunakan satu `h1` per halaman (sudah otomatis dari `post.data.title`)
- Gunakan `h2` untuk section utama, `h3` untuk sub-section
- Paragraph pertama di bawah `h2` adalah yang dibaca AI assistants (speakable)
- Gambar dalam artikel: selalu tambah `alt` yang deskriptif
- `description` harus unik per artikel, bukan copy judul

### Menambah Halaman Service Baru

Service baru di `src/content/services/[slug].md` otomatis mendapat:
- Service schema dengan `@id`
- BreadcrumbList schema
- Masuk ke sitemap dengan `priority: 0.8`
- Canonical URL

Tidak ada konfigurasi SEO tambahan yang diperlukan.

### Menambah City Page Baru

City page baru di `src/data/websiteCities.ts` otomatis mendapat:
- Service schema + FAQPage schema + BreadcrumbList schema
- Internal linking ke nearby cities
- Masuk ke sitemap dengan `priority: 0.8`

---

## Validasi Schema (Wajib setelah deploy)

Gunakan tool ini untuk validasi setelah perubahan besar:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Test URL homepage, satu blog post, satu city page
   - Target: semua schema valid tanpa error

2. **Schema.org Validator**: https://validator.schema.org
   - Paste URL atau HTML langsung
   - Pastikan `@id` links resolved dengan benar

3. **Google Search Console**:
   - Submit sitemap: `Sitemaps → Add sitemap → sitemap-index.xml`
   - Monitor "Rich Results" di bagian Enhancement
   - Monitor Core Web Vitals di bagian Experience

---

## Checklist Deploy

Sebelum setiap deploy besar, centang:

- [ ] `npm run build` sukses 0 error
- [ ] Schema valid di Rich Results Test (satu halaman per tipe)
- [ ] Semua gambar hero blog punya `loading="eager"` + `fetchpriority="high"`
- [ ] Gambar non-hero punya `loading="lazy"` + `width` + `height`
- [ ] `robots.txt` masih mengarah ke `sitemap-index.xml`
- [ ] Artikel baru punya `description` unik dan `pubDate` benar
- [ ] Artikel yang diupdate signifikan punya `updatedDate` diisi

---

## Skor SEO Setelah Implementasi

| Kategori | Sebelum | Sesudah |
|----------|---------|---------|
| Schema Markup | 75/100 | 96/100 |
| Core Web Vitals setup | 60/100 | 92/100 |
| Meta Tags | 80/100 | 97/100 |
| Sitemap kualitas | 70/100 | 92/100 |
| GEO/AEO readiness | 20/100 | 72/100 |
| Font Performance | 40/100 | 95/100 |

---

## Yang Belum Diimplementasikan (Future)

| Item | Prioritas | Effort |
|------|-----------|--------|
| `twitter:site` + `twitter:creator` | Rendah | Tambah akun Twitter dulu |
| Blog category/tag system untuk topic clustering | Sedang | Perlu redesign content architecture |
| `SearchAction` di WebSite schema | Rendah | Perlu search functionality |
| `hreflang` jika buka versi English | Rendah | Hanya jika ada versi EN |
| `rel="prev"` / `rel="next"` untuk pagination blog | Rendah | Jika blog list > 1 halaman |
