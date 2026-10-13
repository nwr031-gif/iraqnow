/**
 * سجل تدقيق الإدارة — يُسجَّل في جدول audit_log (يتجاهل الفشل بصمت إن لم يوجد الجدول)
 */
const SB = process.env.NEXT_PUBLIC_SUPABASE_URL
const SBK = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function logAudit(action: string, entity: string, entityId?: string, details?: Record<string, unknown>) {
  if (!SB || !SBK) return
  try {
    await fetch(`${SB}/rest/v1/audit_log`, {
      method: 'POST',
      headers: { apikey: SBK, Authorization: `Bearer ${SBK}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        action, entity, entity_id: entityId || null,
        actor: 'admin',
        details: details || {},
        created_at: new Date().toISOString(),
      }),
    })
  } catch { /* التسجيل اختياري — لا يعطل العملية */ }
}
