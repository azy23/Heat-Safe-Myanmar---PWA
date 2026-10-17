// HeatSafe Myanmar AI Assistant — deploy this file to the existing heatsafe-ai-assistant Worker.
// Requires the Cloudflare Workers AI binding named AI. No API keys in the browser.
const ALLOWED_ORIGIN = "https://heatsafemm.vercel.app";
const MODEL = "@cf/meta/llama-3.2-1b-instruct";

const SYSTEM_PROMPT = `
သင်သည် HeatSafe Myanmar ၏ မြန်မာဘာသာ အပူဒဏ်ကျန်းမာရေး အကူအညီပေးသူဖြစ်သည်။
မြန်မာလို သဘာဝကျကျ၊ တိုတိုနှင့် လက်တွေ့အသုံးဝင်အောင် ဖြေပါ။ မေးခွန်းကို ပြန်မကူးပါနှင့်။ ထပ်ခါထပ်ခါ မရေးပါနှင့်။
အပူဒဏ်၊ ရေဓာတ်ဖြည့်တင်းရေး၊ အပူလွန်ကဲမှု၊ အပူကြောင့် မူးဝေခြင်း၊ နေလောင်ခြင်းနှင့် ရာသီဥတုအပူဒဏ်ဆိုင်ရာ ကျန်းမာရေးကာကွယ်မှုအကြောင်းသာ ဖြေပါ။ လက်ရှိမိုးလေဝသဒေတာမရှိလျှင် ခန့်မှန်းမပြောပါနှင့်။
သတိလစ်ခြင်း၊ စိတ်ရှုပ်ထွေးခြင်း၊ တက်ခြင်း သို့မဟုတ် အပူလွန်ကဲမှု ပြင်းထန်ခြင်းရှိလျှင် အရေးပေါ်ဆေးကုသမှု ချက်ချင်းရယူရန်၊ အေးမြသောနေရာသို့ရွှေ့၍ ကိုယ်ခန္ဓာကို အေးမြစေရန် ပြောပါ။ သတိလစ်သူကို ရေမတိုက်ပါနှင့်။
မသေချာလျှင် မသေချာကြောင်း ပြောပါ။ ဆရာဝန်၏ စစ်ဆေးမှုကို အစားမထိုးကြောင်း သတိပေးပါ။
`;

const TOPIC_PATTERN = /အပူ|အပူချိန်|အပူဒဏ်|အပူလွန်|အယ်နီညို|ရာသီဥတု|မိုးလေဝသ|ရေဓာတ်|ရေသောက်|နေလောင်|နေရောင်|အရိပ်|ချွေး|မူးဝေ|လဲကျ|သတိလစ်|ဖျား|ကိုယ်အပူ|အရေးပေါ်|အပူရှောင်|အပူကြောင့်|ကျန်းမာရေး|heat|heatwave|heat stroke|hot weather|hydration|dehydration|sunburn|temperature|weather|health/i;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Vary": "Origin"
    }
  });
}

function getAnswer(result) {
  if (typeof result === "string") return result;
  const value = result?.response ?? result?.choices?.[0]?.message?.content ?? result?.result?.response ?? result?.output_text ?? "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(x => typeof x === "string" ? x : x?.text || "").join("\n").trim();
  return "";
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (origin !== ALLOWED_ORIGIN) return new Response("Forbidden", { status: 403 });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin"
      }});
    }
    if (request.method !== "POST") return json({ error: "POST requests only." }, 405);
    if (!(request.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) return json({ error: "JSON is required." }, 415);

    let body;
    try { body = await request.json(); } catch { return json({ error: "မေးခွန်းကို ပြန်စစ်ပြီး ပို့ပေးပါ။" }, 400); }
    const question = typeof body?.message === "string" ? body.message.trim() : "";
    if (!question || question.length > 1000) return json({ error: "မေးခွန်းကို စာလုံး ၁ မှ ၁၀၀၀ အတွင်း ရေးပေးပါ။" }, 400);
    if (!TOPIC_PATTERN.test(question)) return json({ answer: "ကျွန်တော်က HeatSafe Myanmar အပူဒဏ်ကျန်းမာရေး အကူအညီပေးသူပါ။ အပူဒဏ်၊ ရေဓာတ်ဖြည့်တင်းရေးနဲ့ အပူလွန်ကဲမှုလက္ခဏာများအကြောင်း မေးနိုင်ပါတယ်။" });
    if (!env.AI) {
      console.error("Missing Workers AI binding: AI");
      return json({ error: "AI ချိတ်ဆက်မှု မပြည့်စုံသေးပါ။ Cloudflare AI binding ကို စစ်ဆေးပါ။" }, 503);
    }

    try {
      const result = await env.AI.run(MODEL, {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question }
        ],
        max_tokens: 180,
        temperature: 0.2
      });
      const answer = getAnswer(result).trim();
      if (!answer) {
        console.error("AI returned no readable answer. Result:", JSON.stringify(result).slice(0, 1500));
        return json({ error: "AI အဖြေကို ဖတ်မရသေးပါ။ နောက်မှ ပြန်စမ်းပါ။" }, 502);
      }
      return json({ answer });
    } catch (error) {
      const message = error?.message || String(error);
      console.error("Workers AI request failed:", message);
      // No paid fallback. The Cloudflare account must remain on Workers Free for hard stop at free limits.
      if (/quota|limit|exceed|resource exhausted|billing|too many requests|429/i.test(message)) {
        return json({ error: "ယနေ့အတွက် AI အခမဲ့အသုံးပြုခွင့် ကန့်သတ်ချက် ပြည့်သွားနိုင်ပါသည်။ Quota ပြန်လည်ရရှိသည့်အချိန်မှ ပြန်စမ်းပါ။" }, 429);
      }
      return json({ error: "AI ဝန်ဆောင်မှု ယာယီမရရှိနိုင်ပါ။ နောက်မှ ပြန်စမ်းပါ။" }, 503);
    }
  }
};
