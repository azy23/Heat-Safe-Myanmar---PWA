HeatSafe Myanmar PWA - Preview v1

ပါဝင်သည်
- Open-Meteo မှ လက်ရှိရာသီဥတု (GPS permission လိုအပ်)
- OpenStreetMap မြေပုံဖွင့်ခြင်း
- Geoapify Places API မှ အနီးအနား အကူအညီရနိုင်သောနေရာများ ရှာဖွေခြင်း
- နေ့စဉ် checklist ကို localStorage ထဲသိမ်းခြင်း
- အရေးပေါ် အပူဒဏ်လမ်းညွှန်
- Service worker ဖြင့် အခြေခံ offline app shell cache

စမ်းသပ်ရန်
1. ZIP ကို ဖြည်ပါ။
2. HTTPS hosting (ဥပမာ GitHub Pages သို့မဟုတ် Cloudflare Pages) သို့ တင်ပါ။ file:// ဖြင့်ဖွင့်ရုံနဲ့ GPS/service worker အပြည့်အဝမလုပ်နိုင်ပါ။
3. Android Chrome တွင် website ကိုဖွင့်၊ Location permission ပေးပါ။
4. Home Screen menu မှ Add to Home Screen / Install ကိုရွေးပါ။
5. Nearby places ကို GPS ရပြီးမှ စမ်းပါ။ Worker သည် Geoapify Places API ကို အသုံးပြုသည်။

အရေးကြီးသော ကန့်သတ်ချက်များ
- ဤသည် Flutter app ကို Dart မှ အလိုအလျောက်ပြောင်းထားခြင်း မဟုတ်ပါ။ လက်ရှိ source မှ feature နှင့် Burmese guide ကို အခြေခံပြီး ပြန်တည်ဆောက်ထားသော PWA prototype ဖြစ်သည်။
- Background notifications ကို မထည့်ရသေးပါ။ Flutter Workmanager/local notifications ကို PWA service worker နဲ့ တစ်ပုံစံတည်း မပြောင်းနိုင်ပါ။
- Offline mode သည် app shell/လမ်းညွှန်ကိုသာ cache လုပ်ထားပြီး live weather နှင့် nearby search အတွက် Internet လိုသည်။
- အနီးအနားနေရာများသည် OpenStreetMap တွင် map လုပ်ထားသည့် amenities သာဖြစ်ပြီး အတည်ပြု cooling centers မဟုတ်ပါ။
- အလှူငွေလက်ခံနံပါတ်ကို မထည့်ထားပါ။ မူလ source တွင်ပါသောနံပါတ်ကို အတည်ပြုပြီးမှ public-facing build ထဲ ထည့်သင့်သည်။
- Deploy မလုပ်မီ မိုဘိုင်းဖုန်းအမျိုးမျိုးတွင် GPS, network failure, Myanmar font, offline cache, link navigation ကို စမ်းသပ်ပါ။

အရေးကြီး — Nearby CORS ပြဿနာအတွက် v10 ပြင်ဆင်ချက်
--------------------------------------------------
Nearby Search ကို Cloudflare Worker + Geoapify Places API ဖြင့် ချိတ်ဆက်ထားသည်။ ဒီ ZIP ၏ app.js ထဲတွင် သင့် Worker URL ကို ကြိုတင်ထည့်ထားပြီးဖြစ်သည်။

Worker ကို ပြင်ဆင်ရန် / ပြန်တင်ရန် (လိုအပ်မှသာ)
1. Cloudflare Dashboard → Workers & Pages → heatsafe-nearby-proxy → Edit code ကိုဖွင့်ပါ။
2. ဒီ ZIP ထဲက cloudflare-worker.js အကြောင်းအရာအားလုံးကို ကူးထည့်ပြီး Deploy လုပ်ပါ။
3. Settings → Variables and Secrets တွင် GEOAPIFY_API_KEY ကို Secret အဖြစ် သိမ်းထားကြောင်း စစ်ပါ။ API key ကို app.js ထဲ မထည့်ပါနှင့်။
4. Browser တွင် https://heatsafe-nearby-proxy.rechaos.workers.dev/?lat=19.7599&lon=96.1003 ကို ဖွင့်ပါ။ JSON ထဲတွင် elements array ပြန်လာရမည်။
5. PWA ကို host တင်ထားပါက updated ဖိုင်များကို အဲဒီ hosting ထဲသို့ upload လုပ်ပါ။ Cache ဟောင်းနေပါက site ကို hard refresh လုပ်ပါ သို့မဟုတ် PWA ကိုပိတ်ဖွင့်ပါ။

လုံခြုံရေးမှတ်ချက်: Worker သည် lat/lon ကိုသာ လက်ခံပြီး Geoapify endpoint ကို ကိုယ်တိုင်တည်ဆောက်သည်။ API key ကို Cloudflare Secret ထဲတွင်သာ ထားပါ။ Production အတွက် cloudflare-worker.js ရှိ ALLOWED_ORIGINS ကို သင့် PWA ၏ domain တစ်ခုတည်းအဖြစ် သတ်မှတ်ပါ။


မြေပုံအသစ် (v12): “မြေပုံကြည့်ရန်” ခလုတ်များသည် Google Maps ကို ဖွင့်ပေးပါသည်။


AI Chatbot ထည့်သွင်းထားသော v25
--------------------------------
ပါဝင်သည်: အပူဒဏ်ကျန်းမာရေး AI chatbot UI နှင့် Worker code သီးခြားဖိုင်။ Messenger ခလုတ်နှင့် မူလ PWA features များကို ထိန်းထားသည်။

Chatbot ကို စမ်းသပ်ရန်
1. ZIP ကို ဖြည်ပါ။
2. Cloudflare Dashboard → Workers & Pages → heatsafe-ai-assistant → Edit code ကိုဖွင့်ပါ။
3. ဒီ ZIP ထဲက heatsafe-ai-assistant-worker.js ဖိုင်တစ်ခုလုံးကို ကူးထည့်ပြီး Deploy လုပ်ပါ။ Worker တွင် AI binding အမည် AI ရှိရပါမည်။
4. PWA ဖိုင်များကို လက်ရှိ https://heatsafemm.vercel.app hosting ထဲသို့ တင်ပါ။ index.html, style.css, app.js, chat.js, sw.js နှင့် manifest.webmanifest အားလုံးကို တင်ပါ။
5. Website ကို ပြန်ဖွင့်ပြီး “🤖 အပူဒဏ်ကျန်းမာရေး AI အကူအညီ” အပိုင်းမှာ “အပူကြောင့် မူးဝေလာရင် ဘာလုပ်ရမလဲ” ဟု မေးပါ။

အခမဲ့အသုံးပြုမှု အရေးကြီးချက်
- Model ကို @cf/meta/llama-3.2-1b-instruct သို့ ပြောင်းထားသည်။ API key ကို browser ထဲမထည့်ပါ။ Paid fallback မရှိပါ။
- အခမဲ့ quota ပြည့်လျှင် Cloudflare Workers AI က request ကို ငြင်းပယ်နိုင်ပြီး chatbot က အမှားပြသမည်။
- အခကြေးငွေ မဖြစ်စေရန် Cloudflare account ကို Workers Free plan တွင်သာ ထားပါ။ Workers Paid plan သို့ မတင်ပါနှင့်။ Account paid plan ဖြစ်နေပါက free quota ကျော်သုံးစွဲမှုအတွက် ကောက်ခံနိုင်သောကြောင့် ဒီလိုအပ်ချက်အတွက် မသင့်ပါ။ Cloudflare AI free allowance သည် အကောင့်အလိုက် နေ့စဉ်ကန့်သတ်ချက်ရှိပြီး ပြည့်သွားလျှင် reset အထိ ရပ်မည်။
- ဒီ Worker သည် health/heat-related topic များကိုသာ AI ဆီပို့သည်။ အခြားမေးခွန်းများအတွက် fixed reply ပြန်ပေးသည်။
- AI အဖြေသည် ဆေးဘက်ဆိုင်ရာ အရေးပေါ်အကဲဖြတ်မှု မဟုတ်ပါ။ သတိလစ်ခြင်း၊ စိတ်ရှုပ်ထွေးခြင်း သို့မဟုတ် တက်ခြင်းရှိလျှင် အရေးပေါ်ဆေးကုသမှု ချက်ချင်းရယူပါ။


Version 1.1 UI update (v26)
- Added a prominent AI assistant spotlight directly below the weather card.
- Added quick question chips and a clear AI call-to-action.
- AI chat is expanded and visible by default; the existing AI Worker URL and Nearby Places service are unchanged.
- Quick questions fill the chat input; the user still taps Send to submit.


ဗားရှင်း 27 (အရောင်ဒီဇိုင်း): Google logo ကို တိုက်ရိုက်ကူးယူထားခြင်းမဟုတ်ဘဲ အပြာ၊ အနီ၊ အဝါ၊ အစိမ်း palette ကို HeatSafe Myanmar အတွက် သီးသန့်အသုံးပြုထားသည်။ AI Worker နှင့် Nearby Places Worker logic မပြောင်းထားပါ။
