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
