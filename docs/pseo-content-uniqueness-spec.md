# PSEO content uniqueness and data model spec

Status: implementation-ready spec for jasamurahweb.com programmatic city pages.

## Source context verified

- Current generated city cluster is one service x city pattern: `Jasa Pembuatan Website` with root-level city URLs such as `/jasa-pembuatan-website-jakarta/`.
- City pages are generated from `src/data/websiteCities.ts` through `src/pages/[slug].astro`.
- Current `websiteCities.ts` fields are only `city`, `slug`, `province`, `businessContext`, `areaContext`, and `localAngle`.
- Parent audit found 30 city pages, title/meta/H1 uniqueness passing, schema/linking passing, but body similarity still high: median 0.8707 and max 0.9547.
- Parent audit claim scan found repeated claim terms on city pages: `gratis` 90, `profesional` 205, `murah` 150, `terpercaya` 2.

## Goal

Make every indexable city page meaningfully useful for the searcher, not only a city-name swap. Each page must pass the anti-doorway gate by adding city-specific buyer context, service context, proof/process transparency, FAQ variation, CTA variation, and nearby-area linking while avoiding unsupported local or quality claims.

Target: at least 30-40% meaningful variation in city-page main content, measured across visible body text after removing nav/footer/global boilerplate.

## Required city content model

Extend `src/data/websiteCities.ts` from a light location table into a city landing-page content model.

Recommended TypeScript shape:

```ts
export type CityPriority = 'tier_1' | 'tier_2' | 'tier_3';

export type WebsiteCityPage = {
  city: string;
  slug: string;
  province: string;
  priority: CityPriority;
  businessContext: string;
  areaContext: string;
  localAngle: string;

  // New fields for uniqueness and usefulness
  audienceExamples: string[];
  audienceUseCases: Array<{
    audience: string;
    websiteNeed: string;
    conversionGoal: string;
  }>;
  introAngle: string;
  localBusinessContext: string;
  nearbyAreas: string[];
  buyerProblems: string[];
  recommendedWebsiteTypes: Array<{
    type: 'company-profile' | 'landing-page' | 'catalog' | 'custom-web-app';
    label: string;
    reason: string;
  }>;
  deliverableEmphasis: string[];
  ctaAngle: {
    primaryLabel: string;
    whatsappMessage: string;
    microcopy: string;
  };
  faqVariants: Array<{
    question: string;
    answer: string;
  }>;
  proofProcessVariant: {
    heading: string;
    bullets: string[];
    evidencePolicy: 'process-only' | 'real-portfolio' | 'real-testimonial';
  };
  claimNotes?: string[];
};
```

### Field rules

1. `audienceExamples`
   - Replace the current split-from-string helper where possible.
   - Use 4-6 explicit business types per city.
   - Example Jakarta: `['perusahaan B2B', 'konsultan', 'klinik', 'properti', 'F&B multi-cabang']`.

2. `audienceUseCases`
   - Adds meaningful variation because the same service has different use cases per city.
   - Each city needs 2-3 use cases.
   - Example Jakarta:
     - audience: `perusahaan B2B`
     - websiteNeed: `halaman layanan, profil perusahaan, studi kasus, dan CTA konsultasi yang mudah dibaca tim procurement`
     - conversionGoal: `mendorong request quotation atau jadwal konsultasi`
   - Example Denpasar:
     - audience: `villa, travel, dan wellness`
     - websiteNeed: `visual kuat, halaman paket, galeri, FAQ booking, dan WhatsApp inquiry`
     - conversionGoal: `mendorong pertanyaan dari pelanggan lokal dan wisatawan`

3. `introAngle`
   - One paragraph unique to the city and audience, not a repeated phrase with only city replaced.
   - Must connect service to local business decision-making.
   - Do not add public demographic facts unless used directly to explain the website strategy.

4. `localBusinessContext`
   - Use practical buyer context: competitive market, B2B trust, tourism inquiry, industrial procurement, clinic appointment flow, school registration, etc.
   - Avoid empty filler such as population, area size, or city history.

5. `nearbyAreas`
   - Store as an array, not only prose.
   - Use for visible area coverage text, related-city link selection, and schema `areaServed` if appropriate.

6. `buyerProblems`
   - 3 city-specific or audience-specific pains.
   - Examples: unclear service pages, no official catalog, WhatsApp clicks not tracked, slow mobile page, weak proof for B2B/tender, poor booking/inquiry flow.

7. `recommendedWebsiteTypes`
   - Choose 2-4 from company profile, landing page, catalog/toko online, or custom web app.
   - The reason must mention the local/audience use case.

8. `deliverableEmphasis`
   - 4-6 concrete deliverables to vary per city.
   - Examples: service-page structure, WhatsApp CTA, portfolio block, product catalog, location/service-area section, basic SEO metadata, mobile performance, tracking events.

9. `ctaAngle`
   - Vary CTA based on city/audience intent.
   - Examples:
     - Jakarta: `Minta Struktur Website untuk Bisnis Jakarta`
     - Denpasar: `Bahas Website untuk Inquiry Wisata & Hospitality`
     - Gresik: `Konsultasi Website B2B untuk Industri Gresik`
   - Avoid repeating `Konsultasi Gratis` on every city page unless the offer is genuinely free and consistently explained.

10. `faqVariants`
    - Each city needs 3-5 visible FAQs.
    - At least 2 FAQs must be city/audience-specific.
    - FAQ schema may only include these exact visible Q&A items.

11. `proofProcessVariant`
    - Use real portfolio/testimonial only if verified and visible.
    - If no verified local proof exists, use process transparency instead:
      - what will be mapped in the brief,
      - what deliverables are produced,
      - how revision/launch/tracking works,
      - what the visitor receives after consultation.
    - Do not imply local clients in a city unless real proof is available.

## Copy uniqueness rule

A city page is allowed to stay indexable only if it passes all of these gates:

1. Meaningful variation target
   - Minimum 30-40% of main content should vary by city/audience/use case/proof/process/FAQ.
   - Main content excludes header, footer, repeated service cards, and global navigation.
   - Current similarity max 0.9547 is too high; target max pairwise similarity should be below 0.80 after implementation, with median below 0.75.

2. Required unique sections per city
   - Hero subheadline must use `introAngle`, `audienceExamples[0]`, and `ctaAngle`, not only city name.
   - Local relevance section must use `localBusinessContext`, `buyerProblems`, and `audienceUseCases`.
   - Website type section must render only the recommended types for that city with city-specific reasons.
   - Deliverables/process section must use `deliverableEmphasis` and `proofProcessVariant`.
   - FAQ section must use `faqVariants`, not one repeated FAQ set.

3. Avoid public-data filler
   - Do not add generic city facts unless they change the recommended website strategy.
   - Good: `For Batam B2B/export-import businesses, the page should clarify company profile, service scope, and inquiry path for clients outside the city.`
   - Bad: `Batam is a city in Kepulauan Riau with many businesses.`

4. Avoid over-repeated exact-match phrases
   - Do not repeat `jasa pembuatan website [city]` in every section.
   - Use natural variants: `website bisnis di [city]`, `halaman layanan untuk bisnis [city]`, `website untuk [audience]`, `struktur halaman yang cocok untuk [use case]`.

## Claim policy

Unsupported claims must be removed, softened, or tied to visible proof/process.

### Banned unless verified in visible content

- `terbaik`
- `nomor 1`
- `rating 5.0`
- `dipercaya ribuan`
- `terpercaya` as a standalone claim
- fake local office, fake local team, fake local reviews, fake city-specific portfolio

### Conditional terms

- `profesional`: allowed when tied to concrete deliverables such as layout, responsive design, copy structure, contact flow, metadata, or launch handover. Avoid using it as repeated empty adjective.
- `murah`: allowed only when tied to package scope, price range, quote process, or transparent value framing. Do not use as a broad claim without pricing context.
- `gratis`: allowed only for the exact free action, e.g. initial consultation, and with no hidden implication that the full service is free.
- `SEO-ready`: allowed when visible deliverables include heading structure, metadata, sitemap/canonical, performance basics, internal links, and content structure. Do not imply ranking guarantees.

### Replacement examples

- Replace `website profesional dan terpercaya` with `website dengan struktur layanan, bukti bisnis, CTA WhatsApp, dan halaman yang mudah dibaca di mobile`.
- Replace `jasa website murah terbaik` with `paket website disusun sesuai scope: halaman utama, layanan, CTA WhatsApp, basic SEO, dan opsi pengembangan bertahap`.
- Replace `konsultasi gratis` with `konsultasi awal via WhatsApp untuk memetakan kebutuhan, scope halaman, dan estimasi pengerjaan`.

## Page blueprint for each city page

Update the city branch of `src/pages/[slug].astro` to render this structure.

### 1. Hero

Data inputs:
- `city`, `province`
- `audienceExamples[0]`
- `introAngle`
- `ctaAngle`
- `areaContext` or `nearbyAreas`

Content requirements:
- Eyebrow: `Jasa Pembuatan Website [City]`
- H1: `Jasa Pembuatan Website [City] untuk [primary audience/outcome]`
- Subheadline: city-specific mechanism and outcome from `introAngle`
- Primary CTA from `ctaAngle.primaryLabel`
- CTA microcopy from `ctaAngle.microcopy`
- Secondary CTA to `/jasa-pembuatan-website/`
- Area link to `/area-layanan/`

### 2. Local relevance and buyer context

Data inputs:
- `localBusinessContext`
- `buyerProblems`
- `audienceUseCases`

Render:
- One city-specific paragraph.
- 3 buyer problem cards.
- 2-3 audience use-case cards showing audience, website need, and conversion goal.

### 3. Recommended website types

Data inputs:
- `recommendedWebsiteTypes`

Render only the selected types for the city, with reasons. Do not show the same four cards on every city page unless each card reason is city-specific.

### 4. What the buyer gets

Data inputs:
- `deliverableEmphasis`

Render 4-6 deliverables with benefits. Examples:
- service page structure,
- mobile-first layout,
- WhatsApp CTA and form route,
- portfolio/proof section,
- basic SEO metadata,
- analytics/tracking setup,
- catalog/product/service section.

### 5. Package/process transparency

Render a process block with concrete next steps:
1. brief and target audience mapping,
2. page structure and copy direction,
3. design/development,
4. review, launch, and handover.

Use `proofProcessVariant` to vary heading and bullets per city/audience.

### 6. Proof or transparency block

Rules:
- If verified portfolio/testimonial exists, render it and ensure claims match the asset.
- If no city-specific proof exists, render process transparency and avoid local proof claims.
- Do not use AggregateRating/Review schema unless the review is real, visible, and compliant.

### 7. Internal links

Each city page must link to:
- `/jasa-pembuatan-website/`
- `/area-layanan/`
- 3-4 nearby city pages from `getNearbyWebsiteCityPages()`
- relevant service pages through `services` from `src/data/site.ts`

Use descriptive but varied anchors. Avoid repeating exact-match anchors sitewide.

### 8. City-specific FAQ

Data inputs:
- `faqVariants`

Render 3-5 visible Q&A items. FAQ schema must be built from the exact rendered items.

### 9. Final CTA

Use the same primary CTA intent as the hero, with specific next step and risk reducer:
- what happens after click,
- what the visitor should send,
- what response/output they get.

## Implementation map

### `src/data/websiteCities.ts`

Primary implementation file.

Required changes:
- Extend city objects with the new fields above.
- Replace string-splitting helper with explicit arrays where possible.
- Keep `getWebsiteCityPath(cityPage)` unchanged to preserve root-level URLs.
- Update `getCityAudienceExamples(cityPage)` to return `cityPage.audienceExamples`.
- Update `getNearbyWebsiteCityPages()` to prefer same province, then same island/region if a future `region` field is added, then priority cities.
- Keep `priorityWebsiteCityPages = websiteCityPages.slice(0, 8)` or replace with explicit priority filtering after adding `priority`.

### `src/pages/[slug].astro`

Primary template implementation file.

Required changes in city branch:
- Replace generic `cityFaqItems` with `cityPage.faqVariants`.
- Replace generic issue highlights for city pages with `cityPage.buyerProblems`.
- Replace repeated website type cards with `cityPage.recommendedWebsiteTypes`.
- Replace repeated SEO structure cards with `cityPage.deliverableEmphasis` and `proofProcessVariant`.
- Build `briefMessage` from `cityPage.ctaAngle.whatsappMessage`.
- Build Service schema description from page-specific description and keep `areaServed` matching city/province.
- Keep BreadcrumbList and canonical as currently implemented.

### `src/components/ServiceAreasSection.astro`

Required changes:
- Use `audienceExamples` or `introAngle` to make city cards more useful than `Website profesional untuk bisnis di {areaContext}`.
- Keep homepage limited to priority cities and hub page listing all cities.

### `src/pages/area-layanan.astro`

Required changes:
- Keep hub canonical and ItemList schema.
- Add short explanatory copy that city pages are online service coverage, not physical offices in each city.
- Optionally group cities by province/region once `region` exists.

### `src/data/site.ts`

Claim cleanup and proof policy.

Required changes:
- Review service summaries, portfolio, and testimonials for unsupported metrics or anonymous proof.
- Keep metrics only if verified; otherwise rewrite as process examples or remove the number.
- Avoid generic `terpercaya`/`terbaik`; use process or deliverable language.

### `src/content/services/jasa-pembuatan-website.md`

Claim cleanup and service hub alignment.

Required changes:
- Replace `terbaik` in process copy unless backed by visible proof.
- Explain `murah` in terms of scope/value if kept.
- Ensure service hub links to priority city pages through `ServiceAreasSection` or equivalent.

### `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/FloatingWhatsapp.astro`

Claim cleanup only.

Required changes:
- Remove unsupported `terpercaya` claims if present.
- Keep footer popular area links crawlable.
- Ensure floating WhatsApp copy describes the exact action, not vague free/full-service claims.

### `scripts/seo-audit.mjs`

Verification implementation file.

Add generated-output assertions:
- Parse all `dist/jasa-pembuatan-website-*/index.html` pages.
- Assert all city pages render the city-specific data blocks:
  - local relevance,
  - audience use cases,
  - deliverable emphasis,
  - process/proof transparency,
  - city-specific FAQ.
- Assert FAQ schema count equals visible FAQ count.
- Assert Service schema `areaServed` city matches slug city.
- Assert no banned claims (`terbaik`, `nomor 1`, `dipercaya ribuan`, standalone `terpercaya`) appear on city pages.
- Warn or fail on repeated conditional terms if counts exceed thresholds:
  - `gratis`: only in CTA/free initial consultation context,
  - `murah`: only in pricing/scope context,
  - `profesional`: not more than a defined per-page limit unless tied to deliverables.
- Compute pairwise body-text similarity among city pages after removing nav/footer/scripts/styles.
  - Fail if max similarity remains above 0.80.
  - Fail if median similarity remains above 0.75.
- Assert every city page has links to service hub, area hub, and at least 3 related city/service links.

## Example city data entries

### Jakarta

```ts
{
  city: 'Jakarta',
  slug: 'jasa-pembuatan-website-jakarta',
  province: 'DKI Jakarta',
  priority: 'tier_1',
  audienceExamples: ['perusahaan B2B', 'konsultan', 'klinik', 'properti', 'F&B multi-cabang'],
  introAngle: 'Untuk bisnis Jakarta yang sering dibandingkan sebelum dihubungi, website perlu langsung menjelaskan positioning, layanan utama, bukti kerja, dan jalur konsultasi yang jelas.',
  localBusinessContext: 'Pasar Jakarta kompetitif dan banyak calon klien mengecek beberapa vendor sekaligus sebelum mengirim brief atau meminta quotation.',
  nearbyAreas: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara', 'Tangerang', 'Bekasi', 'Depok'],
  buyerProblems: [
    'Halaman layanan belum menjawab pertanyaan procurement atau decision maker.',
    'Bukti, portfolio, dan CTA tersebar sehingga calon klien ragu menghubungi.',
    'Traffic dari iklan atau SEO belum punya landing page yang mudah dievaluasi.',
  ],
  audienceUseCases: [
    {
      audience: 'perusahaan B2B',
      websiteNeed: 'company profile, halaman layanan, studi kasus, dan form/WhatsApp untuk request quotation',
      conversionGoal: 'mendorong jadwal konsultasi atau permintaan proposal',
    },
    {
      audience: 'klinik dan layanan profesional',
      websiteNeed: 'halaman layanan, FAQ, area layanan, dan tombol booking/konsultasi',
      conversionGoal: 'membuat calon pasien/klien memahami layanan sebelum menghubungi',
    },
  ],
  recommendedWebsiteTypes: [
    { type: 'company-profile', label: 'Company profile B2B', reason: 'membantu calon klien menilai kredibilitas, scope layanan, dan jalur kontak resmi' },
    { type: 'landing-page', label: 'Landing page campaign', reason: 'mendukung traffic Google Ads/Meta Ads dengan CTA dan tracking yang jelas' },
  ],
  deliverableEmphasis: ['struktur halaman layanan', 'blok bukti/portfolio', 'CTA WhatsApp dan form brief', 'basic SEO metadata', 'tracking klik penting'],
  ctaAngle: {
    primaryLabel: 'Minta Struktur Website untuk Bisnis Jakarta',
    whatsappMessage: 'Halo jasamurahweb.com, saya ingin konsultasi struktur website untuk bisnis di Jakarta.',
    microcopy: 'Kirim jenis bisnis, layanan utama, dan target pelanggan; tim akan bantu petakan struktur awal.',
  },
  faqVariants: [
    {
      question: 'Apa jenis website yang paling cocok untuk bisnis B2B di Jakarta?',
      answer: 'Untuk B2B Jakarta, biasanya struktur yang dibutuhkan adalah company profile, halaman layanan, bukti kerja, FAQ, dan jalur request quotation. Jika traffic datang dari iklan, landing page terpisah bisa dibuat untuk campaign tertentu.',
    },
    {
      question: 'Apakah perlu kantor jasamurahweb.com di Jakarta untuk mengerjakan website?',
      answer: 'Tidak. Proses brief, desain, revisi, development, dan launch bisa dilakukan online. Halaman ini menjelaskan area layanan, bukan klaim kantor fisik di Jakarta.',
    },
  ],
  proofProcessVariant: {
    heading: 'Proses dibuat agar decision maker cepat memahami penawaran',
    evidencePolicy: 'process-only',
    bullets: ['mapping layanan dan target klien', 'struktur halaman untuk proposal/request quotation', 'CTA dan tracking untuk evaluasi lead'],
  },
}
```

### Denpasar

```ts
{
  city: 'Denpasar',
  slug: 'jasa-pembuatan-website-denpasar',
  province: 'Bali',
  priority: 'tier_1',
  audienceExamples: ['villa', 'travel', 'wellness', 'F&B', 'event', 'brand lifestyle'],
  introAngle: 'Untuk bisnis Denpasar dan Bali, website sering menjadi titik pertama calon pelanggan melihat visual, paket, lokasi layanan, dan cara bertanya sebelum booking atau datang langsung.',
  localBusinessContext: 'Banyak bisnis Bali bergantung pada visual, inquiry cepat, dan kejelasan paket untuk pelanggan lokal maupun wisatawan.',
  nearbyAreas: ['Denpasar', 'Badung', 'Kuta', 'Canggu', 'Ubud', 'Sanur'],
  buyerProblems: [
    'Galeri dan paket belum tersusun menjadi alur inquiry yang jelas.',
    'Calon pelanggan dari mobile sulit menemukan WhatsApp, lokasi layanan, atau FAQ.',
    'Konten visual kuat tetapi belum didukung struktur SEO dan tracking konversi.',
  ],
  recommendedWebsiteTypes: [
    { type: 'landing-page', label: 'Landing page inquiry', reason: 'cocok untuk paket villa, travel, event, atau wellness yang butuh CTA WhatsApp cepat' },
    { type: 'catalog', label: 'Katalog paket/layanan', reason: 'membantu calon pelanggan membandingkan pilihan sebelum bertanya' },
  ],
  deliverableEmphasis: ['hero visual', 'paket/layanan', 'galeri', 'FAQ booking/inquiry', 'CTA WhatsApp', 'basic SEO lokal'],
  ctaAngle: {
    primaryLabel: 'Bahas Website untuk Inquiry Bisnis Bali',
    whatsappMessage: 'Halo jasamurahweb.com, saya ingin konsultasi website untuk bisnis di Denpasar/Bali.',
    microcopy: 'Ceritakan jenis bisnis dan target pelanggan; struktur awal bisa diarahkan ke inquiry, booking, atau katalog layanan.',
  },
  faqVariants: [
    {
      question: 'Apakah website untuk bisnis Bali bisa dibuat bilingual?',
      answer: 'Bisa jika target pelanggan membutuhkan bahasa Indonesia dan Inggris. Struktur bilingual sebaiknya direncanakan sejak awal agar halaman, CTA, dan SEO tidak saling tumpang tindih.',
    },
    {
      question: 'Apakah cocok untuk villa, travel, wellness, atau F&B?',
      answer: 'Cocok. Struktur halaman dapat berisi paket, galeri, FAQ, area layanan, dan tombol inquiry WhatsApp agar calon pelanggan cepat memahami penawaran.',
    },
  ],
  proofProcessVariant: {
    heading: 'Proses fokus pada visual, paket, dan alur inquiry',
    evidencePolicy: 'process-only',
    bullets: ['susun urutan galeri dan paket', 'siapkan FAQ booking atau inquiry', 'pasang CTA WhatsApp dan tracking klik penting'],
  },
}
```

## Definition of done for implementation

An implementer can mark the PSEO content uniqueness implementation done only when:

1. `src/data/websiteCities.ts` contains the expanded city content model for all 30 city pages.
2. `src/pages/[slug].astro` renders the new data into visible sections.
3. `cityFaqItems` is replaced by city-specific `faqVariants` and FAQ schema matches visible FAQ.
4. Unsupported claims are removed or tied to proof/process.
5. `scripts/seo-audit.mjs` includes similarity, claim, schema, FAQ, and internal-link gates.
6. Build/check passes using the known workaround if `node_modules/.bin/astro` permissions are still broken:
   - `node node_modules/astro/bin/astro.mjs check`
   - `node node_modules/astro/bin/astro.mjs build`
7. SEO audit passes:
   - `node scripts/seo-audit.mjs`
8. Generated city pages remain canonical, linked from `/area-layanan/`, present in sitemap, and not orphaned.
