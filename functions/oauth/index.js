/**
 * Cloudflare Pages Function — /oauth
 * Menginisiasi GitHub OAuth flow dengan redirect ke GitHub authorization page.
 *
 * Env vars yang dibutuhkan di Cloudflare Pages:
 *   GITHUB_CLIENT_ID     — dari GitHub OAuth App
 *   GITHUB_CLIENT_SECRET — dari GitHub OAuth App (disimpan sebagai secret)
 */
export async function onRequestGet(context) {
  const { env, request } = context;
  const origin = new URL(request.url).origin;

  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${origin}/oauth/callback`,
    scope: 'repo,user',
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
