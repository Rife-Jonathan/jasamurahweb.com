import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#xA0;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const getJsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  );

const getText = (html) => stripTags(html).toLowerCase();
const shingle = (text, size = 5) => {
  const words = text
    .toLowerCase()
    .replace(/jasamurahweb\.com|home|layanan|portfolio|blog|kontak|instagram|facebook|whatsapp/g, ' ')
    .match(/[a-z0-9]+/g) ?? [];
  const out = new Set();
  for (let i = 0; i <= words.length - size; i += 1) out.add(words.slice(i, i + size).join(' '));
  return out;
};
const jaccard = (a, b) => {
  const union = new Set([...a, ...b]);
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return union.size ? intersection / union.size : 0;
};
const median = (items) => {
  const sorted = [...items].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const homeHtml = read('dist/index.html');
const servicesHtml = read('dist/services/index.html');
const areaLayananHtml = read('dist/area-layanan/index.html');
const websiteServiceHtml = read('dist/jasa-pembuatan-website/index.html');
const jakartaCityHtml = read('dist/jasa-pembuatan-website-jakarta/index.html');
const sitemap = read('dist/sitemap-0.xml');
const config = read('astro.config.mjs');
const redirects = read('public/_redirects');

const serviceSlugs = [
  'jasa-pembuatan-website',
  'jasa-aplikasi-web-dan-android',
  'jasa-pembuatan-company-profile',
  'jasa-pembuatan-konten-sosmed',
  'jasa-iklan-di-meta-dan-google',
];

const citySlugs = [
  'jakarta', 'surabaya', 'bandung', 'medan', 'semarang', 'makassar', 'palembang',
  'denpasar', 'yogyakarta', 'tangerang', 'tangerang-selatan', 'bekasi', 'depok',
  'bogor', 'malang', 'batam', 'pekanbaru', 'balikpapan', 'samarinda', 'banjarmasin',
  'solo', 'cirebon', 'sidoarjo', 'gresik', 'padang', 'bandar-lampung', 'pontianak',
  'manado', 'mataram', 'jayapura',
];

const cityNames = {
  jakarta: 'Jakarta', surabaya: 'Surabaya', bandung: 'Bandung', medan: 'Medan', semarang: 'Semarang', makassar: 'Makassar', palembang: 'Palembang', denpasar: 'Denpasar', yogyakarta: 'Yogyakarta', tangerang: 'Tangerang', 'tangerang-selatan': 'Tangerang Selatan', bekasi: 'Bekasi', depok: 'Depok', bogor: 'Bogor', malang: 'Malang', batam: 'Batam', pekanbaru: 'Pekanbaru', balikpapan: 'Balikpapan', samarinda: 'Samarinda', banjarmasin: 'Banjarmasin', solo: 'Solo', cirebon: 'Cirebon', sidoarjo: 'Sidoarjo', gresik: 'Gresik', padang: 'Padang', 'bandar-lampung': 'Bandar Lampung', pontianak: 'Pontianak', manado: 'Manado', mataram: 'Mataram', jayapura: 'Jayapura',
};

assert.match(config, /site:\s*['"]https:\/\/www\.jasamurahweb\.com['"]/, 'Astro site must use www canonical domain');
assert.match(config, /trailingSlash:\s*['"]always['"]/, 'Astro config must enforce trailingSlash always');

assert.match(homeHtml, /<link rel="canonical" href="https:\/\/www\.jasamurahweb\.com\/"\s*\/?\s*>/, 'Homepage canonical must use www domain');
assert.match(homeHtml, /<meta name="robots" content="index, follow"\s*\/?\s*>/, 'Default robots meta must be explicit');
assert.match(homeHtml, /<meta property="og:url" content="https:\/\/www\.jasamurahweb\.com\/"\s*\/?\s*>/, 'OG URL must use www domain');
assert.match(homeHtml, /<meta property="og:image" content="https:\/\/www\.jasamurahweb\.com\/og-image\.png"\s*\/?\s*>/, 'Default OG image must be absolute www /og-image.png');
assert.match(homeHtml, /"@type":"WebSite"/, 'Homepage must include WebSite schema');
assert.match(homeHtml, /"@type":"Organization"/, 'Homepage must include Organization schema');
assert.match(homeHtml, /"url":"https:\/\/www\.jasamurahweb\.com\/?"/, 'Schema URL must use www domain');
assert.match(homeHtml, /href="\/area-layanan\/"/, 'Homepage must link to service area hub');
assert.match(homeHtml, /href="\/jasa-pembuatan-website-jakarta\/"/, 'Homepage service area section must link to priority city pages');
assert.doesNotMatch(homeHtml, /https:\/\/jasamurahweb\.com/, 'Homepage must not output non-www absolute URLs');

assert.match(servicesHtml, /<h2[^>]*>Pilih layanan digital sesuai kebutuhan bisnis Anda<\/h2>/, 'Services index must include an H2 before service cards');
assert.match(servicesHtml, /<meta name="robots" content="index, follow"\s*\/?\s*>/, 'Services page robots meta must be explicit');

assert.ok(exists('dist/area-layanan/index.html'), 'Service area hub page must exist: /area-layanan/');
assert.match(sitemap, /https:\/\/www\.jasamurahweb\.com\/area-layanan\//, 'Sitemap must include service area hub: /area-layanan/');
assert.match(areaLayananHtml, /<h1[^>]*>Jasa Pembuatan Website untuk Bisnis di Berbagai Kota<\/h1>/, 'Service area hub must have a clear H1');
assert.match(areaLayananHtml, /<link rel="canonical" href="https:\/\/www\.jasamurahweb\.com\/area-layanan\/"\s*\/?\s*>/, 'Service area hub canonical must be self-referencing');
assert.match(areaLayananHtml, /"@type":"ItemList"/, 'Service area hub must include ItemList schema');
assert.match(areaLayananHtml, /href="\/jasa-pembuatan-website-jakarta\/"/, 'Service area hub must link to city pages');
assert.match(areaLayananHtml, /href="\/jasa-pembuatan-website-jayapura\/"/, 'Service area hub must include all city pages');
assert.match(areaLayananHtml, /bukan kantor fisik di tiap kota|tanpa mengklaim kantor/, 'Area hub must clarify online coverage, not physical offices');

for (const slug of serviceSlugs) {
  assert.ok(exists(`dist/${slug}/index.html`), `Root service URL must exist: /${slug}/`);
  assert.ok(!exists(`dist/services/${slug}/index.html`), `Old nested service URL must not be generated: /services/${slug}/`);
  assert.match(sitemap, new RegExp(`https:\\/\\/www\\.jasamurahweb\\.com\\/${slug}\\/`), `Sitemap must include root service URL: /${slug}/`);
  assert.doesNotMatch(sitemap, new RegExp(`https:\\/\\/www\\.jasamurahweb\\.com\\/services\\/${slug}\\/`), `Sitemap must exclude old service URL: /services/${slug}/`);
  assert.match(redirects, new RegExp(`/services/${slug}/\\s+/${slug}/\\s+301`), `Redirect must exist from /services/${slug}/ to /${slug}/`);
}

const cityTexts = [];
const conditionalCounts = { gratis: 0, murah: 0, profesional: 0 };
for (const city of citySlugs) {
  const slug = `jasa-pembuatan-website-${city}`;
  const cityName = cityNames[city];
  assert.ok(exists(`dist/${slug}/index.html`), `City SEO page must exist: /${slug}/`);
  assert.match(sitemap, new RegExp(`https:\\/\\/www\\.jasamurahweb\\.com\\/${slug}\\/`), `Sitemap must include city page: /${slug}/`);
  const html = read(`dist/${slug}/index.html`);
  const text = getText(html);
  cityTexts.push({ slug, shingles: shingle(text) });

  assert.match(html, new RegExp(`<link rel="canonical" href="https:\\/\\/www\\.jasamurahweb\\.com\\/${slug}\\/"\\s*\\/?\\s*>`), `City page canonical must be self-referencing: /${slug}/`);
  assert.match(html, /"@type":"FAQPage"/, `City page must include FAQ schema: /${slug}/`);
  assert.match(html, /"@type":"Service"/, `City page must include Service schema: /${slug}/`);
  assert.match(html, /href="\/jasa-pembuatan-website\/"/, `City page must link to main service page: /${slug}/`);
  assert.match(html, /href="\/area-layanan\/"/, `City page must link to service area hub: /${slug}/`);
  assert.match(html, /Search intent lokal/, `City page must include local relevance section: /${slug}/`);
  assert.match(html, /Use case/, `City page must include audience use cases: /${slug}/`);
  assert.match(html, /Deliverable &amp; proses|Deliverable & proses/, `City page must include deliverable/process block: /${slug}/`);
  assert.match(html, /tidak memakai klaim kantor, rating, atau review lokal/, `City page must disclose proof/process policy: /${slug}/`);
  assert.match(html, new RegExp(`"areaServed":\\[\\{"@type":"City","name":"${cityName}"\\}`), `City Service schema must identify the served city: /${slug}/`);

  const jsonLd = getJsonLd(html);
  const faq = jsonLd.find((item) => item['@type'] === 'FAQPage');
  assert.ok(faq, `FAQ schema must parse: /${slug}/`);
  const faqSchemaCount = faq.mainEntity.length;
  const visibleFaqCount = (html.match(/<details/g) ?? []).length;
  assert.equal(faqSchemaCount, visibleFaqCount, `FAQ schema count must match visible FAQ count: /${slug}/`);

  const cityLinkCount = (html.match(/href="\/jasa-pembuatan-website-[a-z-]+\//g) ?? []).length;
  assert.ok(cityLinkCount >= 3, `City page must link to at least 3 related city pages: /${slug}/`);
  assert.doesNotMatch(text, /\b(terbaik|nomor 1|dipercaya ribuan|rating 5\.0|terpercaya)\b/, `City page must not include banned unsupported claims: /${slug}/`);

  for (const term of Object.keys(conditionalCounts)) {
    conditionalCounts[term] += (text.match(new RegExp(`\\b${term}\\b`, 'g')) ?? []).length;
  }
}

const similarities = [];
let maxPair = { score: 0, pair: '' };
for (let i = 0; i < cityTexts.length; i += 1) {
  for (let j = i + 1; j < cityTexts.length; j += 1) {
    const score = jaccard(cityTexts[i].shingles, cityTexts[j].shingles);
    similarities.push(score);
    if (score > maxPair.score) maxPair = { score, pair: `${cityTexts[i].slug} vs ${cityTexts[j].slug}` };
  }
}
const medianSimilarity = median(similarities);
assert.ok(maxPair.score < 0.8, `City page max similarity must stay below 0.80; got ${maxPair.score.toFixed(4)} (${maxPair.pair})`);
assert.ok(medianSimilarity < 0.75, `City page median similarity must stay below 0.75; got ${medianSimilarity.toFixed(4)}`);
assert.ok(conditionalCounts.gratis <= 5, `City pages should not over-repeat gratis; got ${conditionalCounts.gratis}`);
assert.ok(conditionalCounts.profesional <= 120, `City pages should not over-repeat profesional; got ${conditionalCounts.profesional}`);

assert.match(jakartaCityHtml, /<h1[^>]*>Jasa Pembuatan Website Jakarta untuk perusahaan B2B<\/h1>/, 'Jakarta city page must have city-and-audience-focused H1');

assert.match(websiteServiceHtml, /<link rel="canonical" href="https:\/\/www\.jasamurahweb\.com\/jasa-pembuatan-website\/"\s*\/?\s*>/, 'Website service canonical must use root URL');
assert.match(websiteServiceHtml, /"@type":"Service"/, 'Website service page must include Service schema');
assert.doesNotMatch(websiteServiceHtml, /https:\/\/www\.jasamurahweb\.com\/services\/jasa-pembuatan-website\//, 'Website service page must not reference old nested canonical URL');

assert.match(sitemap, /https:\/\/www\.jasamurahweb\.com\//, 'Sitemap URLs must use www domain');
assert.doesNotMatch(sitemap, /https:\/\/jasamurahweb\.com\//, 'Sitemap must not contain non-www URLs');
assert.ok(exists('public/og-image.png'), 'A dedicated 1200x630 OG image must exist at public/og-image.png');

const headerSource = read('src/components/Header.astro');
const footerSource = read('src/components/Footer.astro');
assert.match(headerSource, /<img[^>]+src="\/logo-jasamurabweb\.png"[^>]+width="160"[^>]+height="30"/, 'Header logo image must include width and height');
assert.match(footerSource, /class="grid h-12 w-12/, 'Footer social tap targets should be at least 48x48');

console.log(`SEO audit passed: city_pages=${cityTexts.length}, similarity_median=${medianSimilarity.toFixed(4)}, similarity_max=${maxPair.score.toFixed(4)}, max_pair=${maxPair.pair}, conditional_terms=${JSON.stringify(conditionalCounts)}`);
