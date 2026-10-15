HeatSafe Myanmar PWA - Preview v1

ပါဝင်သည်
- Open-Meteo မှ လက်ရှိရာသီဥတု (GPS permission လိုအပ်)
- OpenStreetMap မြေပုံဖွင့်ခြင်း
- OpenStreetMap Overpass မှ အနီးအနား mapped amenities ရှာဖွေခြင်း
- နေ့စဉ် checklist ကို localStorage ထဲသိမ်းခြင်း
- အရေးပေါ် အပူဒဏ်လမ်းညွှန်
- Service worker ဖြင့် အခြေခံ offline app shell cache

စမ်းသပ်ရန်
1. ZIP ကို ဖြည်ပါ။
2. HTTPS hosting (ဥပမာ GitHub Pages သို့မဟုတ် Cloudflare Pages) သို့ တင်ပါ။ file:// ဖြင့်ဖွင့်ရုံနဲ့ GPS/service worker အပြည့်အဝမလုပ်နိုင်ပါ။
3. Android Chrome တွင် website ကိုဖွင့်၊ Location permission ပေးပါ။
4. Home Screen menu မှ Add to Home Screen / Install ကိုရွေးပါ။
5. Nearby places ကို GPS ရပြီးမှ စမ်းပါ။ Overpass public server များတွင် rate limit/timeout ဖြစ်နိုင်သည်။

အရေးကြီးသော ကန့်သတ်ချက်များ
- ဤသည် Flutter app ကို Dart မှ အလိုအလျောက်ပြောင်းထားခြင်း မဟုတ်ပါ။ လက်ရှိ source မှ feature နှင့် Burmese guide ကို အခြေခံပြီး ပြန်တည်ဆောက်ထားသော PWA prototype ဖြစ်သည်။
- Background notifications ကို မထည့်ရသေးပါ။ Flutter Workmanager/local notifications ကို PWA service worker နဲ့ တစ်ပုံစံတည်း မပြောင်းနိုင်ပါ။
- Offline mode သည် app shell/လမ်းညွှန်ကိုသာ cache လုပ်ထားပြီး live weather နှင့် nearby search အတွက် Internet လိုသည်။
- အနီးအနားနေရာများသည် OpenStreetMap တွင် map လုပ်ထားသည့် amenities သာဖြစ်ပြီး အတည်ပြု cooling centers မဟုတ်ပါ။
- အလှူငွေလက်ခံနံပါတ်ကို မထည့်ထားပါ။ မူလ source တွင်ပါသောနံပါတ်ကို အတည်ပြုပြီးမှ public-facing build ထဲ ထည့်သင့်သည်။
- Deploy မလုပ်မီ မိုဘိုင်းဖုန်းအမျိုးမျိုးတွင် GPS, network failure, Myanmar font, offline cache, link navigation ကို စမ်းသပ်ပါ။

အရေးကြီး — Nearby CORS ပြဿနာအတွက် v10 ပြင်ဆင်ချက်
--------------------------------------------------
Browser မှ Overpass API ကို တိုက်ရိုက်ခေါ်ရာတွင် CORS / HTTP 406 ဖြစ်နေသောကြောင့် v10 တွင် တိုက်ရိုက်ခေါ်ဆိုမှုကို ဖယ်ရှားပြီး Cloudflare Worker proxy ကို သုံးရန် ပြင်ထားသည်။ Worker ကို deploy မလုပ်မချင်း Nearby စာရင်းကို app အတွင်း တိုက်ရိုက်ရယူ၍ မရနိုင်သေးပါ။

Cloudflare Worker ကို တည်ဆောက်ရန် (အခမဲ့အစီအစဉ်ဖြင့် စတင်နိုင်သည်)
1. https://dash.cloudflare.com/ သို့ ဝင်ပြီး အကောင့်ဖွင့်/ဝင်ပါ။
2. Workers & Pages → Create → Create Worker ကို ရွေးပါ။
3. Worker code ကို Edit code ထဲတွင် အစားထိုးထည့်ပါ။ ဒီ ZIP ထဲက cloudflare-worker.js အကြောင်းအရာအားလုံးကို ကူးထည့်ပါ။
4. Deploy ကိုနှိပ်ပါ။ Worker URL ဥပမာ https://heatsafe-nearby.<your-account>.workers.dev ကို ကူးယူပါ။
5. app.js ဖိုင်ထဲမှာ အပေါ်ဆုံးနားရှိ const NEARBY_PROXY_URL='' ကို ရှာပါ။ ဥပမာ const NEARBY_PROXY_URL='https://heatsafe-nearby.<your-account>.workers.dev'; ဟု Worker URL ဖြည့်ပါ။ (angle bracket ပါသော ဥပမာစာသားကို အမှန်တကယ် URL ဖြင့် အစားထိုးပါ။)
6. app.js ကို ပြင်ပြီး ZIP ကို ပြန်တင်ပါ။ Browser/hosting မှ cache ရှိပါက hard refresh လုပ်ပါ။
7. Worker URL ကို browser တွင် https://YOUR-WORKER-URL/?lat=19.7599&lon=96.1003 ဖြင့် စမ်းပါ။ JSON မှာ elements array ပါလာရင် အလုပ်လုပ်နေသည်။ ဆာဗာအားလုံး မရလျှင် error JSON ပြန်လာနိုင်သည်။

လုံခြုံရေးမှတ်ချက်: Worker code သည် lat/lon ကိုသာ လက်ခံပြီး Overpass query ကို ကိုယ်တိုင်တည်ဆောက်သည်။ မည်သည့် URL မဆို fetch လုပ်ခွင့်ပေးသော open proxy မဟုတ်ပါ။ Production အတွက် cloudflare-worker.js ရှိ ALLOWED_ORIGINS ကို သင့် PWA ၏ domain တစ်ခုတည်းအဖြစ် သတ်မှတ်ပါ။
