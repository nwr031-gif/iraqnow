const fs = require('fs')

const KEY = fs.readFileSync('ai-worker/.deploy.secrets.json', 'utf8') ? JSON.parse(fs.readFileSync('ai-worker/.deploy.secrets.json', 'utf8')).NIM_KEY : ''

async function testModel(model) {
  const body = {
    model,
    messages: [
      { role: 'system', content: 'أنت محرر أخبار عراقي محترف. تلتزم بالدقة وعدم التخمين وتجيب بـ JSON صالح فقط بدون أي نص خارج JSON.' },
      { role: 'user', content: `اكتب تقريراً إخبارياً موجزاً عن هذا الخبر بالعربية والإنجليزية في JSON واحد:\n{"category":"...","ar":{"title":"...","excerpt":"...","content":"4 فقرات مفصولة بـ\\n، آخرها المصدر:..."},"en":{"title":"...","excerpt":"...","content":"..."}}\n\nالخبر — المصدر: سكاي نيوز عربية\nالعنوان: البنك المركزي العراقي يرفع احتياطيات الذهب إلى 160 طنًا\nالملخص: أعلن البنك المركزي العراقي ارتفاع احتياطي الذهب إلى نحو 160 طنًا ضمن إستراتيجية تعزيز الأصول.` },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  }
  const t0 = Date.now()
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const j = await res.json()
  const ms = Date.now() - t0
  console.log(`\n===== ${model} =====`)
  console.log(`status: ${res.status} | ${ms}ms`)
  if (j.choices) {
    const msg = j.choices[0].message
    const content = msg.content || ''
    console.log(`finish: ${j.choices[0].finish_reason} | usage: ${JSON.stringify(j.usage || {})}`)
    console.log('--- أول 700 حرف ---')
    console.log(content.slice(0, 700))
  } else {
    console.log(JSON.stringify(j).slice(0, 400))
  }
}

const which = process.argv[2]
testModel(which)
