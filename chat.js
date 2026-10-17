/* HeatSafe Myanmar AI chatbot UI. The Worker URL is public; model access stays server-side. */
(() => {
  const WORKER_URL = "https://heatsafe-ai-assistant.rechaos.workers.dev/";
  const form = document.getElementById("aiChatForm");
  const input = document.getElementById("aiChatInput");
  const messages = document.getElementById("aiChatMessages");
  const send = document.getElementById("aiChatSend");
  const status = document.getElementById("aiChatStatus");
  if (!form || !input || !messages || !send || !status) return;

  let stoppedForQuota = false;
  const addMessage = (text, who) => {
    const el = document.createElement("div");
    el.className = `ai-chat-bubble ${who === "user" ? "ai-chat-user" : "ai-chat-bot"}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || send.disabled || stoppedForQuota) return;
    addMessage(question, "user");
    input.value = "";
    send.disabled = true;
    status.textContent = "အဖြေရှာနေပါသည်…";

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question })
      });
      let data = {};
      try { data = await response.json(); } catch (_) {}

      if (response.ok && typeof data.answer === "string" && data.answer.trim()) {
        addMessage(data.answer.trim(), "bot");
        status.textContent = "အခမဲ့ AI အသုံးပြုခွင့် ရရှိနေချိန်တွင်သာ အဖြေပေးနိုင်ပါသည်။";
      } else {
        const msg = typeof data.error === "string" ? data.error : "AI ဝန်ဆောင်မှုကို ယခုအချိန်တွင် မရရှိနိုင်ပါ။";
        addMessage(msg, "bot");
        if (response.status === 429 || /quota|limit|exceed|resource exhausted|billing/i.test(msg)) {
          stoppedForQuota = true;
          status.textContent = "AI quota ကန့်သတ်ချက်ရောက်ရှိနိုင်သဖြင့် ထပ်မံမပို့တော့ပါ။ Quota ပြန်လည်ရရှိသည့်အချိန်မှ ပြန်စမ်းပါ။";
        } else if (response.status >= 500) {
          status.textContent = "AI ယာယီမရရှိနိုင်ပါ။ နောက်မှ ပြန်စမ်းပါ။";
        } else {
          status.textContent = "မေးခွန်းကို ပြန်စစ်ပြီး ထပ်မံစမ်းနိုင်ပါသည်။";
        }
      }
    } catch (_) {
      addMessage("အင်တာနက် သို့မဟုတ် AI ဝန်ဆောင်မှုကို မချိတ်ဆက်နိုင်ပါ။ ချိတ်ဆက်မှုကို စစ်ပြီး နောက်မှ ပြန်စမ်းပါ။", "bot");
      status.textContent = "ချိတ်ဆက်မှု မအောင်မြင်ပါ။";
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();
