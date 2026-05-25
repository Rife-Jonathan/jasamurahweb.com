import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const homeHtml = read('dist/index.html');
const servicesHtml = read('dist/services/index.html');
const sitemap = read('dist/sitemap-0.xml');
const config = read('astro.config.mjs');

assert.match(config, /site:\s*['"]https:\/\/www\.jasamurahweb\.com['"]/, 'Astro site must use www canonical domain');
assert.match(config, /trailingSlash:\s*['"]always['"]/, 'Astro config must enforce trailingSlash always');

assert.match(homeHtml, /<link rel="canonical" href="https:\/\/www\.jasamurahweb\.com\/"\s*\/?\s*>/, 'Homepage canonical must use www domain');
assert.match(homeHtml, /<meta name="robots" content="index, follow"\s*\/?\s*>/, 'Default robots meta must be explicit');
assert.match(homeHtml, /<meta property="og:url" content="https:\/\/www\.jasamurahweb\.com\/"\s*\/?\s*>/, 'OG URL must use www domain');
assert.match(homeHtml, /<meta property="og:image" content="https:\/\/www\.jasamurahweb\.com\/og-image\.png"\s*\/?\s*>/, 'Default OG image must be absolute www /og-image.png');
assert.match(homeHtml, /"@type":"WebSite"/, 'Homepage must include WebSite schema');
assert.match(homeHtml, /"@type":"Organization"/, 'Homepage must include Organization schema');
assert.match(homeHtml, /"url":"https:\/\/www\.jasamurahweb\.com\/?"/, 'Schema URL must use www domain');
assert.doesNotMatch(homeHtml, /https:\/\/jasamurahweb\.com/, 'Homepage must not output non-www absolute URLs');

assert.match(servicesHtml, /<h2[^>]*>Pilih layanan digital sesuai kebutuhan bisnis Anda<\/h2>/, 'Services index must include an H2 before service cards');
assert.match(servicesHtml, /<meta name="robots" content="index, follow"\s*\/?\s*>/, 'Services page robots meta must be explicit');

assert.match(sitemap, /https:\/\/www\.jasamurahweb\.com\//, 'Sitemap URLs must use www domain');
assert.doesNotMatch(sitemap, /https:\/\/jasamurahweb\.com\//, 'Sitemap must not contain non-www URLs');

assert.ok(exists('public/og-image.png'), 'A dedicated 1200x630 OG image must exist at public/og-image.png');

const headerSource = read('src/components/Header.astro');
const footerSource = read('src/components/Footer.astro');
assert.match(headerSource, /<img[^>]+src="\/logo-jasamurabweb\.png"[^>]+width="160"[^>]+height="30"/, 'Header logo image must include width and height');
assert.match(footerSource, /class="grid h-12 w-12/, 'Footer social tap targets should be at least 48x48');

console.log('SEO audit passed');
