import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default defineCloudflareConfig({
  // تفعيل التخزين المؤقت للصفحات الثابتة (اختياري - يحتاج R2 لتفعيله لاحقاً)
  // incrementalCache: r2IncrementalCache,
})
