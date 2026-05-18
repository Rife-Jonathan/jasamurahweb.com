/**
 * Cloudflare Pages Function — /oauth/callback
 * Menangani callback dari GitHub OAuth, menukar code dengan access token,
 * lalu mengirim token ke Sveltia/Decap CMS via postMessage.
 */
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Jika tidak ada code, tampilkan error
  if (!code) {
    return new Response(errorPage('Authorization Error', 'Tidak ada code yang diterima dari GitHub.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Tukar code dengan access token via GitHub API
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  if (data.error || !data.access_token) {
    return new Response(
      errorPage('GitHub Auth Error', data.error_description || 'Gagal mendapatkan access token.'),
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Kirim token ke CMS via postMessage (format yang diharapkan Decap/Sveltia CMS)
  const token = JSON.stringify(data.access_token);
  const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><title>Authorizing...</title></head>
<body>
  <p>Menghubungkan ke GitHub... jendela ini akan tertutup otomatis.</p>
  <script>
    (function () {
      var token = ${token};
      var msg = 'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' });

      function onMessage(e) {
        window.opener.postMessage(msg, e.origin);
        window.removeEventListener('message', onMessage);
        window.close();
      }

      window.addEventListener('message', onMessage);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

/**
 * Helper: generate halaman error HTML
 * @param {string} title
 * @param {string} message
 * @returns {string}
 */
function errorPage(title, message) {
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:sans-serif;padding:2rem;">
  <h1>${title}</h1>
  <p>${message}</p>
  <a href="/admin/">Kembali ke CMS</a>
</body>
</html>`;
}
