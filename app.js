const state = {
  db: null,
  products: [],
  lang: localStorage.getItem("nextpair-lang") || "en",
  renderedLang: "",
  adminToken: sessionStorage.getItem("nextpair-admin-token") || "",
  wishlist: new Set(JSON.parse(localStorage.getItem("nextpair-wishlist") || "[]"))
};

const t = {
  en: {
    navHome: "Home", navTrending: "Trending", navCondition: "Condition Guide", navSize: "Size Guide", navSaved: "Saved", navOrder: "How to Order", navContact: "Contact",
    heroEyebrow: "Cambodia-first used sneaker marketplace",
    heroTitle: "Authentic second-hand sneakers, ready for their next owner.",
    heroText: "Shop imported used pairs with clear condition, size, actual photos when available, and simple DM ordering in Cambodia.",
    shopTrending: "Shop trending pairs", dmToOrder: "DM to order",
    trustCondition: "Clear condition", trustPhotos: "Real photos", trustLocal: "Local ordering first",
    internationalTitle: "International Orders Coming Soon",
    internationalText: "For now, NextPair KH focuses on Cambodia orders only. International customers can follow us for future updates.",
    trendingEyebrow: "Trending used sneakers", trendingTitle: "Jordan 3 to 11 and other high-demand pairs",
    trendingText: "Used prices are guided by condition, demand, rarity, market value, and current stock.",
    searchLabel: "Search", categoryLabel: "Category", conditionLabel: "Condition",
    conditionEyebrow: "Sneaker condition guide", conditionTitle: "Know the pair before you pay.",
    conditionText: "Every used pair is listed with a simple condition label and clear notes. Ask for more photos before confirming your order.",
    likeNew: "Very light wear, clean shape, best condition.", good: "Normal used wear, still clean and easy to wear.",
    fair: "Visible wear, better price, still usable.", worn: "Heavy wear, budget pair, check photos carefully.",
    sizeEyebrow: "Size guide", sizeTitle: "Simple fit help before ordering", wideFeet: "Wide feet?", wideAdvice: "Ask us before ordering. Some Jordan models fit snug.",
    orderEyebrow: "How to order", orderTitle: "Simple. Clear. NextPair.",
    step1Title: "DM us", step1Text: "Send the pair you want.", step2Title: "Check details", step2Text: "Confirm size, condition, price, and extra photos.",
    step3Title: "Confirm order", step3Text: "We confirm availability and payment.", step4Title: "Receive your pair", step4Text: "Delivery or meet-up in Cambodia.",
    whyEyebrow: "Why choose NextPair", whyTitle: "Built for sneaker buyers in Cambodia",
    usp1: "Cambodia-first used sneaker marketplace", usp2: "Affordable second-hand sneakers", usp3: "Clear condition details",
    usp4: "Actual photos of available pairs when possible", usp5: "Easy ordering through Instagram, Facebook, and Telegram",
    usp6: "Fair and clear pricing", usp7: "Curated trending sneaker picks", usp8: "Simple size help",
    usp9: "Fast and friendly support", usp10: "Easy communication in English, Khmer, and Chinese",
    contactEyebrow: "Contact", contactTitle: "Ready to claim your next pair?",
    contactText: "Message us with the product name, size, and any questions. We will confirm stock before payment.",
    footerText: "Authentic second-hand sneakers. Phnom Penh, Cambodia.", footerInternational: "International Orders Coming Soon",
    allCategories: "All categories", allConditions: "All conditions", market: "Market", nextpairPrice: "NextPair", details: "Details", order: "Order", share: "Share", copyLink: "Copy link", copied: "Copied",
    size: "Size", stock: "Stock", condition: "Condition", conditionNotes: "Condition notes", authenticity: "Authenticity notes", fit: "Fit advice",
    priceNote: "Price note", save: "Save", saved: "Saved", savedEyebrow: "Saved shoes", savedTitle: "Your saved NextPair list",
    savedText: "Tap save on any sneaker and it will appear here for easy checking later.", savedEmpty: "No saved shoes yet. Tap the heart on a pair you like.",
    noProducts: "No pairs match your search yet."
  },
  km: {
    navHome: "ទំព័រដើម", navTrending: "កំពុងពេញនិយម", navCondition: "ស្ថានភាពស្បែកជើង", navSize: "ទំហំ", navSaved: "បានរក្សាទុក", navOrder: "របៀបកម្ម៉ង់", navContact: "ទំនាក់ទំនង",
    heroEyebrow: "ទីផ្សារស្បែកជើងមួយទឹក សម្រាប់កម្ពុជា",
    heroTitle: "ស្បែកជើងមួយទឹកពិត សម្រាប់ម្ចាស់បន្ទាប់។",
    heroText: "ទិញស្បែកជើងមួយទឹកនាំចូល មានស្ថានភាព ទំហំ រូបពិតពេលមាន និងកម្ម៉ង់តាម DM ងាយស្រួលក្នុងកម្ពុជា។",
    shopTrending: "មើលស្បែកជើងកំពុងពេញនិយម", dmToOrder: "DM ដើម្បីកម្ម៉ង់",
    trustCondition: "ស្ថានភាពច្បាស់", trustPhotos: "រូបពិត", trustLocal: "កម្ម៉ង់ក្នុងស្រុកមុន",
    internationalTitle: "កម្ម៉ង់អន្តរជាតិ នឹងមកដល់ឆាប់ៗ",
    internationalText: "ពេលនេះ NextPair KH ផ្តោតលើការកម្ម៉ង់ក្នុងកម្ពុជាមុន។ អតិថិជនអន្តរជាតិអាចតាមដានព័ត៍មានថ្មីៗ។",
    trendingEyebrow: "ស្បែកជើងមួយទឹកកំពុងពេញនិយម", trendingTitle: "Jordan 3 ដល់ 11 និងម៉ូដែលមានតម្រូវការខ្ពស់",
    trendingText: "តម្លៃមួយទឹកគិតតាមស្ថានភាព តម្រូវការ ភាពកម្រ តម្លៃទីផ្សារ និងស្តុកបច្ចុប្បន្ន។",
    searchLabel: "ស្វែងរក", categoryLabel: "ប្រភេទ", conditionLabel: "ស្ថានភាព",
    conditionEyebrow: "ការណែនាំស្ថានភាព", conditionTitle: "ដឹងស្បែកជើងមុនពេលបង់ប្រាក់។",
    conditionText: "រាល់ស្បែកជើងមួយទឹកមានស្លាកស្ថានភាព និងកំណត់ចំណាំច្បាស់។ អាចសុំរូបបន្ថែមមុនបញ្ជាក់កម្ម៉ង់។",
    likeNew: "ពាក់តិចណាស់ រូបរាងស្អាត ស្ថានភាពល្អបំផុត។", good: "មានស្នាមប្រើធម្មតា តែស្អាត និងពាក់បានងាយ។",
    fair: "មានស្នាមច្បាស់ តម្លៃល្អ និងនៅប្រើបាន។", worn: "ប្រើច្រើន តម្លៃសន្សំ សូមមើលរូបឱ្យច្បាស់។",
    sizeEyebrow: "ការណែនាំទំហំ", sizeTitle: "ជំនួយទំហំងាយៗ មុនកម្ម៉ង់", wideFeet: "ជើងធំទទឹង?", wideAdvice: "សួរយើងមុនកម្ម៉ង់។ Jordan ខ្លះអាចតឹង។",
    orderEyebrow: "របៀបកម្ម៉ង់", orderTitle: "ងាយ។ ច្បាស់។ NextPair។",
    step1Title: "DM មកយើង", step1Text: "ផ្ញើគូដែលអ្នកចង់បាន។", step2Title: "ពិនិត្យលម្អិត", step2Text: "បញ្ជាក់ទំហំ ស្ថានភាព តម្លៃ និងរូបបន្ថែម។",
    step3Title: "បញ្ជាក់កម្ម៉ង់", step3Text: "យើងបញ្ជាក់ស្តុក និងការបង់ប្រាក់។", step4Title: "ទទួលស្បែកជើង", step4Text: "ដឹកជញ្ជូន ឬជួបផ្ទាល់ក្នុងកម្ពុជា។",
    whyEyebrow: "ហេតុអ្វីជ្រើស NextPair", whyTitle: "បង្កើតសម្រាប់អ្នកទិញស្បែកជើងនៅកម្ពុជា",
    usp1: "ទីផ្សារស្បែកជើងមួយទឹកសម្រាប់កម្ពុជាមុន", usp2: "ស្បែកជើងមួយទឹកតម្លៃសមរម្យ", usp3: "ព័ត៌មានស្ថានភាពច្បាស់",
    usp4: "មានរូបពិតរបស់គូដែលមានស្តុកពេលអាចធ្វើបាន", usp5: "កម្ម៉ង់ងាយតាម Instagram, Facebook និង Telegram",
    usp6: "តម្លៃស្មោះត្រង់ និងច្បាស់", usp7: "ជ្រើសម៉ូដែលកំពុងពេញនិយម", usp8: "ជំនួយទំហំងាយយល់",
    usp9: "សេវាកម្មរហ័ស និងរួសរាយ", usp10: "ទំនាក់ទំនងជា អង់គ្លេស ខ្មែរ និងចិន",
    contactEyebrow: "ទំនាក់ទំនង", contactTitle: "ចង់យកគូបន្ទាប់របស់អ្នកហើយឬនៅ?",
    contactText: "ផ្ញើឈ្មោះស្បែកជើង ទំហំ និងសំណួរ។ យើងនឹងបញ្ជាក់ស្តុកមុនបង់ប្រាក់។",
    footerText: "ស្បែកជើងមួយទឹកពិត។ ភ្នំពេញ កម្ពុជា។", footerInternational: "កម្ម៉ង់អន្តរជាតិ នឹងមកដល់ឆាប់ៗ",
    allCategories: "ប្រភេទទាំងអស់", allConditions: "ស្ថានភាពទាំងអស់", market: "ទីផ្សារ", nextpairPrice: "តម្លៃ NextPair", details: "លម្អិត", order: "កម្ម៉ង់", share: "ចែករំលែក", copyLink: "ចម្លងលីង", copied: "បានចម្លង",
    size: "ទំហំ", stock: "ស្តុក", condition: "ស្ថានភាព", conditionNotes: "កំណត់ចំណាំស្ថានភាព", authenticity: "កំណត់ចំណាំភាពពិត", fit: "ណែនាំការពាក់",
    priceNote: "កំណត់ចំណាំតម្លៃ", save: "រក្សាទុក", saved: "បានរក្សាទុក", savedEyebrow: "ស្បែកជើងបានរក្សាទុក", savedTitle: "បញ្ជី NextPair ដែលអ្នករក្សាទុក",
    savedText: "ចុចរក្សាទុកលើស្បែកជើងណាមួយ ហើយវានឹងបង្ហាញនៅទីនេះសម្រាប់មើលពេលក្រោយ។", savedEmpty: "មិនទាន់មានស្បែកជើងបានរក្សាទុកទេ។ ចុចបេះដូងលើគូដែលអ្នកចូលចិត្ត។",
    noProducts: "មិនទាន់មានគូត្រូវនឹងការស្វែងរក។"
  },
  zh: {
    navHome: "首页", navTrending: "热门", navCondition: "成色说明", navSize: "尺码", navSaved: "收藏", navOrder: "下单方式", navContact: "联系",
    heroEyebrow: "柬埔寨优先的二手球鞋平台",
    heroTitle: "正品二手球鞋，等待下一位主人。",
    heroText: "购买进口二手球鞋，清楚查看成色、尺码、实物照片，并可在柬埔寨通过私信下单。",
    shopTrending: "查看热门鞋款", dmToOrder: "私信下单",
    trustCondition: "成色清楚", trustPhotos: "实物照片", trustLocal: "本地下单优先",
    internationalTitle: "国际订单即将开放",
    internationalText: "目前 NextPair KH 只服务柬埔寨本地订单。国际客户可以先关注我们获取更新。",
    trendingEyebrow: "热门二手球鞋", trendingTitle: "Jordan 3 到 11 及高需求鞋款",
    trendingText: "二手价格会按成色、需求、稀有度、市场价和库存调整。",
    searchLabel: "搜索", categoryLabel: "分类", conditionLabel: "成色",
    conditionEyebrow: "球鞋成色说明", conditionTitle: "付款前先了解这双鞋。",
    conditionText: "每双二手鞋都有简单成色标签和清楚说明。确认订单前可要求更多照片。",
    likeNew: "轻微使用，鞋型干净，成色最好。", good: "正常使用痕迹，仍然干净好穿。",
    fair: "可见使用痕迹，价格更好，仍可穿。", worn: "使用较多，预算选择，请仔细看照片。",
    sizeEyebrow: "尺码说明", sizeTitle: "下单前的简单尺码帮助", wideFeet: "脚宽？", wideAdvice: "下单前请先问我们。有些 Jordan 会偏紧。",
    orderEyebrow: "下单方式", orderTitle: "简单。清楚。NextPair。",
    step1Title: "私信我们", step1Text: "发送你想要的鞋款。", step2Title: "确认信息", step2Text: "确认尺码、成色、价格和更多照片。",
    step3Title: "确认订单", step3Text: "我们确认库存和付款。", step4Title: "收到球鞋", step4Text: "柬埔寨本地配送或见面交易。",
    whyEyebrow: "为什么选择 NextPair", whyTitle: "为柬埔寨球鞋买家打造",
    usp1: "柬埔寨优先的二手球鞋平台", usp2: "价格更友好的二手球鞋", usp3: "清楚的成色说明",
    usp4: "尽量提供现货实物照片", usp5: "通过 Instagram、Facebook 和 Telegram 轻松下单",
    usp6: "公平清楚的价格", usp7: "精选热门球鞋", usp8: "简单尺码帮助",
    usp9: "快速友好的客服", usp10: "可用英文、高棉文、中文沟通",
    contactEyebrow: "联系", contactTitle: "准备认领你的下一双鞋？",
    contactText: "发送产品名、尺码和问题。付款前我们会先确认库存。",
    footerText: "正品二手球鞋。柬埔寨金边。", footerInternational: "国际订单即将开放",
    allCategories: "全部分类", allConditions: "全部成色", market: "市场价", nextpairPrice: "NextPair 价", details: "详情", order: "下单", share: "分享", copyLink: "复制链接", copied: "已复制",
    size: "尺码", stock: "库存", condition: "成色", conditionNotes: "成色说明", authenticity: "正品说明", fit: "尺码建议",
    priceNote: "价格说明", save: "收藏", saved: "已收藏", savedEyebrow: "收藏鞋款", savedTitle: "你的 NextPair 收藏清单",
    savedText: "点击任何球鞋的收藏按钮，它会出现在这里，方便之后查看。", savedEmpty: "还没有收藏鞋款。点击喜欢鞋款上的心形按钮。",
    noProducts: "没有符合搜索的鞋款。"
  }
};

const productText = {
  km: {
    categories: {
      "Air Jordan 3": "Air Jordan 3",
      "Air Jordan 4": "Air Jordan 4",
      "Air Jordan 5": "Air Jordan 5",
      "Air Jordan 6": "Air Jordan 6",
      "Air Jordan 7": "Air Jordan 7",
      "Air Jordan 8": "Air Jordan 8",
      "Air Jordan 9": "Air Jordan 9",
      "Air Jordan 10": "Air Jordan 10",
      "Air Jordan 11": "Air Jordan 11",
      "Trending Runner": "ស្បែកជើងរត់កំពុងពេញនិយម",
      "Nike": "Nike",
      "New Balance": "New Balance",
      "Jordans": "Jordans"
    },
    conditions: {
      "Like New": "ដូចថ្មី",
      "Good": "ល្អ",
      "Fair": "មធ្យម",
      "Worn": "ប្រើច្រើន"
    },
    stock: {
      "Available": "មានស្តុក",
      "Low Stock": "ស្តុកតិច",
      "Reserved": "បានកក់",
      "Sold": "លក់អស់"
    },
    badges: {
      "Trending": "កំពុងពេញនិយម",
      "Price Drop": "ចុះតម្លៃ",
      "Hot Pick": "គូពិសេស",
      "2026 Demand": "តម្រូវការ 2026",
      "Value Pick": "តម្លៃល្អ",
      "Clean Pair": "គូស្អាត",
      "Women Size": "ទំហំស្រី",
      "Top Seller": "លក់ដាច់",
      "Budget Heat": "ស្អាតតម្លៃសន្សំ",
      "Everyday Pick": "ពាក់រាល់ថ្ងៃ",
      "Saved Pair": "បានកក់"
    },
    products: {
      "aj3-black-denim": {
        name: "Air Jordan 3 Retro Black Denim",
        conditionNotes: "មានស្នាមតិចលើ midsole និង heel។ ផ្នែកខាងលើនៅស្អាត។",
        authenticity: "គូនាំចូល។ NextPair ពិនិត្យស្លាក ការដេរ រូបរាង និងសម្ភារៈមុនដាក់លក់។",
        fitAdvice: "សមទំហំធម្មតាសម្រាប់អ្នកទិញ Jordan 3 ភាគច្រើន។"
      },
      "aj4-flight-club": {
        name: "Air Jordan 4 Retro Flight Club",
        conditionNotes: "ពាក់តិចណាស់។ outsole ស្អាត និងរូបរាងនៅរឹងមាំ។",
        authenticity: "បានពិនិត្យរូបរាង cage អណ្ដាតស្បែកជើង ស្លាក និងសម្ភារៈ។",
        fitAdvice: "Jordan 4 អាចតឹងបន្តិច។ ជើងទទឹងគួរឡើងកន្លះទំហំ។"
      },
      "aj5-wolf-grey": {
        name: "Air Jordan 5 Retro Wolf Grey",
        conditionNotes: "មាន crease ធម្មតា និង sole លឿងតិច។ នៅល្អសម្រាប់ពាក់រាល់ថ្ងៃ។",
        authenticity: "បានពិនិត្យ netting អណ្ដាត reflective ស្លាក និងរូបរាង។",
        fitAdvice: "សមទំហំធម្មតា។ toe box ទូលាយសម្រាប់អ្នកទិញជាច្រើន។"
      },
      "aj6-reverse-infrared": {
        name: "Air Jordan 6 Reverse Infrared",
        conditionNotes: "មានស្នាមតិចលើ outsole។ ផ្នែកខាងលើ និង lace lock នៅល្អ។",
        authenticity: "បានពិនិត្យ heel tab, lace lock, អណ្ដាត និងលម្អិត outsole។",
        fitAdvice: "សមទំហំធម្មតា។ ផ្នែកមុខជើងទូលាយបន្តិច។"
      },
      "aj7-cardinal": {
        name: "Air Jordan 7 Cardinal",
        conditionNotes: "មាន crease និងស្នាម collar ច្បាស់។ ជាគូ budget ល្អ។",
        authenticity: "បានពិនិត្យលំនាំអណ្ដាត heel tab ការដេរ និងស្លាកខាងក្នុង។",
        fitAdvice: "សមទំហំធម្មតាសម្រាប់អ្នកទិញភាគច្រើន។"
      },
      "aj8-bugs-bunny": {
        name: "Air Jordan 8 Bugs Bunny",
        conditionNotes: "ផ្នែកខាងលើស្អាត មានស្នាម outsole ធម្មតា។ straps នៅរឹងមាំ។",
        authenticity: "បានពិនិត្យ straps, logo chenille, អណ្ដាត និងស្លាក។",
        fitAdvice: "មាន padding ច្រើន។ សមទំហំធម្មតា ឬឡើងកន្លះទំហំសម្រាប់ជើងទទឹង។"
      },
      "aj9-powder-blue": {
        name: "Air Jordan 9 Powder Blue",
        conditionNotes: "ផ្នែកខាងលើស្អាតខ្លាំង។ មានស្នាម outsole តិចប៉ុណ្ណោះ។",
        authenticity: "បានពិនិត្យ globe heel អណ្ដាត លម្អិត outsole និងស្លាក។",
        fitAdvice: "ជាទូទៅសមទំហំធម្មតា។"
      },
      "aj10-hydrangeas": {
        name: "Air Jordan 10 Hydrangeas",
        conditionNotes: "មាន crease តិច។ អក្សរលើ outsole នៅមើលឃើញច្បាស់។",
        authenticity: "បានពិនិត្យអក្សរលើ outsole collar អណ្ដាត និងស្លាក។",
        fitAdvice: "ទំហំស្រី។ សួរយើងបាន ប្រសិនបើត្រូវការជំនួយបម្លែងទំហំ។"
      },
      "aj11-gamma-blue": {
        name: "Air Jordan 11 Gamma Blue",
        conditionNotes: "Patent leather នៅភ្លឺស្អាត។ icy sole លឿងតិច។",
        authenticity: "បានពិនិត្យ patent cut, carbon plate, jumpman, ស្លាកប្រអប់ និងរូបរាង។",
        fitAdvice: "សមទំហំធម្មតា។ កាន់ជើងល្អជុំវិញកជើង។"
      },
      "asics-gel-1130": {
        name: "ASICS Gel 1130 Black Silver",
        conditionNotes: "ស្បែកជើងរត់ស្រួល មានស្នាម outsole តិច។ ល្អសម្រាប់ពាក់រាល់ថ្ងៃ។",
        authenticity: "បានពិនិត្យ logo, mesh, sole និងស្លាក។",
        fitAdvice: "ពាក់ស្រួលរាល់ថ្ងៃ។ សមទំហំធម្មតាសម្រាប់អ្នកទិញភាគច្រើន។"
      },
      "af1-triple-white": {
        name: "Nike Air Force 1 Triple White",
        conditionNotes: "មានស្នាមពាក់រាល់ថ្ងៃ និង crease។ បានសម្អាតរួច រៀបចំពាក់បាន។",
        authenticity: "បានពិនិត្យ Swoosh ការដេរ sole និងស្លាក។",
        fitAdvice: "Air Force 1 ទូលាយ។ អ្នកទិញជាច្រើនយកតូចជាងកន្លះទំហំ។"
      },
      "nb-9060-black": {
        name: "New Balance 9060 Triple Black",
        conditionNotes: "Suede និង outsole ស្អាត។ ពាក់តិចណាស់។",
        authenticity: "បានពិនិត្យរូបរាង logo, suede, midsole និងស្លាក។",
        fitAdvice: "ស្បែកជើង chunky ពាក់ស្រួល។ សមទំហំធម្មតា។"
      }
    }
  },
  zh: {
    categories: {
      "Air Jordan 3": "Air Jordan 3",
      "Air Jordan 4": "Air Jordan 4",
      "Air Jordan 5": "Air Jordan 5",
      "Air Jordan 6": "Air Jordan 6",
      "Air Jordan 7": "Air Jordan 7",
      "Air Jordan 8": "Air Jordan 8",
      "Air Jordan 9": "Air Jordan 9",
      "Air Jordan 10": "Air Jordan 10",
      "Air Jordan 11": "Air Jordan 11",
      "Trending Runner": "热门跑鞋",
      "Nike": "Nike",
      "New Balance": "New Balance",
      "Jordans": "Jordan 系列"
    },
    conditions: {
      "Like New": "近新",
      "Good": "良好",
      "Fair": "一般",
      "Worn": "使用较多"
    },
    stock: {
      "Available": "有货",
      "Low Stock": "库存少",
      "Reserved": "已预订",
      "Sold": "已售出"
    },
    badges: {
      "Trending": "热门",
      "Price Drop": "降价",
      "Hot Pick": "精选",
      "2026 Demand": "2026 高需求",
      "Value Pick": "高性价比",
      "Clean Pair": "干净好鞋",
      "Women Size": "女码",
      "Top Seller": "热卖",
      "Budget Heat": "预算好鞋",
      "Everyday Pick": "日常推荐",
      "Saved Pair": "已预订"
    },
    products: {
      "aj3-black-denim": {
        name: "Air Jordan 3 Retro 黑色丹宁",
        conditionNotes: "中底有轻微痕迹，后跟有轻微磨损。鞋面仍然干净。",
        authenticity: "进口鞋款。NextPair 上架前已检查标签、走线、鞋型和材质。",
        fitAdvice: "大多数 Jordan 3 买家可按正常尺码选择。"
      },
      "aj4-flight-club": {
        name: "Air Jordan 4 Retro Flight Club",
        conditionNotes: "使用痕迹很轻。外底干净，鞋型保持很好。",
        authenticity: "已检查鞋型、侧网、鞋舌、标签和材质。",
        fitAdvice: "Jordan 4 可能偏紧。脚宽建议大半码。"
      },
      "aj5-wolf-grey": {
        name: "Air Jordan 5 Retro 狼灰",
        conditionNotes: "正常折痕，鞋底轻微发黄。日常穿着仍然很好。",
        authenticity: "已检查网面、反光鞋舌、标签和鞋型。",
        fitAdvice: "正常尺码。很多买家会觉得前掌空间较舒服。"
      },
      "aj6-reverse-infrared": {
        name: "Air Jordan 6 Reverse Infrared",
        conditionNotes: "外底有小痕迹。鞋面和鞋带扣状态良好。",
        authenticity: "已检查后跟拉环、鞋带扣、鞋舌和外底细节。",
        fitAdvice: "正常尺码。前掌略宽松。"
      },
      "aj7-cardinal": {
        name: "Air Jordan 7 Cardinal",
        conditionNotes: "可见折痕和鞋领磨损。适合预算型买家。",
        authenticity: "已检查鞋舌纹理、后跟、走线和内标。",
        fitAdvice: "大多数买家可按正常尺码选择。"
      },
      "aj8-bugs-bunny": {
        name: "Air Jordan 8 Bugs Bunny",
        conditionNotes: "鞋面干净，外底正常磨损。绑带仍然牢固。",
        authenticity: "已检查绑带、毛绒标、鞋舌和标签。",
        fitAdvice: "填充感较强。正常尺码，脚宽可大半码。"
      },
      "aj9-powder-blue": {
        name: "Air Jordan 9 Powder Blue",
        conditionNotes: "鞋面非常干净。只有轻微外底磨损。",
        authenticity: "已检查后跟地球标、鞋舌、外底细节和标签。",
        fitAdvice: "通常按正常尺码选择。"
      },
      "aj10-hydrangeas": {
        name: "Air Jordan 10 Hydrangeas",
        conditionNotes: "轻微折痕。外底文字仍然清楚。",
        authenticity: "已检查外底文字、鞋领、鞋舌和标签。",
        fitAdvice: "女码。需要男女码转换可以问我们。"
      },
      "aj11-gamma-blue": {
        name: "Air Jordan 11 Gamma Blue",
        conditionNotes: "漆皮光泽保持好。水晶底有轻微发黄。",
        authenticity: "已检查漆皮高度、碳板、Jumpman、盒标和鞋型。",
        fitAdvice: "正常尺码。脚踝包裹感较稳。"
      },
      "asics-gel-1130": {
        name: "ASICS Gel 1130 黑银",
        conditionNotes: "舒适跑鞋，外底轻微磨损。适合日常穿。",
        authenticity: "已检查 logo、网面、鞋底和标签。",
        fitAdvice: "日常穿着舒服。大多数买家可按正常尺码选择。"
      },
      "af1-triple-white": {
        name: "Nike Air Force 1 纯白",
        conditionNotes: "有日常穿着痕迹和折痕。已清洁，可直接穿。",
        authenticity: "已检查 Swoosh、走线、鞋底和标签。",
        fitAdvice: "Air Force 1 偏宽松。很多买家会小半码。"
      },
      "nb-9060-black": {
        name: "New Balance 9060 全黑",
        conditionNotes: "麂皮和外底干净。磨损很少。",
        authenticity: "已检查 logo 形状、麂皮、中底和标签。",
        fitAdvice: "厚底舒适脚感。正常尺码。"
      }
    }
  }
};

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const money = product => `${product.currency || "USD"} $${Number(product.usedPrice || 0).toLocaleString()}`;
const marketMoney = product => `${product.currency || "USD"} $${Number(product.originalPrice || 0).toLocaleString()}`;
const copy = key => t[state.lang][key] || t.en[key] || key;
const localMap = group => productText[state.lang]?.[group] || {};
const localProduct = product => productText[state.lang]?.products?.[product.id] || {};
const productName = product => localProduct(product).name || product.name;
const productField = (product, field) => localProduct(product)[field] || product[field] || "";
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
const isRealValue = value => Boolean(value) && String(value).toLowerCase() !== "undefined";
const localCategory = category => localMap("categories")[category] || (isRealValue(category) ? category : copy("categoryLabel"));
const localCondition = condition => localMap("conditions")[condition] || (isRealValue(condition) ? condition : copy("condition"));
const localStock = stock => localMap("stock")[stock] || (isRealValue(stock) ? stock : copy("stock"));
const localBadge = badge => localMap("badges")[badge] || (isRealValue(badge) ? badge : "");
const fallbackImage = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
    <rect width="1200" height="900" fill="#f7f4ee"/>
    <rect x="60" y="60" width="1080" height="780" fill="#fff" stroke="#111" stroke-width="8"/>
    <text x="600" y="390" text-anchor="middle" font-family="Arial, sans-serif" font-size="130" font-weight="900" fill="#111">NEXTPAIR</text>
    <text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#555">Actual pair photo coming soon</text>
  </svg>
`);
const priceNote = () => ({
  en: state.db.settings.priceNote,
  km: "តម្លៃមួយទឹកអាចផ្លាស់ប្តូរតាមស្តុក ស្ថានភាព តម្រូវការ ភាពកម្រ និងតម្លៃទីផ្សារ។",
  zh: "二手价格可能会根据库存、成色、需求、稀有度和市场价调整。"
})[state.lang] || state.db.settings.priceNote;

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(state.adminToken ? { "Authorization": `Bearer ${state.adminToken}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });
  if (!response.ok) throw new Error((await response.json()).error || "Request failed");
  return response.json();
}

function isAdminUnlocked() {
  return Boolean(state.adminToken);
}

function renderAdminGate() {
  const login = $("#adminLogin");
  const content = $("#adminContent");
  if (!login || !content) return;
  const unlocked = isAdminUnlocked();
  login.hidden = unlocked;
  content.hidden = !unlocked;
}

async function unlockAdmin(event) {
  event.preventDefault();
  const password = $("#adminPassword").value.trim();
  if (!password) return;
  try {
    const session = await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password })
    });
    state.adminToken = session.token;
    sessionStorage.setItem("nextpair-admin-token", session.token);
    $("#adminPassword").value = "";
    renderAdminGate();
    renderAdminList();
  } catch (error) {
    alert(error.message);
    lockAdmin(false);
  }
}

async function lockAdmin(callServer = true) {
  if (callServer && state.adminToken) {
    try { await api("/api/admin/logout", { method: "POST" }); } catch {}
  }
  state.adminToken = "";
  sessionStorage.removeItem("nextpair-admin-token");
  renderAdminGate();
  resetForm();
}

async function validateAdminSession() {
  if (!state.adminToken) return;
  try {
    const status = await api("/api/admin/status");
    if (!status.ok) lockAdmin(false);
  } catch {
    lockAdmin(false);
  }
}

function setLanguage(lang) {
  if (state.renderedLang === lang) return;
  state.lang = lang;
  state.renderedLang = lang;
  localStorage.setItem("nextpair-lang", lang);
  document.documentElement.lang = lang === "km" ? "km" : lang === "zh" ? "zh" : "en";
  $$("[data-i18n]").forEach(node => {
    node.textContent = copy(node.dataset.i18n);
  });
  $$(".language-switch button").forEach(button => button.classList.toggle("active", button.dataset.lang === lang));
  populateFilters();
  renderProducts();
  renderContact();
}

function preloadProductImages() {
  state.products.forEach(product => {
    (product.images || []).forEach(src => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    });
  });
}

function badgeClass(label) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function stockClass(stock) {
  return String(stock || "").toLowerCase().replace(/\s+/g, "-");
}

function productCard(product) {
  const saved = state.wishlist.has(product.id);
  const badges = (product.badges || []).map(badge => `<span class="badge ${badgeClass(badge)}">${esc(localBadge(badge))}</span>`).join("");
  const name = productName(product);
  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${esc(product.images?.[0] || fallbackImage)}" alt="${esc(name)}" loading="eager" decoding="async" />
        <div class="badges">${badges}</div>
        <button class="save-button ${saved ? "saved" : ""}" data-save="${esc(product.id)}" aria-label="${saved ? copy("saved") : copy("save")}">♡</button>
      </div>
      <div class="product-body">
        <h3 class="product-title">${esc(name)}</h3>
        <div class="meta-row"><span>${esc(localCategory(product.category))}</span><strong>${esc(product.size)}</strong></div>
        <div class="meta-row"><span>${esc(localCondition(product.condition))} · ${esc(product.conditionScore || "")}</span><span class="stock ${stockClass(product.stock)}">${esc(localStock(product.stock))}</span></div>
        <div class="price-row">
          <div><span class="market-price">${marketMoney(product)}</span><br><span>${copy("market")}</span></div>
          <div class="used-price">${money(product)}</div>
        </div>
        <div class="card-actions">
          <button class="button ghost" data-details="${esc(product.id)}">${copy("details")}</button>
          <a class="button primary" href="${orderLink(product)}" target="_blank" rel="noreferrer">${copy("order")}</a>
          <button class="button ghost share-action" data-share="${esc(product.id)}">${copy("copyLink")}</button>
        </div>
      </div>
    </article>
  `;
}

function productShareUrl(productOrId) {
  const id = typeof productOrId === "string" ? productOrId : productOrId.id;
  return `${window.location.origin}${window.location.pathname}#product=${encodeURIComponent(id)}`;
}

function orderLink(product) {
  const msg = encodeURIComponent(`Hi NextPair KH, I want to order: ${product.name} (${product.size}). Is it still available?`);
  return `${state.db.settings.telegram}?text=${msg}`;
}

function filteredProducts() {
  const q = $("#searchInput").value.trim().toLowerCase();
  const category = $("#categoryFilter").value;
  const condition = $("#conditionFilter").value;
  return state.products.filter(product => {
    const translated = localProduct(product);
    const text = `${product.name} ${translated.name || ""} ${product.category} ${localCategory(product.category)} ${product.size} ${product.condition} ${localCondition(product.condition)} ${product.stock} ${localStock(product.stock)}`.toLowerCase();
    return (!q || text.includes(q)) && (!category || product.category === category) && (!condition || product.condition === condition);
  });
}

function renderProducts() {
  if (!state.db) return;
  const products = filteredProducts();
  $("#productGrid").innerHTML = products.length ? products.map(productCard).join("") : `<p>${copy("noProducts")}</p>`;
  bindProductActions();
  bindImageFallbacks();
  renderSaved();
}

function renderSaved() {
  if (!state.db || !$("#savedGrid")) return;
  const savedProducts = state.products.filter(product => state.wishlist.has(product.id));
  $("#savedGrid").innerHTML = savedProducts.length ? savedProducts.map(productCard).join("") : `<article class="empty-saved">${copy("savedEmpty")}</article>`;
  bindProductActions();
  bindImageFallbacks();
}

function bindProductActions() {
  $$("[data-details]").forEach(button => {
    button.onclick = () => openDetails(button.dataset.details);
  });
  $$("[data-save]").forEach(button => {
    button.onclick = () => toggleSave(button.dataset.save);
  });
  $$("[data-share]").forEach(button => {
    button.onclick = () => copyProductLink(button.dataset.share, button);
  });
}

async function copyProductLink(id, button) {
  const url = productShareUrl(id);
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const input = document.createElement("input");
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  const original = button.textContent;
  button.textContent = copy("copied");
  button.classList.add("copied");
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("copied");
  }, 1400);
}

function bindImageFallbacks() {
  $$("img").forEach(img => {
    img.onerror = () => {
      img.onerror = null;
      img.src = fallbackImage;
    };
  });
}

function scrollToCurrentHash() {
  const id = window.location.hash.slice(1);
  if (!id) return;
  if (id.startsWith("product=")) {
    openSharedProduct();
    return;
  }
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ block: "start" });
}

function openSharedProduct() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const id = params.get("product");
  if (!id || !state.products.length) return;
  const product = state.products.find(item => item.id === id);
  if (!product) return;
  $("#trending").scrollIntoView({ block: "start" });
  openDetails(id);
}

function openDetails(id) {
  const product = state.products.find(item => item.id === id);
  if (!product) return;
  const name = productName(product);
  $("#drawerContent").innerHTML = `
    <div class="drawer-product">
      <img src="${esc(product.images?.[0] || fallbackImage)}" alt="${esc(name)}" />
      <div class="badges static">${(product.badges || []).map(badge => `<span class="badge ${badgeClass(badge)}">${esc(localBadge(badge))}</span>`).join("")}</div>
      <h3>${esc(name)}</h3>
      <div class="price-row">
        <div><span class="market-price">${marketMoney(product)}</span><br><span>${copy("market")}</span></div>
        <div class="used-price">${money(product)}</div>
      </div>
      <div class="detail-grid">
        <div><span>${copy("condition")}</span><strong>${localCondition(product.condition)} · ${product.conditionScore || ""}</strong></div>
        <div><span>${copy("size")}</span><strong>${product.size}</strong></div>
        <div><span>${copy("stock")}</span><strong class="stock ${stockClass(product.stock)}">${localStock(product.stock)}</strong></div>
        <div><span>${copy("nextpairPrice")}</span><strong>${money(product)}</strong></div>
      </div>
      <div class="notes">
        <article><h4>${copy("conditionNotes")}</h4><p>${esc(productField(product, "conditionNotes"))}</p></article>
        <article><h4>${copy("authenticity")}</h4><p>${esc(productField(product, "authenticity"))}</p></article>
        <article><h4>${copy("fit")}</h4><p>${esc(productField(product, "fitAdvice"))}</p></article>
        <article><h4>${copy("priceNote")}</h4><p>${priceNote()}</p></article>
      </div>
      <div class="hero-actions">
        <a class="button primary" href="${orderLink(product)}" target="_blank" rel="noreferrer">${copy("dmToOrder")}</a>
        <button class="button ghost" data-save="${product.id}">${state.wishlist.has(product.id) ? copy("saved") : copy("save")}</button>
        <button class="button ghost share-action" data-share="${product.id}">${copy("copyLink")}</button>
      </div>
    </div>
  `;
  $("#drawer").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#drawerContent [data-save]").addEventListener("click", () => toggleSave(product.id));
  $("#drawerContent [data-share]").addEventListener("click", event => copyProductLink(product.id, event.currentTarget));
  bindImageFallbacks();
}

function closeDetails() {
  $("#drawer").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
}

function toggleSave(id) {
  state.wishlist.has(id) ? state.wishlist.delete(id) : state.wishlist.add(id);
  localStorage.setItem("nextpair-wishlist", JSON.stringify([...state.wishlist]));
  renderProducts();
  renderSaved();
  if ($("#drawer").classList.contains("open")) openDetails(id);
}

function populateFilters() {
  if (!state.db) return;
  const selectedCategory = $("#categoryFilter").value;
  const selectedCondition = $("#conditionFilter").value;
  const categories = [...new Set(state.products.map(product => product.category).filter(isRealValue))].sort();
  const conditions = [...new Set(state.products.map(product => product.condition).filter(isRealValue))].sort();
  $("#categoryFilter").innerHTML = `<option value="">${copy("allCategories")}</option>${categories.map(category => `<option value="${category}">${localCategory(category)}</option>`).join("")}`;
  $("#conditionFilter").innerHTML = `<option value="">${copy("allConditions")}</option>${conditions.map(condition => `<option value="${condition}">${localCondition(condition)}</option>`).join("")}`;
  $("#categoryFilter").value = categories.includes(selectedCategory) ? selectedCategory : "";
  $("#conditionFilter").value = conditions.includes(selectedCondition) ? selectedCondition : "";
}

function renderContact() {
  const s = state.db.settings;
  $("#contactActions").innerHTML = `
    <a href="${s.instagram}" target="_blank" rel="noreferrer">Instagram</a>
    <a href="${s.facebook}" target="_blank" rel="noreferrer">Facebook</a>
    <a href="${s.telegram}" target="_blank" rel="noreferrer">Telegram</a>
    <a href="tel:+855765385381">Phone / Telegram</a>
    <a href="mailto:${s.email}">Email</a>
    <a href="#international">${copy("footerInternational")}</a>
  `;
}

function renderAdminList() {
  if (!isAdminUnlocked()) {
    $("#adminList").innerHTML = "";
    return;
  }
  $("#adminList").innerHTML = state.products.map(product => `
    <article class="admin-product">
      <img src="${product.images?.[0] || ""}" alt="" />
      <div>
        <strong>${product.name}</strong><br>
        <span>${product.category} · ${product.size} · ${money(product)} · ${product.stock}</span>
      </div>
      <div class="admin-actions">
        <button type="button" data-edit="${product.id}">Edit</button>
        <button type="button" data-delete="${product.id}">Delete</button>
      </div>
    </article>
  `).join("");
  $$("[data-edit]").forEach(button => button.addEventListener("click", () => fillForm(button.dataset.edit)));
  $$("[data-delete]").forEach(button => button.addEventListener("click", () => deleteProduct(button.dataset.delete)));
}

function fillForm(id) {
  const product = state.products.find(item => item.id === id);
  if (!product) return;
  $("#productId").value = product.id;
  $("#name").value = product.name || "";
  $("#category").value = product.category || "";
  $("#originalPrice").value = product.originalPrice || "";
  $("#usedPrice").value = product.usedPrice || "";
  $("#condition").value = product.condition || "Good";
  $("#conditionScore").value = product.conditionScore || "";
  $("#conditionNotes").value = product.conditionNotes || "";
  $("#sizeField").value = product.size || "";
  $("#stock").value = product.stock || "Available";
  $("#badges").value = (product.badges || []).join(", ");
  $("#authenticity").value = product.authenticity || "";
  $("#fitAdvice").value = product.fitAdvice || "";
  $("#images").value = (product.images || []).join("\n");
  location.hash = "admin";
}

function resetForm() {
  $("#productForm").reset();
  $("#productId").value = "";
}

async function fileToUploadedUrl(file) {
  if (!file) return null;
  const dataUrl = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
  const saved = await api("/api/upload", {
    method: "POST",
    body: JSON.stringify({ filename: file.name, dataUrl })
  });
  return saved.url;
}

async function saveProduct(event) {
  event.preventDefault();
  if (!isAdminUnlocked()) return alert("Please unlock admin first.");
  try {
  const uploadUrl = await fileToUploadedUrl($("#imageUpload").files[0]);
  const images = $("#images").value.split("\n").map(line => line.trim()).filter(Boolean);
  if (uploadUrl) images.unshift(uploadUrl);
  const product = {
    name: $("#name").value.trim(),
    category: $("#category").value.trim(),
    originalPrice: Number($("#originalPrice").value),
    usedPrice: Number($("#usedPrice").value),
    currency: "USD",
    condition: $("#condition").value,
    conditionScore: $("#conditionScore").value.trim(),
    conditionNotes: $("#conditionNotes").value.trim(),
    size: $("#sizeField").value.trim(),
    stock: $("#stock").value,
    badges: $("#badges").value.split(",").map(item => item.trim()).filter(Boolean),
    authenticity: $("#authenticity").value.trim(),
    fitAdvice: $("#fitAdvice").value.trim(),
    images
  };
  const id = $("#productId").value;
  if (id) await api(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(product) });
  else await api("/api/products", { method: "POST", body: JSON.stringify(product) });
  resetForm();
  await load();
  } catch (error) {
    alert(error.message);
    if (error.message.includes("session") || error.message.includes("password")) lockAdmin(false);
  }
}

async function deleteProduct(id) {
  if (!isAdminUnlocked()) return alert("Please unlock admin first.");
  if (!confirm("Delete this product?")) return;
  try {
    await api(`/api/products/${id}`, { method: "DELETE" });
    await load();
  } catch (error) {
    alert(error.message);
    if (error.message.includes("session") || error.message.includes("password")) lockAdmin(false);
  }
}

async function load() {
  state.db = await api("/api/db");
  state.products = state.db.products;
  preloadProductImages();
  await validateAdminSession();
  renderAdminGate();
  renderAdminList();
  setLanguage(state.lang);
  requestAnimationFrame(scrollToCurrentHash);
  setTimeout(scrollToCurrentHash, 250);
  setTimeout(scrollToCurrentHash, 900);
}

function bindEvents() {
  $$(".language-switch button").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
  $("#menuButton").addEventListener("click", () => $("#nav").classList.toggle("open"));
  $$("#nav a").forEach(link => link.addEventListener("click", () => $("#nav").classList.remove("open")));
  $("#drawerClose").addEventListener("click", closeDetails);
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeDetails(); });
  $("#searchInput").addEventListener("input", renderProducts);
  $("#categoryFilter").addEventListener("change", renderProducts);
  $("#conditionFilter").addEventListener("change", renderProducts);
  $("#productForm").addEventListener("submit", saveProduct);
  $("#resetForm").addEventListener("click", resetForm);
  $("#adminLoginForm").addEventListener("submit", unlockAdmin);
  $("#adminLogout").addEventListener("click", lockAdmin);
}

bindEvents();
load().catch(error => {
  document.body.innerHTML = `<main class="section"><h1>NextPair KH</h1><p>${error.message}</p></main>`;
});
