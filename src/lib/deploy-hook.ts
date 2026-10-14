/**
 * إشعار GitHub بإعادة بناء الموقع فوراً بعد نشر/تعديل المحتوى من الإدارة.
 * يتطلب GITHUB_TOKEN (صلاحية Contents:write) في بيئة التشغيل.
 */
export async function triggerSiteRebuild(reason = 'content'): Promise<boolean> {
  try {
    const token = process.env.GITHUB_TOKEN
    const repo = process.env.GITHUB_REPO || 'nwr031-gif/iraqnow'
    if (!token) return false
    const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'iraqnow-site',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: 'content-update', client_payload: { source: reason } }),
      signal: AbortSignal.timeout(8000),
    })
    return res.status === 204
  } catch {
    return false
  }
}
