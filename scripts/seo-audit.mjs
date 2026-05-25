import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

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

for (const slug of serviceSlugs) {
  assert.ok(exists(`dist/${slug}/index.html`), `Root service URL must exist: /${slug}/`);
  assert.ok(!exists(`dist/services/${slug}/index.html`), `Old nested service URL must not be generated: /services/${slug}/`);
  assert.match(sitemap, new RegExp(`https:\\/\\/www\\.jasamurahweb\\.com\\/${slug}\\/`), `Sitemap must include root service URL: /${slug}/`);
  assert.doesNotMatch(sitemap, new RegExp(`https:\\/\\/www\\.jasamurahweb\\.com\\/services\\/${slug}\\/`), `Sitemap must exclude old service URL: /services/${slug}/`);
  assert.match(redirects, new RegExp(`/services/${slug}/\\s+/${slug}/\\s+301`), `Redirect must exist from /services/${slug}/ to /${slug}/`);
}

for (const city of citySlugs) {
  const slug = `jasa-pembuatan-website-${city}`;
  assert.ok(exists(`dist/${slug}/index.html`), `City SEO page must exist: /${slug}/`);
  assert.match(sitemap, new RegExp(`https:\\/\\/www\\.jasamurahweb\\.com\\/${slug}\\/`), `Sitemap must include city page: /${slug}/`);
}

assert.match(websiteServiceHtml, /<link rel="canonical" href="https:\/\/www\.jasamurahweb\.com\/jasa-pembuatan-website\/"\s*\/?\s*>/, 'Website service canonical must use root URL');
assert.match(websiteServiceHtml, /"@type":"Service"/, 'Website service page must include Service schema');
assert.doesNotMatch(websiteServiceHtml, /https:\/\/www\.jasamurahweb\.com\/services\/jasa-pembuatan-website\//, 'Website service page must not reference old nested canonical URL');

assert.match(jakartaCityHtml, /<h1[^>]*>Jasa Pembuatan Website Jakarta untuk Bisnis yang Ingin Tampil Profesional<\/h1>/, 'Jakarta city page must have city-focused H1');
assert.match(jakartaCityHtml, /<link rel="canonical" href="https:\/\/www\.jasamurahweb\.com\/jasa-pembuatan-website-jakarta\/"\s*\/?\s*>/, 'Jakarta city page canonical must be self-referencing');
assert.match(jakartaCityHtml, /"@type":"FAQPage"/, 'City pages must include FAQ schema');
assert.match(jakartaCityHtml, /"@type":"Service"/, 'City pages must include Service schema');
assert.match(jakartaCityHtml, /href="\/jasa-pembuatan-website\/"/, 'City pages must internally link to main website service page');
assert.match(jakartaCityHtml, /href="\/area-layanan\/"/, 'City pages must internally link back to service area hub');

assert.match(sitemap, /https:\/\/www\.jasamurahweb\.com\//, 'Sitemap URLs must use www domain');
assert.doesNotMatch(sitemap, /https:\/\/jasamurahweb\.com\//, 'Sitemap must not contain non-www URLs');

assert.ok(exists('public/og-image.png'), 'A dedicated 1200x630 OG image must exist at public/og-image.png');

const headerSource = read('src/components/Header.astro');
const footerSource = read('src/components/Footer.astro');
assert.match(headerSource, /<img[^>]+src="\/logo-jasamurabweb\.png"[^>]+width="160"[^>]+height="30"/, 'Header logo image must include width and height');
assert.match(footerSource, /class="grid h-12 w-12/, 'Footer social tap targets should be at least 48x48');

console.log('SEO audit passed');
