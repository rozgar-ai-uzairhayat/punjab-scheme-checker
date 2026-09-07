export interface Announcement {
  id: string;
  titleEn: string;
  titleUr: string;
  summaryEn: string;
  summaryUr: string;
  bulletsEn: string[];
  bulletsUr: string[];
  departmentEn: string;
  departmentUr: string;
  category: 'housing' | 'social' | 'agriculture' | 'education' | 'energy';
  sourceName: string;
  sourceUrl: string;
  dateEn: string;
  dateUr: string;
  badgeEn: string;
  badgeUr: string;
  badgeColor: string;
  icon: string;
}

export const OFFICIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'acag-expansion-plots',
    titleEn: 'Apni Chhat Apna Ghar Expands to Joint Families & 1,534 Free Plots Allocated',
    titleUr: 'اپنی چھت اپنا گھر میں مشترکہ خاندانوں کی شمولیت اور 1534 مفت پلاٹوں کی الاٹمنٹ',
    summaryEn: 'The Punjab Government has expanded the flagship housing initiative to include joint families for roof strengthening and home additions, while commencing allocation of 1,534 free plots for homeless citizens across 4 major districts.',
    summaryUr: 'حکومت پنجاب نے اپنی چھت اپنا گھر اسکیم میں مشترکہ خاندانوں کو مکان کی توسیع اور چھت کی مضبوطی کے لیے بلاسود قرضوں کی سہولت دی ہے، جبکہ 4 اضلاع میں بے زمین شہریوں کو 1534 رہائشی پلاٹ دیے جا رہے ہیں۔',
    bulletsEn: [
      'Over 65,000 homes completed and 133,990+ loans disbursed with interest-free 7-year terms.',
      'New "Apni Chhat, Mehfooz Chhat" tier offers Rs 500,000 for roof strengthening and up to Rs 1M for room extensions.',
      '"Apni Zameen, Apna Ghar" phase 1 allocates 1,534 residential plots in Jhelum, Kasur, Faisalabad, and Lodhran.',
      '20% concession on principal for full repayment within 1–3 years; 10% discount for 4–6 years.'
    ],
    bulletsUr: [
      '65 ہزار سے زائد گھر مکمل اور 1 لاکھ 33 ہزار سے زائد قرضے 7 سالہ بلاسود اقساط پر جاری۔',
      '"اپنی چھت، محفوظ چھت" کے تحت چھت کی مرمت کے لیے 5 لاکھ اور نئے کمروں کے لیے 10 لاکھ روپے تک قرضہ۔',
      '"اپنی زمین، اپنا گھر" فیز 1 کے تحت جہلم، قصور، فیصل آباد اور لودھراں میں 1534 مفت پلاٹوں کی الاٹمنٹ۔',
      'ایک سے تین سال میں مکمل واپسی پر اصل رقم پر 20 فیصد اور چار سے چھ سال میں 10 فیصد رعایت۔'
    ],
    departmentEn: 'Punjab Housing and Town Planning Agency (PHATA)',
    departmentUr: 'پنجاب ہاؤسنگ اینڈ ٹاؤن پلاننگ ایجنسی (PHATA)',
    category: 'housing',
    sourceName: 'phata.punjab.gov.pk',
    sourceUrl: 'https://phata.punjab.gov.pk',
    dateEn: '2025–2026 Phase Update',
    dateUr: '2025-2026 تازہ ترین فیز',
    badgeEn: 'Housing Milestone',
    badgeUr: 'ہاؤسنگ سنگ میل',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: 'roofing'
  },
  {
    id: 'himmat-card-phase3',
    titleEn: 'Himmat Card Phase III Disburses Rs 10,500 Quarterly Stipend via BOP ATM Cards',
    titleUr: 'ہمت کارڈ فیز 3 کا اجراء: بینک آف پنجاب اے ٹی ایم کارڈ سے 10,500 روپے سہ ماہی وظیفہ',
    summaryEn: 'Punjab Social Welfare and Bait-ul-Maal Department has scaled the Himmat Card initiative to reach over 100,000 certified persons with disabilities (PWDs), delivering direct quarterly cash support.',
    summaryUr: 'محکمہ سوشل ویلفیئر اینڈ بیت المال پنجاب نے ہمت کارڈ پروگرام کے فیز 3 میں 1 لاکھ سے زائد معذور افراد کو بینک آف پنجاب کے خصوصی اے ٹی ایم کارڈز کے ذریعے 10,500 روپے سہ ماہی وظیفہ فراہم کرنا شروع کر دیا ہے۔',
    bulletsEn: [
      'Quarterly financial assistance of Rs 10,500 deposited directly into customized Bank of Punjab ATM/debit cards.',
      'Active registration for differently-abled citizens through certified Social Welfare Assessment Boards.',
      'Strict provincial enforcement of the 3% mandatory employment quota across all Punjab government departments.',
      'Free urban travel accessibility and dedicated assistance booths established across divisional secretariats.'
    ],
    bulletsUr: [
      'بینک آف پنجاب کے خصوصی اے ٹی ایم کارڈ میں 10,500 روپے سہ ماہی مالی امداد براہ راست منتقل۔',
      'سوشل ویلفیئر اسیسمنٹ بورڈ سے تصدیق شدہ معذوری سرٹیفکیٹ کے حامل افراد کی فوری رجسٹریشن جاری۔',
      'پنجاب کے تمام سرکاری محکموں میں 3 فیصد لازمی ملازمت کے کوٹے پر عملدرآمد کی سخت ہدایات۔',
      'سرکاری پبلک ٹرانسپورٹ میں مفت سفری سہولت اور ڈویژنل سطح پر خصوصی سہولت ڈیسک قائم۔'
    ],
    departmentEn: 'Punjab Social Welfare & Bait-ul-Maal Department',
    departmentUr: 'سوشل ویلفیئر اینڈ بیت المال ڈیپارٹمنٹ پنجاب',
    category: 'social',
    sourceName: 'swd.punjab.gov.pk',
    sourceUrl: 'https://swd.punjab.gov.pk',
    dateEn: 'Active Phase Rollout',
    dateUr: 'فعال مرحلہ وار ادائیگی',
    badgeEn: 'Special Welfare',
    badgeUr: 'خصوصی ریلیف',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: 'accessible'
  },
  {
    id: 'kisan-card-wheat-subsidy',
    titleEn: '1 Million Kisan Cards Issued: Rs 360 Billion Disbursed with Rs 5,000/Acre Wheat Subsidy',
    titleUr: '10 لاکھ کسان کارڈز کا اجراء: 360 ارب روپے کے زرعی بلاسود قرضے اور گندم سبسڈی',
    summaryEn: 'The Chief Minister Kisan Card scheme has achieved a historic milestone with 1 million cards distributed across Punjab, delivering subsidized inputs, diesel relief, and targeted cash support.',
    summaryUr: 'وزیراعلیٰ پنجاب کسان کارڈ اسکیم کے تحت صوبہ بھر میں 10 لاکھ کسان کارڈز جاری کر کے 360 ارب روپے کے بلاسود زرعی قرضے اور کھاد و ڈیزل پر جامع ریلیف فراہم کیا جا چکا ہے۔',
    bulletsEn: [
      'Over 1 million Kisan Cards issued province-wide with an exceptional 99% loan recovery rate.',
      'Direct cash wheat subsidy of Rs 5,000 per acre (up to Rs 25,000 for 5 acres) approved for 600,000 farmers.',
      'Interest-free production loans up to Rs 30,000/acre (30% cash withdrawal, 25% diesel subsidy, remainder for DAP/urea).',
      'Easy registration by sending CNIC via SMS to 8070 and completing biometric verification at Tehsil Agriculture Centers.'
    ],
    bulletsUr: [
      'صوبہ بھر میں 10 لاکھ کسان کارڈز جاری، ریکارڈ 99 فیصد ریکوری کی شرح کے ساتھ تاریخی کامیابی۔',
      '6 لاکھ گندم کاشتکاروں کے لیے 5,000 روپے فی ایکڑ (5 ایکڑ پر 25,000 روپے تک) نقد سبسڈی منظور۔',
      'فی ایکڑ 30,000 روپے بلاسود پیداواری قرضہ (30 فیصد نقد رقم، 25 فیصد ڈیزل اور باقی کھاد و بیج کے لیے)۔',
      'اپنا شناختی کارڈ نمبر 8070 پر ایس ایم ایس بھیج کر قریبی تحصیل زراعت دفتر سے تصدیق کرائیں۔'
    ],
    departmentEn: 'Agriculture Department, Government of Punjab',
    departmentUr: 'محکمہ زراعت، حکومت پنجاب',
    category: 'agriculture',
    sourceName: 'agripunjab.gov.pk',
    sourceUrl: 'https://agripunjab.gov.pk',
    dateEn: '2025–2026 Kharif Cycle',
    dateUr: 'خریف و ربیع سیزن 2025-2026',
    badgeEn: 'Agriculture Package',
    badgeUr: 'زرعی پیکیج',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: 'agriculture'
  },
  {
    id: 'honhaar-scholarship-tuition',
    titleEn: 'Honhaar Scholarship Program: 30,000 Annual Full-Tuition Awards across 68 Disciplines',
    titleUr: 'ہونہار اسکالرشپ پروگرام: 68 شعبہ جات میں سالانہ 30 ہزار طلباء کے لیے 100 فیصد فیس معافی',
    summaryEn: 'Punjab Higher Education Department is executing the Rs 130 billion Honhaar Undergraduate Scholarships Program, awarding 100% tuition coverage for students attending top public and private universities.',
    summaryUr: 'ہائر ایجوکیشن ڈیپارٹمنٹ پنجاب 130 ارب روپے کی لاگت سے ہونہار اسکالرشپ کے تحت 68 تعلیمی شعبوں میں سالانہ 30 ہزار مستحق اور ذہین طلباء کو 100 فیصد مفت اعلیٰ تعلیم فراہم کر رہا ہے۔',
    bulletsEn: [
      '100% full tuition coverage for 4–5 year bachelor degrees across 65 public universities and top private HEIs.',
      'Targets high-achieving Punjab domicile students under 22 years of age with household income under Rs 300,000/month.',
      'Covers in-demand disciplines: Computer Science, Software Engineering, AI, Medicine, Agriculture, and Engineering.',
      '120,000 students will benefit in the first 4-year cycle via the centralized online portal.'
    ],
    bulletsUr: [
      '65 سرکاری جامعات اور اعلیٰ نجی تعلیمی اداروں میں 4 سے 5 سالہ بی ایس پروگرامز کے لیے 100 فیصد ٹیوشن فیس معاف۔',
      'پنجاب ڈومیسائل کے حامل 22 سال سے کم عمر طلباء جن کی خاندانی ماہانہ آمدنی 3 لاکھ روپے سے کم ہو۔',
      'کمپیوٹر سائنس، مصنوعی ذہانت، سافٹ ویئر انجینئرنگ، طب، زراعت اور انجینئرنگ کے 68 شعبہ جات شامل۔',
      'مرکزی آن لائن پورٹل کے ذریعے پہلے 4 سالہ دورانیے میں 1 لاکھ 20 ہزار طلباء مستفید ہوں گے۔'
    ],
    departmentEn: 'Higher Education Department (HED), Punjab',
    departmentUr: 'ہائر ایجوکیشن ڈیپارٹمنٹ (HED) پنجاب',
    category: 'education',
    sourceName: 'hed.punjab.gov.pk',
    sourceUrl: 'https://hed.punjab.gov.pk',
    dateEn: 'Annual Cycle Allocation',
    dateUr: 'سالانہ تعلیمی سیشن',
    badgeEn: 'Higher Education',
    badgeUr: 'اعلیٰ تعلیم',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: 'school'
  },
  {
    id: 'dhee-rani-marriages',
    titleEn: 'CM Dhee Rani Program: Rs 100,000 Cash Grant + Dowry Essentials Reaches 5,000+ Families',
    titleUr: 'وزیراعلیٰ دھی رانی پروگرام: 5 ہزار سے زائد مستحق بیٹیوں کے لیے 1 لاکھ سلامی اور جہیز سامان',
    summaryEn: 'Punjab Social Protection Authority (PSPA) has organized dignified collective marriage ceremonies for over 5,000 underprivileged brides, scaling up to cover 9,000 couples across all 9 administrative divisions.',
    summaryUr: 'پنجاب سوشل پروٹیکشن اتھارٹی نے صوبہ بھر میں 5 ہزار سے زائد مستحق بیٹیوں کی باوقار اجتماعی شادیوں کا اہتمام کیا ہے جس کا ہدف 9 ہزار جوڑوں تک بڑھایا گیا ہے۔',
    bulletsEn: [
      'Rs 100,000 direct cash gift (Salami) deposited into the bride\'s verified bank account via Bank of Punjab.',
      'Complete household setup provided: dinner sets, double bed with mattress, trunk, and essential dowry articles.',
      'Organized dignifying ceremonies with wedding feast (Walima/lunch) for 20 guests per couple at government expense.',
      'Eligible applicants include destitute, orphan, or low-income girls aged 18–40 residing anywhere in Punjab.'
    ],
    bulletsUr: [
      'بینک آف پنجاب کے ذریعے دلہن کے بینک اکاؤنٹ میں 1 لاکھ روپے نقد سلامی کا براہ راست تحفہ۔',
      'مکمل گھریلو سامان بشمول ڈبل بیڈ معہ گدا، واشنگ مشین، ڈنر سیٹ، صندوق اور دیگر ضروری اشیاء کی فراہمی۔',
      'ہر جوڑے کے 20 معزز مہمانوں کے لیے سرکاری خرچ پر باوقار ضیافت کا اہتمام۔',
      'پنجاب کی رہائشی یتیم، نادار اور مستحق لڑکیاں (عمر 18 تا 40 سال) آن لائن پورٹل پر درخواست دے سکتی ہیں۔'
    ],
    departmentEn: 'Punjab Social Protection Authority (PSPA)',
    departmentUr: 'پنجاب سوشل پروٹیکشن اتھارٹی (PSPA)',
    category: 'social',
    sourceName: 'pspa.punjab.gov.pk',
    sourceUrl: 'https://pspa.punjab.gov.pk',
    dateEn: '2025–2026 Expansion',
    dateUr: '2025-2026 توسیع',
    badgeEn: 'Family Welfare',
    badgeUr: 'خاندانی تحفظ',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    icon: 'diversity_1'
  },
  {
    id: 'roshan-gharana-solar',
    titleEn: 'Roshan Gharana Solar Phase II: Up to 90% Subsidized 1kW Systems for Protected Users',
    titleUr: 'روشن گھرانہ سولر فیز 2: 200 یونٹس سے کم بجلی صارفین کے لیے 90 فیصد حکومتی سبسڈی',
    summaryEn: 'Punjab Energy Department has initiated Phase II of CM Roshan Gharana, installing rooftop solar setups for consumers using up to 200 units with 90% of the equipment costs covered by the provincial government.',
    summaryUr: 'محکمہ توانائی پنجاب نے روشن گھرانہ اسکیم کے فیز 2 کے تحت ماہانہ 200 یونٹس تک بجلی استعمال کرنے والے محفوظ صارفین کے گھروں پر 90 فیصد حکومتی سبسڈی سے 1 کے وی سولر سسٹمز کی تنصیب شروع کر دی ہے۔',
    bulletsEn: [
      'Protected domestic consumers using up to 200 units receive a complete 1kW solar package with only 10% co-payment.',
      'Package includes Tier-1 solar panels, high-efficiency inverter, tubular/lithium batteries, and net-metering readiness.',
      'Middle-tier consumers (200–500 units) offered interest-free financing with flexible 5-year monthly billing installments.',
      'Eligibility verified automatically using DISCO reference numbers matched with Punjab domicile and CNIC records.'
    ],
    bulletsUr: [
      'ماہانہ 200 یونٹ تک استعمال کرنے والے صارفین کو 90 فیصد سبسڈی پر 1 کلوواٹ کا مکمل سولر پیکیج۔',
      'ٹائر 1 سولر پینلز، انورٹر اور جدید بیٹری پر مشتمل تصدیق شدہ معیاری سامان کی بلا معاوضہ تنصیب۔',
      '200 سے 500 یونٹ تک بجلی صارفین کے لیے بلاسود 5 سالہ آسان ماہانہ اقساط کی سہولت۔',
      'بجلی کے بل کے ریفرنس نمبر اور نادرا شناختی کارڈ سے خودکار تصدیق کے بعد فوری قرعہ اندازی۔'
    ],
    departmentEn: 'Energy Department, Government of Punjab',
    departmentUr: 'محکمہ توانائی، حکومت پنجاب',
    category: 'energy',
    sourceName: 'energy.punjab.gov.pk',
    sourceUrl: 'https://energy.punjab.gov.pk',
    dateEn: 'Phase II Implementation',
    dateUr: 'فیز 2 پر عملدرآمد',
    badgeEn: 'Clean Energy Relief',
    badgeUr: 'توانائی ریلیف',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: 'solar_power'
  }
];
