/**
 * يضبط إعدادات مشروع Pages: env vars + compatibility + محاولة ربط GitHub
 * الاستخدام: CF_API_TOKEN=... CF_ACCOUNT_ID=... node scripts/configure-pages.mjs
 */

const TOKEN = process.env.CF_API_TOKEN
const ACCOUNT = process.env.CF_ACCOUNT_ID
const PROJECT = 'iraqnow'

const ENV_VARS = {
  NEXT_PUBLIC_SUPABASE_URL: { value: 'https://xtdrkziyndkvaxkxvfqx.supabase.co' },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: { value: 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i' },
  MEILISEARCH_HOST: { value: 'https://ms-7fba9866c156-55153.par.meilisearch.io' },
  MEILISEARCH_SEARCH_KEY: { value: '43adf2d3612dd385beb287cbb8bf065255f1ab0da6cb413cfd0c5bd8fb4c87e5' },
  MEILISEARCH_MASTER_KEY: { value: '227eed949d2020fb92f2d347d1338a1caf9fd680' },
  MEILISEARCH_ADMIN_KEY: { value: 'c35181225c36d63cd0790ae9f5e97cdf9f451ceac11c2ce0d5010390dbaacb2e' },
  NEXT_PUBLIC_APP_URL: { value: 'https://iraqnow.pages.dev' },
  NEXT_PUBLIC_APP_NAME: { value: 'IraqNow' },
  NEXTAUTH_URL: { value: 'https://iraqnow.pages.dev' },
  NEXTAUTH_SECRET: { value: 'iqn-9c4547f9065df884a3b7c2e1d8f6093e7a5b4c2d1e0f9876543210abcdef98765' },
  AUTH_SECRET: { value: 'iqn-9c4547f9065df884a3b7c2e1d8f6093e7a5b4c2d1e0f9876543210abcdef98765' },
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN: { value: 'fe3934c675b44d1ca90c59b5427423c2' },
  NEXT_PUBLIC_UMAMI_SRC: { value: 'https://cloud.umami.is/script.js' },
  NEXT_PUBLIC_UMAMI_ID: { value: '9f987654-253d-4852-8712-7a4e46ac4858' },
  NEXT_PUBLIC_ONESIGNAL_APP_ID: { value: '37a3a5dc-298e-489c-a5ef-e4261c587604' },
  NEXT_PUBLIC_ONESIGNAL_SAFARI_ID: { value: 'web.onesignal.auto.220e9b0b-02d4-465b-a5d3-49d3d287ceee' },
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: { value: '0x4AAAAAAFTPRBgtHYDDN7s3' },
  TURNSTILE_SECRET_KEY: { value: '0x4AAAAAAFTPREoe3gtHr8jkKjFPTkwQGi8' },
  RESEND_API_KEY: { value: process.env.RESEND_KEY || '' },
  NEWS_FROM_EMAIL: { value: 'onboarding@resend.dev' },
  ADMIN_PASSWORD: { value: process.env.ADMIN_PW || '' },
  ADMIN_COOKIE_SECRET: { value: 'iqn-admin-cookie-9c4547f9065d' },
}

async function api(path, method = 'GET', body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, body: await res.json() }
}

/* 1) env vars + compatibility */
const patch = {
  build_config: {
    build_command: 'npm run build:pages',
    destination_dir: 'pages-deploy',
    root_dir: '',
    build_caching: false,
  },
  deployment_configs: {
    production: {
      env_vars: ENV_VARS,
      compatibility_date: '2025-03-25',
      compatibility_flags: ['nodejs_compat'],
    },
    preview: {
      env_vars: ENV_VARS,
      compatibility_date: '2025-03-25',
      compatibility_flags: ['nodejs_compat'],
    },
  },
}

const r1 = await api(`/accounts/${ACCOUNT}/pages/projects/${PROJECT}`, 'PATCH', patch)
console.log(r1.body.success ? '✓ env vars + إعدادات البناء' : `✗ إعدادات: ${r1.status} ${JSON.stringify(r1.body.errors || '').slice(0, 200)}`)

/* 2) محاولة ربط GitHub */
const r2 = await api(`/accounts/${ACCOUNT}/pages/projects/${PROJECT}`, 'PATCH', {
  source: {
    type: 'github',
    config: {
      owner: 'nwr031-gif',
      repo_name: 'iraqnow',
      production_branch: 'main',
      pr_comments_enabled: false,
      deployments_enabled: true,
      production_deployment_enabled: true,
    },
  },
})
if (r2.body.success) {
  console.log('✓ GitHub مرتبط بالمشروع')
} else {
  console.log(`✗ ربط GitHub: ${r2.status}`)
  console.log(JSON.stringify(r2.body.errors || r2.body, null, 1).slice(0, 600))
}
