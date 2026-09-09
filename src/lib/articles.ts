/**
 * SEO article content — bilingual (fa/en).
 * Rendered as expandable sections on the single page app.
 */

export interface Article {
  id: string;
  titleFa: string;
  titleEn: string;
  bodyFa: string[]; // paragraphs
  bodyEn: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "what-is-my-ip",
    titleFa: "آی پی من چیست؟ راهنمای کامل آدرس IP",
    titleEn: "What Is My IP? The Complete Guide to IP Addresses",
    bodyFa: [
      "آدرس IP (Internet Protocol) شناسه‌ی یکتای دستگاه شما در شبکه اینترنت است؛ همان‌طور که نشانی پستی برای خانه شما یکتاست، IP هم برای اتصال اینترنت شما یکتا است. هر بسته‌ی اطلاعاتی که ارسال یا دریافت می‌کنید، با این آدرس برچسب‌گذاری می‌شود تا پاسخ‌ها دقیقاً به دستگاه شما برگردند. بدون IP، ارتباط در اینترنت اساساً ممکن نیست.",
      "وقتی صفحه‌ای را باز می‌کنید، مرورگر شما ابتدا از DNS می‌پرسد که IP سرور مقصد چیست، سپس درخواست خود را همراه با IP مبدأ (یعنی IP شما) ارسال می‌کند. سرور نیز پاسخ را به همان IP برمی‌گرداند. به همین دلیل است که سایت‌هایی مثل myip.thepm.ir می‌توانند IP شما را نمایش دهند: سرور صرفاً آدرس مبدأ درخواست را می‌خواند.",
      "IP شما معمولاً توسط ISP (ارائه‌دهنده خدمات اینترنت) به شما اختصاص داده می‌شود. در اکثر اتصالات خانگی، این آدرس «داینامیک» است و با هر اتصال مجدد یا پس از مدتی تغییر می‌کند. در اتصالات سازمانی یا سرورها معمولاً IP «استاتیک» و ثابت اختصاص داده می‌شود تا سرویس‌ها همیشه در دسترس یک آدرس مشخص باشند.",
      "دو نسخه اصلی از پروتکل IP وجود دارد: IPv4 که اعدادی مثل 192.168.1.1 است و ۴ میلیارد آدرس دارد، و IPv6 که فرمتی مثل 2001:db8::1 دارد و فضای آدرسی تقریباً نامحدودی فراهم می‌کند. به دلیل اتمام آدرس‌های IPv4، اینترنت به‌تدریج به IPv6 مهاجرت می‌کند و ممکن است شما هم به‌طور همزمان هر دو را داشته باشید (Stack دوگانه).",
      "نمایش IP شما در این صفحه با سرعت لبه‌ای و بدون ذخیره‌سازی انجام می‌شود. ما هیچ لاگی از استعلام‌ها نگه نمی‌داریم و اطلاعات فقط برای همین جلسه نمایش داده می‌شود؛ رویکردی که حریم خصوصی را در اولویت قرار می‌دهد.",
    ],
    bodyEn: [
      "An IP (Internet Protocol) address is the unique identifier of your device on the internet — just as your postal address uniquely identifies your home. Every packet you send or receive is tagged with this address so that responses can find their way back to your device. Without an IP address, communication on the internet would simply be impossible.",
      "When you open a web page, your browser first asks DNS for the destination server's IP, then sends the request along with your source IP. The server replies to that same address. That is exactly how a site like myip.thepm.ir can show your IP: the server simply reads the source address of the incoming request.",
      "Your IP is typically assigned by your ISP (Internet Service Provider). In most home connections the address is dynamic and changes periodically or upon reconnection. Business lines and servers usually get static IPs so services remain reachable at a fixed address.",
      "There are two main versions of the protocol: IPv4, which looks like 192.168.1.1 and provides about 4 billion addresses, and IPv6, which looks like 2001:db8::1 and offers a practically unlimited address space. Because IPv4 addresses ran out, the internet is gradually migrating to IPv6 — you may even have both at the same time (dual stack).",
      "Showing your IP on this page happens at the edge with zero logging. We keep no record of lookups; data is displayed only for your current session — a privacy-first approach.",
    ],
  },
  {
    id: "ipv4-vs-ipv6",
    titleFa: "تفاوت IPv4 و IPv6 کدام است؟",
    titleEn: "IPv4 vs IPv6: What Is the Difference?",
    bodyFa: [
      "IPv4 نخستین نسخه تجاری از پروتکل IP است که از سال ۱۹۸۳ در حال استفاده است. این پروتکل آدرس‌ها را در ۳۲ بیت نگه می‌دارد که حدود ۴٫۳ میلیارد ترکیب ممکن می‌سازد. در دهه ۱۹۹۰ این تعداد کافی به نظر می‌رسید، اما انفجار رشد اینترنت، موبایل‌ها و اینترنت اشیا باعث شد این فضا به پایان برسد.",
      "IPv6 با آدرس‌های ۱۲۸ بیتی مشکل کمبود را برای همیشه حل کرد؛ ۳۴۰ undecillion آدرس ممکن یعنی به‌ازای هر نفر روی زمین میلیاردها آدرس. علاوه بر ظرفیت، IPv6 پیکربندی خودکار (SLAAC)، سربار هدر کمتر، پشتیبانی داخلی از IPsec و کارآمدی بهتر در مسیریابی را نیز به همراه دارد.",
      "از نظر ظاهری، IPv4 چهار عدد ۰ تا ۲۵۵ جدا‌شده با نقطه است (مثل 8.8.8.8) اما IPv6 هشت گروه چهاررقمی هگز است که با دونقطه جدا می‌شوند (مثل 2001:4860:4860::8888) و صفرهای ابتدای هر گروه حذف و دنباله‌های صفر با :: فشرده می‌شوند.",
      "هنوز بخش بزرگی از ترافیک جهان روی IPv4 اجرا می‌شود و تکنیک‌هایی مثل NAT و CGNAT این کمبود را جبران کرده‌اند؛ به همین دلیل ممکن است ده‌ها دستگاه خانگی شما یک IP عمومی مشترک داشته باشند. با گسترش IPv6، هر دستگاه می‌تواند آدرس عمومی مستقیم خود را داشته باشد.",
      "می‌توانید در این صفحه ببینید که اتصال شما از IPv4، IPv6 یا هر دو پشتیبانی می‌کند. اگر IPv6 ندارید، با ISP خود تماس بگیرید؛ بسیاری از ارائه‌دهنده‌ها آن را به‌صورت رایگان فعال می‌کنند.",
    ],
    bodyEn: [
      "IPv4 is the first commercially deployed version of the IP protocol, in use since 1983. It stores addresses in 32 bits, giving roughly 4.3 billion possible combinations. That seemed plenty in the 1990s, but the explosion of the internet, mobile devices and IoT exhausted the space.",
      "IPv6 solves scarcity forever with 128-bit addresses — 340 undecillion possibilities, billions of addresses for every person on Earth. Beyond capacity, IPv6 brings auto-configuration (SLAAC), simplified header overhead, native IPsec support and improved routing efficiency.",
      "Visually, IPv4 is four numbers 0–255 separated by dots (e.g. 8.8.8.8), while IPv6 is eight hex groups separated by colons (e.g. 2001:4860:4860::8888) with leading zeros removed and long zero runs compressed to ::.",
      "Much of the world's traffic still runs on IPv4, and techniques like NAT and CGNAT hide the shortage — that's why dozens of your home devices may share one public IP. As IPv6 adoption grows, every device can have its own direct public address.",
      "You can check on this page whether your connection supports IPv4, IPv6 or both. If you lack IPv6, contact your ISP — many enable it for free.",
    ],
  },
  {
    id: "hide-ip",
    titleFa: "چگونه IP خود را مخفی کنیم؟ راهنمای VPN",
    titleEn: "How to Hide Your IP Address: The VPN Guide",
    bodyFa: [
      "پنهان کردن IP عمومی یکی از رایج‌ترین اقدامات برای حفظ حریم خصوصی است. وقتی از VPN استفاده می‌کنید، ترافیک شما ابتدا به سرور VPN می‌رود و از آنجا به مقصد ارسال می‌شود؛ در نتیجه سایت‌ها IP سرور VPN را می‌بینند، نه IP واقعی شما. این کار هویت اینترنتی شما را از ردیابی ساده محافظت می‌کند.",
      "انواع مختلفی از ابزارها این کار را انجام می‌دهند: VPN رمزنگاری‌شده کامل امن‌ترین گزینه است؛ پروکسی فقط ترافیک وب را عبور می‌دهد و رمزنگاری سرتاسری ندارد؛ Tor با مسیریابی سه‌لایه ناشناس‌بودن قوی اما کندی فراهم می‌کند. انتخاب به سطح نیاز حریم خصوصی و سرعت موردانتظار بستگی دارد.",
      "مراقب خدمات رایگان مشکوک باشید؛ برخی از آن‌ها ترافیک شما را می‌فروشند یا بدافزار توزیع می‌کنند. یک VPN معتبر باید سیاست no-log مستقل‌آudited داشته باشد، پروتکل مدرن (WireGuard یا OpenVPN) استفاده کند و سرورهای نزدیک به موقعیت شما داشته باشد.",
      "برای بررسی اینکه VPN شما واقعاً کار می‌کند، قبل و بعد از اتصال این صفحه را باز کنید؛ IP نمایش‌داده‌شده باید تغییر کند. تست نشت WebRTC در تب امنیت این صفحه نیز نشان می‌دهد که آیا مرورگرتان به‌طور ناخواسته IP واقعی شما را فاش می‌کند — یکی از رایج‌ترین نشتی‌ها حتی در presence VPN.",
    ],
    bodyEn: [
      "Hiding your public IP is one of the most common privacy moves. When you use a VPN, your traffic first reaches the VPN server and is then relayed to its destination; websites therefore see the VPN server's IP instead of yours. This protects you from simple tracking.",
      "Several tools can do this: a fully encrypted VPN is the most secure option; a proxy only forwards web traffic without end-to-end encryption; Tor provides strong anonymity through three-layer routing at the cost of speed. Your choice depends on your privacy needs and expected performance.",
      "Beware of sketchy free services — some sell your traffic or distribute malware. A reputable VPN should have an independently audited no-log policy, modern protocols (WireGuard or OpenVPN) and servers near your location.",
      "To verify your VPN actually works, open this page before and after connecting — the displayed IP should change. The WebRTC leak test in the Security tab also reveals whether your browser inadvertently exposes your real IP, one of the most common leaks even with a VPN active.",
    ],
  },
  {
    id: "geolocation",
    titleFa: "IP Geolocation چیست و چگونه کار می‌کند؟",
    titleEn: "What Is IP Geolocation and How Does It Work?",
    bodyFa: [
      "IP Geolocation فناوری تخمین موقعیت جغرافیایی یک آدرس IP است. این تخمین از پایگاه‌های داده‌ای به دست می‌آید که رنج‌های IP را به اطلاعات کشور، شهر و حتی مختصات جغرافیایی نگاشت می‌کنند. این داده‌ها از منابع مختلفی از جمله رجیستری‌های منطقه‌ای (RIR)، اطلاعات WHOIS و اندازه‌گیری‌های تاخیر شبکه جمع می‌شوند.",
      "نکته مهم: این موقعیت «تخمینی» است. مکان نمایش‌داده‌شده معمولاً به نزدیک‌ترین نود ISP یا مرکز داده اشاره دارد، نه آدرس دقیق منزل یا محل کار شما. در شهرهای بزرگ خطای چند کیلومتری طبیعی است و در برخی موارد حتی شهر اشتباه نمایش داده می‌شود، به‌خصوص وقتی از VPN یا CGNAT استفاده می‌کنید.",
      "دقت Geolocation به منبع داده بستگی دارد؛ به همین دلیل ما در myip.thepm.ir اطلاعات را از چندین منبع مستقل به‌طور همزمان تجمیع می‌کنیم و در صورت اختلاف، داده پرتکرارتر و معتبرتر را نمایش می‌دهیم. این روش خطای هر منبع واحد را کاهش می‌دهد.",
      "کاربردهای Geolocation شامل نمایش محلی قیمت‌ها و زبان، مدیریت تقلب، مسدودسازی جغرافیایی محتوا و بهینه‌سازی CDN است. هیچ قانونی اجازه نمی‌دهد Geolocation به‌تنهایی برای شناسایی هویت افراد استفاده شود؛ برای اهداف حساس مثل مجازات، باید با داده‌های رسمی ISP ترکیب شود.",
    ],
    bodyEn: [
      "IP geolocation is the technology of estimating the physical location of an IP address. The estimate comes from databases that map IP ranges to country, city and even coordinates. This data is aggregated from regional registries (RIRs), WHOIS records and network latency measurements.",
      "Important: the location is an estimate. The displayed place usually points to the nearest ISP node or datacenter, not your exact home or office. A few kilometers of error is normal in large cities, and sometimes even the city is wrong — especially with VPNs or CGNAT.",
      "Accuracy depends on the data source; that's why myip.thepm.ir aggregates several independent sources simultaneously and prefers the more consistent, reputable one when they disagree, reducing the error of any single source.",
      "Applications include localized pricing and language, fraud management, geo-blocking of content and CDN optimization. Geolocation alone may not legally identify a person; for sensitive purposes it must be combined with official ISP records.",
    ],
  },
  {
    id: "static-dynamic",
    titleFa: "IP استاتیک یا داینامیک؟ کدام برای شما مناسب است؟",
    titleEn: "Static or Dynamic IP: Which One Suits You?",
    bodyFa: [
      "IP داینامیک رایج‌ترین حالت برای کاربران خانگی است؛ ISP با روش DHCP آدرسی موقت به مودم شما اختصاص می‌دهد و پس از مدتی (روزانه تا هفتگی) آن را تغییر می‌دهد. این مدل مدیریت آدرس‌ها را برای ISP ساده می‌کند و از دید کاربر معمولاً شفاف است.",
      "IP استاتیک آدرسی ثابت است که هرگز تغییر نمی‌کند. برای سرورها، دوربین‌های مداربسته، دسترسی از راه دور به شبکه اداری و سرویس‌هایی که نیاز به اعتماد پایدار دارند ضروری است. البته این ثبات یک‌رونه نیست: IP ثابت شما همیشه قابل پیش‌بینی است که از دید امنیتی می‌تواند نقطه ضعف باشد.",
      "برای اکثر کاربران، داینامیک کافی و حتی مفید است؛ تغییر دوره‌ای IP کمی از ردیابی ساده می‌کاهد. اگر سرویس میزبانی می‌کنید یا از راه دور به سیستم متصل می‌شوید، استاتیک یا استفاده از DDNS (نگاشت دامنه به IP متغیر) را در نظر بگیرید.",
      "برای فهمیدن نوع IP خود می‌توانید این صفحه را در طول چند روز چک کنید؛ اگر آدرس تغییر کرد یعنی داینامیک دارید. توجه کنید که با restart مودم هم معمولاً IP جدیدی می‌گیرید.",
    ],
    bodyEn: [
      "A dynamic IP is the most common setup for home users; the ISP assigns a temporary address to your modem via DHCP and changes it periodically (daily to weekly). This simplifies address management for the ISP and is usually invisible to the user.",
      "A static IP never changes. It is essential for servers, security cameras, remote access to office networks and any service requiring stable trust. The flip side: a fixed address is always predictable, which can be a security consideration.",
      "For most people, dynamic is enough and even slightly beneficial — periodic changes reduce simple tracking. If you host services or connect remotely, consider static IP or DDNS (mapping a domain to your changing IP).",
      "To find out which one you have, check this page over several days; if the address changes, yours is dynamic. Restarting your modem usually fetches a new IP too.",
    ],
  },
  {
    id: "proxy-vpn-detection",
    titleFa: "تشخیص Proxy و VPN چگونه انجام می‌شود؟",
    titleEn: "How Are Proxies and VPNs Detected?",
    bodyFa: [
      "سایت‌ها با ترکیبی از سیگنال‌ها پروکسی و VPN را تشخیص می‌دهند. اولین سیگنال، رنج IP است: اگر آدرس شما به مرکز داده معروفی مثل OVH یا M247 تعلق داشته باشد (به جای رنج‌های خانگی ISPها)، احتمال پروکسی/VPN بالا می‌رود. پایگاه‌های داده‌ای این رنج‌ها را با نشان «hosting» علامت‌گذاری می‌کنند.",
      "سیگنال دوم رفتاری است: اختلاف بزرگ بین منطقه زمانی مرورگر و موقعیت IP، پرش‌های مکرر IP در بازه کوتاه، یا هم‌زمانی چند کاربر از یک IP مشترک. برخی سرویس‌ها همچنین پورت‌های باز رایج پروکسی‌ها را اسکن می‌کنند.",
      "فناوری‌های پیشرفته‌تر اثرانگشت مرورگر و تحلیل ترافیک رمزنگاری‌شده (بدون شکستن رمز) را هم به کار می‌گیرند. به همین دلیل است که بعضی VPNها با وجود IP مرکزداده باز هم شناخته نمی‌شوند؛ سرورهای «residential» آن‌ها از رنج‌های خانگی واقعی استفاده می‌کنند.",
      "در تب امنیت این صفحه، وضعیت پروکسی/مرکزداده، امتیاز ریسک و بررسی Blacklist برای IP شما نمایش داده می‌شود؛ این داده‌ها از چند منبع مستقل تجمیع می‌شوند تا تصویر دقیق‌تری از اعتبار IP شما ارائه شود.",
    ],
    bodyEn: [
      "Websites detect proxies and VPNs using a mix of signals. The first is the IP range: if your address belongs to a known datacenter like OVH or M247 instead of residential ISP ranges, the likelihood of a proxy/VPN rises. Databases flag these ranges as 'hosting'.",
      "The second signal is behavioral: a large mismatch between your browser timezone and the IP's location, frequent IP jumps in a short window, or many users sharing one address. Some services also scan common open proxy ports.",
      "More advanced techniques include browser fingerprinting and encrypted traffic analysis (without decryption). That's why some VPNs stay undetected despite using datacenter IPs; their 'residential' servers run on genuine home ranges.",
      "The Security tab on this page shows proxy/datacenter status, a risk score and blacklist checks for your IP, aggregated from multiple independent sources for a more accurate reputation picture.",
    ],
  },
  {
    id: "ip-security-privacy",
    titleFa: "امنیت IP و حریم خصوصی: چه چیزهایی باید بدانید؟",
    titleEn: "IP Security and Privacy: What You Should Know",
    bodyFa: [
      "نخست واقعیت مهم: IP عمومی به‌تنهایی اطلاعات حساسی درباره شما افشا نمی‌کند. بیشترین چیزی که از روی IP قابل تشخیص است، کشور/شهر تقریبی و نام ISP شماست؛ نه نام، شماره تلفن یا آدرس منزل. ادعای سایت‌هایی که «آدرس دقیق شما را از IP پیدا می‌کنند» تبلیغاتی بیش نیست.",
      "اما IP در ترکیب با داده‌های دیگر می‌تواند برای ردیابی استفاده شود: تبلیغات‌کنندگان IP را با کوکی‌ها و اثرانگشت مرورگر ترکیب می‌کنند تا پروفایل بسازند. حملات DDoS مستقیماً IP شما را هدف می‌گیرند و حملات هکرها به IP در صورت داشتن پورت‌های باز خطرناک می‌شوند.",
      "برای محافظت: فایروال روتر را فعال نگه دارید، پورت‌های غیرضروری را نبندید... به‌عبارت دقیق‌تر، پورت‌های باز غیرضروری را ببندید، سرویس‌های خودمیزبان را پشت VPN یا reverse proxy قرار دهید و برای حریم خصوصی روزمره از DNS رمزنگاری‌شده (DoH/DoT) استفاده کنید تا استعلام‌های شما قابل ردیابی نباشند.",
      "اگر IP شما در Blacklist قرار گرفت (مثلاً به دلیل فعالیت مخرب قبلی مالک آن آدرس)، ممکن است ارسال ایمیل یا دسترسی به بعضی سرویس‌ها مسدود شود. در تب امنیت می‌توانید وضعیت Blacklist خود را در Spamhaus، SpamCop و بقیه لیست‌ها ببینید.",
    ],
    bodyEn: [
      "First, an important fact: your public IP alone does not expose sensitive data. The most it reveals is the approximate country/city and your ISP's name — not your name, phone number or home address. Sites claiming to 'find your exact address from your IP' are marketing hype.",
      "But combined with other data, an IP can be used for tracking: advertisers merge it with cookies and browser fingerprints to build profiles. DDoS attacks target your IP directly, and open ports can invite attackers.",
      "For protection: keep your router firewall on, close unnecessary open ports, place self-hosted services behind a VPN or reverse proxy, and use encrypted DNS (DoH/DoT) so your lookups can't be traced.",
      "If your IP lands on a blacklist (e.g. due to a previous owner's abuse), email delivery or access to some services may be blocked. The Security tab lets you check your status across Spamhaus, SpamCop and other lists.",
    ],
  },
  {
    id: "dns-role",
    titleFa: "DNS چه نقشی در دنیای IP دارد؟",
    titleEn: "What Role Does DNS Play in the World of IP?",
    bodyFa: [
      "DNS یا Domain Name System «دفتر تلفن اینترنت» است: نام‌های قابل‌به‌خاطرسپردن مثل google.com را به آدرسهای عددی IP ترجمه می‌کند. هر بار که سایتی را باز می‌کنید، ابتدا یک استعلام DNS انجام می‌شود و تا پاسخ نرسد، صفحه بارگذاری نمی‌شود.",
      "امنیت DNS اهمیت زیادی دارد. حملات DNS Cache Poisoning می‌توانند شما را به سایت جعلی هدایت کنند؛ DNSSEC با امضای دیجیتال پاسخ‌ها این مشکل را حل می‌کند. نکته حریم خصوصی هم مهم است: استعلام‌های DNS سنتی رمزنگاری نشده‌اند و برای ISP قابل مشاهده‌اند؛ DoH و DoT این استعلام‌ها را رمز می‌کنند.",
      "یک تست DNS Leak بررسی می‌کند که آیا هنگام استفاده از VPN، استعلام‌های DNS شما از کانال امن عبور می‌کنند یا مستقیم به DNS پیش‌فرض ISP می‌روند و نام دامنه‌های بازدیدشده‌تان را لو می‌دهند. VPNهای خوب DNS خودشان را در تونل ارائه می‌کنند.",
      "در همین صفحه نیز برای یافتن رکوردهای PTR و بررسی Blacklist از DNS-over-HTTPS استفاده می‌کنیم؛ روشی رمزنگاری‌شده که بدون نیاز به ابزار جانبی، استعلام‌های DNS استاندارد را از مرز امن عبور می‌دهد.",
    ],
    bodyEn: [
      "DNS, the Domain Name System, is the internet's phone book: it translates memorable names like google.com into numeric IP addresses. Every site visit begins with a DNS query, and the page won't load until the answer arrives.",
      "DNS security matters. Cache poisoning attacks can redirect you to fake sites; DNSSEC fixes this with digital signatures. Privacy matters too: traditional DNS queries are unencrypted and visible to your ISP; DoH and DoT encrypt them.",
      "A DNS leak test checks whether, while using a VPN, your queries travel through the secure tunnel or leak straight to your ISP's default DNS, revealing the domains you visit. Good VPNs provide their own DNS inside the tunnel.",
      "This very page uses DNS-over-HTTPS to fetch PTR records and run blacklist checks — an encrypted method that passes standard DNS queries through a secure channel without extra tooling.",
    ],
  },
  {
    id: "blacklist-removal",
    titleFa: "IP بلاک‌شده را چگونه از Blacklist خارج کنیم؟",
    titleEn: "How to Remove a Blacklisted IP from Blocklists?",
    bodyFa: [
      "وقتی IP شما در Blacklist قرار می‌گیرد، پیامدهای عملی دارد: ایمیل‌های شما به اسپم می‌روند، بعضی سایت‌ها دسترسی را می‌بندند و CAPTCHAهای بیشتری می‌بینید. دلیل رایج آن، فعالیت مشکوک قبلیِ همان آدرس است — شاید توسط مالک قبلی یا دستگاه آلوده‌ای در شبکه شما.",
      "قدم اول تشخیص است: در تب امنیت همین صفحه ببینید در کدام لیست‌ها (Spamhaus، SpamCop، Barracuda و…) ثبت شده‌اید. سپس دلیل را ریشه‌یابی کنید: بدافزار روی دستگاه‌ها؟ سرور ایمیل ناامن (open relay)؟ ارسال انبوه ناخواسته؟",
      "برای رفع، ابتدا مشکل ریشه‌ای را حل کنید و هرگز مستقیم به دنبال حذف از لیست نروید؛ اکثر DNSBLها پس از رفع مشکل و سپری شدن دوره، آدرس را خودکار حذف می‌کنند. برای برخی مثل Spamhaus می‌توانید فرم delist را با توضیح اقدامات اصلاحی پر کنید.",
      "اگر IP شما داینامیک است، ساده‌ترین راه restart مودم و گرفتن IP جدید است. برای IP استاتیک سازمانی، بهتر است از سیاست‌های ایمیل امن (SPF، DKIM، DMARC) و لیست‌های پاک نشسته استفاده کنید تا مشکل تکرار نشود.",
    ],
    bodyEn: [
      "Being blacklisted has practical consequences: your emails go to spam, some sites block access, and you see more CAPTCHAs. The usual cause is prior suspicious activity from that address — perhaps a previous owner or an infected device on your network.",
      "Step one is detection: check the Security tab of this page to see which lists (Spamhaus, SpamCop, Barracuda, etc.) you're on. Then find the root cause: malware on devices? An open mail relay? Unintended bulk sending?",
      "For removal, fix the underlying problem first — most DNSBLs auto-delisting after the issue is resolved and a cooldown passes. Some, like Spamhaus, offer a delisting form where you describe the corrective actions.",
      "If your IP is dynamic, simply restarting your modem may fetch a fresh address. For static business IPs, adopt safe email practices (SPF, DKIM, DMARC) to prevent recurrence.",
    ],
  },
  {
    id: "public-private",
    titleFa: "تفاوت IP عمومی (Public) و خصوصی (Private) چیست؟",
    titleEn: "Public vs Private IP: What's the Difference?",
    bodyFa: [
      "IP خصوصی فقط در شبکه داخلی (خانه، اداره) معنا دارد و در اینترنت قابل مسیریابی نیست. رنج‌های استاندارد آن عبارت‌اند از 10.x.x.x، 172.16.x.x تا 172.31.x.x و 192.168.x.x. روتر شما به هر دستگاه داخل خانه یک IP خصوصی می‌دهد و خودش با NAT آن‌ها را به یک IP عمومی ترجمه می‌کند.",
      "IP عمومی در سراسر اینترنت یکتا و قابل مسیریابی است و توسط ISP به شما اختصاص می‌یابد. سایتهایی که «IP شما را نشان می‌دهند» همیشه IP عمومی را نمایش می‌دهند، چون همان تنها چیزی است که از بیرون دیده می‌شود.",
      "این تمایز برای دیباگ مهم است: وقتی نمی‌توانید از بیرون به دوربین یا سرور خانگی وصل شوید، دلیلش همین NAT است. راه‌حل‌ها شامل Port Forwarding، UPnP یا تونل‌های امن مثل WireGuard و reverse proxy است.",
      "در همین صفحه، بخش «طبقه‌بندی» نشان می‌دهد آیا آدرس استعلام‌شده خصوصی، loopback، link-local یا reserved است. آدرس‌های 127.0.0.1 (loopback) و 169.254.x.x (link-local) نیز حالت‌های خاص با کاربرد فنی هستند.",
    ],
    bodyEn: [
      "A private IP only makes sense inside a local network (home, office) and is not routable on the internet. Standard ranges are 10.x.x.x, 172.16.x.x–172.31.x.x and 192.168.x.x. Your router assigns private IPs to devices and translates them to one public IP via NAT.",
      "A public IP is globally unique and routable, assigned by your ISP. Sites that 'show your IP' always display the public one, because that's all the outside world can see.",
      "This distinction matters for debugging: when you can't reach your home camera or server from outside, NAT is the reason. Solutions include port forwarding, UPnP, or secure tunnels like WireGuard and reverse proxies.",
      "On this page, the classification section shows whether a queried address is private, loopback, link-local or reserved. 127.0.0.1 (loopback) and 169.254.x.x (link-local) are special-purpose technical ranges.",
    ],
  },
];

export interface FaqItem {
  qFa: string;
  aFa: string;
  qEn: string;
  aEn: string;
}

export const FAQS: FaqItem[] = [
  {
    qFa: "آی پی من چطور پیدا می‌شود؟",
    aFa: "وقتی این صفحه را باز می‌کنید، مرورگر شما درخواستی به سرور ما می‌فرستد. این درخواست به‌طور ذاتی شامل IP مبدأ (آدرس اینترنت شما) است و سرور فقط همان را نمایش می‌دهد؛ هیچ اسکن یا نرم‌افزار خاصی روی دستگاه شما اجرا نمی‌شود.",
    qEn: "How is my IP address detected?",
    aEn: "When you open this page, your browser sends a request to our server. The request inherently contains the source IP (your internet address) and the server simply displays it back — no scanning or special software runs on your device.",
  },
  {
    qFa: "آیا استفاده از این ابزار رایگان است؟",
    aFa: "بله، کاملاً رایگان است و همیشه رایگان می‌ماند. ما هیچ اشتراک پرداختی، محدودیت تعداد استعلام یا تبلیغات مزاحم نداریم. پروژه متن‌باز است و کد آن آزادانه در GitHub در دسترس قرار دارد.",
    qEn: "Is this tool free to use?",
    aEn: "Yes, completely free and it always will be. There are no paid plans, no lookup limits and no intrusive ads. The project is open source and the code is freely available on GitHub.",
  },
  {
    qFa: "آیا اطلاعات من ذخیره می‌شود؟",
    aFa: "خیر. ما هیچ لاگی از استعلام‌ها نگه نمی‌داریم. نمایش داده‌ها فقط برای جلسه فعلی شماست و تاریخچه IP صرفاً در localStorage مرورگر خودتان (بدون ارسال به سرور) ذخیره می‌شود.",
    qEn: "Is my data stored?",
    aEn: "No. We keep no lookup logs. Data is displayed only for your current session, and your IP history is stored solely in your own browser's localStorage — never sent to a server.",
  },
  {
    qFa: "چطور IP خودم را تغییر دهم؟",
    aFa: "برای IP داینامیک، کافی است مودم/روتر را خاموش و روشن کنید یا اتصال اینترنت را قطع و وصل کنید تا IP جدیدی از ISP بگیرید. برای مخفی کردن IP بدون تغییر آن، از VPN یا پروکسی استفاده کنید. تغییر واقعی و دائمی IP نیاز به درخواست IP استاتیک جدید از ISP دارد.",
    qEn: "How can I change my IP address?",
    aEn: "For a dynamic IP, simply power-cycle your modem/router or reconnect — your ISP will assign a fresh address. To hide your IP without changing it, use a VPN or proxy. A permanent change requires requesting a new static IP from your ISP.",
  },
  {
    qFa: "تفاوت IP عمومی و خصوصی چیست؟",
    aFa: "IP عمومی در کل اینترنت یکتاست و توسط ISP به اتصال شما اختصاص می‌یابد؛ سایتها آن را می‌بینند. IP خصوصی فقط داخل شبکه محلی (مثل 192.168.x.x) معتبر است و روتر با NAT چندین دستگاه را پشت یک IP عمومی مشترک قرار می‌دهد.",
    qEn: "What's the difference between a public and a private IP?",
    aEn: "A public IP is globally unique and assigned by your ISP — websites see it. A private IP is only valid inside a local network (e.g. 192.168.x.x); your router uses NAT to place multiple devices behind one shared public IP.",
  },
  {
    qFa: "چرا موقعیت IP من اشتباه نمایش داده می‌شود؟",
    aFa: "Geolocation بر اساس پایگاه داده رنج‌های IP تخمینی است و معمولاً به مرکز ISP اشاره می‌کند نه موقعیت دقیق شما. اگر از VPN، پروکسی یا CGNAT استفاده می‌کنید، خطا بیشتر می‌شود. این موضوع طبیعی است و ربطی به GPS یا دقت دستگاه شما ندارد.",
    qEn: "Why is my IP location shown incorrectly?",
    aEn: "Geolocation is an estimate based on IP range databases and usually points to an ISP hub, not your exact spot. VPNs, proxies or CGNAT increase the error. This is normal and unrelated to your device's GPS.",
  },
  {
    qFa: "آیا می‌توانم اطلاعات IP دستگاه دیگری را استعلام کنم؟",
    aFa: "بله. کافی است آدرس IP موردنظر را در نوار جستجوی بالای صفحه وارد کنید؛ اطلاعات جغرافیایی، شبکه و امنیتی آن آدرس از چندین منبع رایگان تجمیع و نمایش داده می‌شود.",
    qEn: "Can I look up the details of someone else's IP?",
    aEn: "Yes. Just type the IP address into the search bar at the top of the page; geographic, network and security information for that address will be aggregated from several free sources.",
  },
];
