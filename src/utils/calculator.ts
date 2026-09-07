import { CitizenData, EvaluationResult, Scheme } from '../types';
import { ALL_OFFICIAL_SCHEMES } from '../data/schemes';

export function evaluateSchemes(data: CitizenData): EvaluationResult {
  const direct: Scheme[] = [];
  const survey: Scheme[] = [];
  const pending: Scheme[] = [];

  const getScheme = (id: string): Scheme => {
    const s = ALL_OFFICIAL_SCHEMES.find((item) => item.id === id);
    if (!s) throw new Error(`Scheme not found: ${id}`);
    return JSON.parse(JSON.stringify(s));
  };

  const isUrduArea = data.areaType === 'urban' ? 'شہری' : 'دیہی';
  const enArea = data.areaType === 'urban' ? 'Urban' : 'Rural';

  // 1. Punjab Sehat Card Plus
  const sehat = getScheme('sehat-card');
  if (!data.isPunjabResident) {
    pending.push({
      ...sehat,
      status: 'not_eligible_yet',
      statusText: 'Punjab Domicile Required',
      statusTextUrdu: 'پنجاب رہائش درکار',
      matchReason: 'Sehat Card Plus is funded by Punjab Government for permanent Punjab residents.',
      matchReasonUrdu: 'صحت کارڈ پلس حکومت پنجاب کے فنڈ سے صرف پنجاب کے مستقل رہائشیوں کے لیے ہے۔',
      whereToApplyLabel: 'Action required',
      whereToApplyLabelUrdu: 'ضروری اقدام',
      whereToApply: 'Update permanent address on NADRA CNIC to Punjab to qualify.',
      whereToApplyUrdu: 'اہلیت کے لیے نادرا شناختی کارڈ پر مستقل پتا پنجاب کا اپ ڈیٹ کروائیں۔'
    });
  } else if (data.monthlyIncome <= 200000) {
    direct.push({
      ...sehat,
      status: 'eligible',
      statusText: 'Eligible',
      statusTextUrdu: 'اہل',
      matchReason: `Permanent Punjab resident with household income (Rs ${data.monthlyIncome.toLocaleString()}) within Rs 200,000 ceiling.`,
      matchReasonUrdu: `پنجاب کے مستقل رہائشی جن کی ماہانہ آمدن (₨ ${data.monthlyIncome.toLocaleString()}) 2 لاکھ روپے کی حد کے اندر ہے۔`
    });
  } else {
    pending.push({
      ...sehat,
      status: 'not_eligible_yet',
      statusText: 'Above Income Ceiling',
      statusTextUrdu: 'آمدنی کی حد سے زائد',
      matchReason: 'Monthly income exceeds the Rs 200,000 public health insurance ceiling.',
      matchReasonUrdu: 'ماہانہ آمدن سرکاری مفت علاج کی 2 لاکھ روپے حد سے زیادہ ہے۔'
    });
  }

  // 2. CM Punjab Nigahban Card & Relief
  const nigahban = getScheme('nigahban-card');
  const isGovt = data.employmentStatus === 'govt_employee';
  if (!data.isPunjabResident) {
    pending.push({
      ...nigahban,
      status: 'not_eligible_yet',
      statusText: 'Punjab Resident Required',
      statusTextUrdu: 'پنجاب رہائش درکار',
      matchReason: 'PSPA relief cards are exclusively allocated to residents of Punjab.',
      matchReasonUrdu: 'پی ایس پی اے ریلیف صرف پنجاب کے مستقل رہائشیوں کے لیے مختص ہے۔'
    });
  } else if (isGovt) {
    pending.push({
      ...nigahban,
      status: 'not_eligible_yet',
      statusText: 'Govt Employees Excluded',
      statusTextUrdu: 'سرکاری ملازم کے لیے نہیں',
      matchReason: 'Government servants and regular pensioners are ineligible for poverty safety nets by regulation.',
      matchReasonUrdu: 'سرکاری قوانین کے تحت سرکاری ملازمین اور پنشنرز غربت ریلیف کے اہل نہیں ہیں۔',
      whereToApplyLabel: 'Policy note',
      whereToApplyLabelUrdu: 'پالیسی وضاحت',
      whereToApply: 'Civil servants qualify for Punjab Sehat Card and Solar scheme instead.',
      whereToApplyUrdu: 'سرکاری ملازمین اس کے بجائے صحت کارڈ اور سولر اسکیم سے فائدہ اٹھا سکتے ہیں۔'
    });
  } else if (data.electricityUnits === 'above_500') {
    pending.push({
      ...nigahban,
      status: 'not_eligible_yet',
      statusText: 'Electricity Exceeds Limit',
      statusTextUrdu: 'بجلی کھپت حد سے زیادہ',
      matchReason: 'Official criteria requires domestic electricity consumption under 200 units.',
      matchReasonUrdu: 'سرکاری معیار کے مطابق بجلی کی کھپت 200 یونٹ سے کم ہونا لازمی ہے۔'
    });
  } else if (data.monthlyIncome <= 60000) {
    direct.push({
      ...nigahban,
      status: 'eligible',
      statusText: 'Eligible',
      statusTextUrdu: 'اہل',
      matchReason: `Income (Rs ${data.monthlyIncome.toLocaleString()}) and electricity consumption qualify for direct poverty relief.`,
      matchReasonUrdu: `ماہانہ آمدن (₨ ${data.monthlyIncome.toLocaleString()}) اور بجلی کی کھپت غربت ریلیف کے معیار کے عین مطابق ہے۔`
    });
  } else if (data.monthlyIncome <= 80000 && data.householdSize >= 6) {
    direct.push({
      ...nigahban,
      status: 'eligible',
      statusText: 'Eligible (Large Family)',
      statusTextUrdu: 'اہل (بڑا خاندان)',
      matchReason: `Large family quota applied: Household size of ${data.householdSize} members qualifies with income up to Rs 80,000.`,
      matchReasonUrdu: `بڑے خاندان کا کوٹہ: ${data.householdSize} افراد پر مشتمل گھرانہ 80,000 روپے تک آمدن پر اہل قرار دیا گیا ہے۔`
    });
  } else {
    pending.push({
      ...nigahban,
      status: 'not_eligible_yet',
      statusText: 'Income Exceeds Limit',
      statusTextUrdu: 'آمدنی حد سے زائد',
      matchReason: 'Household income exceeds Rs 60,000 limit for general households.',
      matchReasonUrdu: 'ماہانہ آمدن عام گھرانوں کی 60,000 روپے حد سے زیادہ ہے۔'
    });
  }

  // 3. CM Honhaar Undergraduate Scholarship
  const scholarship = getScheme('honhaar-scholarship');
  if (data.isStudent) {
    if (!data.isPunjabResident) {
      pending.push({
        ...scholarship,
        status: 'not_eligible_yet',
        statusText: 'Punjab Domicile Required',
        statusTextUrdu: 'پنجاب ڈومیسائل لازمی',
        matchReason: 'Scholarship requires Punjab domicile certificate.',
        matchReasonUrdu: 'اسکالرشپ کے لیے پنجاب کا ڈومیسائل سرٹیفکیٹ ہونا لازمی ہے۔'
      });
    } else if (data.age > 22) {
      pending.push({
        ...scholarship,
        status: 'not_eligible_yet',
        statusText: 'Age Above 22 Years',
        statusTextUrdu: 'عمر 22 سال سے زیادہ',
        matchReason: `Official age ceiling is 22 years (Applicant age: ${data.age}). Check university internal merit quotas.`,
        matchReasonUrdu: `سرکاری عمر کی حد 22 سال ہے (آپ کی عمر: ${data.age} سال)۔ یونیورسٹی کی اندرونی اسکالرشپ میں درخواست دیں۔`
      });
    } else if (data.monthlyIncome <= 300000) {
      direct.push({
        ...scholarship,
        status: 'eligible',
        statusText: 'Eligible',
        statusTextUrdu: 'اہل',
        matchReason: `Enrolled undergraduate student under 22 years with family income below Rs 300,000.`,
        matchReasonUrdu: `22 سال سے کم عمر ریگولر انڈر گریجویٹ طالب علم اور سرپرست کی آمدن 3 لاکھ سے کم۔`
      });
    } else {
      pending.push({
        ...scholarship,
        status: 'not_eligible_yet',
        statusText: 'Above Income Ceiling',
        statusTextUrdu: 'آمدنی کی حد سے زائد',
        matchReason: 'Parental income exceeds official Rs 300,000 threshold.',
        matchReasonUrdu: 'سرپرست کی آمدن 3 لاکھ روپے کی سرکاری حد سے زیادہ ہے۔'
      });
    }
  } else if (data.age <= 22) {
    pending.push({
      ...scholarship,
      status: 'not_eligible_yet',
      statusText: 'Enrollment Required',
      statusTextUrdu: 'یونیورسٹی داخلہ درکار',
      matchReason: 'Qualify once admitted into 68 designated BS degree programs at 65 participating universities.',
      matchReasonUrdu: 'منظور شدہ 65 یونیورسٹیوں کے 68 بی ایس پروگرامز میں داخلہ لیتے ہی آپ اہل ہو جائیں گے۔'
    });
  }

  // 4. CM Punjab Roshan Gharana Solar Scheme
  const solar = getScheme('roshan-gharana');
  if (!data.isPunjabResident) {
    pending.push({
      ...solar,
      status: 'not_eligible_yet',
      statusText: 'Punjab Meter Required',
      statusTextUrdu: 'پنجاب بجلی میٹر لازمی',
      matchReason: 'Valid DISCO domestic connection within Punjab distribution territory required.',
      matchReasonUrdu: 'پنجاب کی بجلی تقسیم کار کمپنیوں (لیسکو، گیپکو، فیسکو، میپکو، آئیسکو) کا میٹر درکار ہے۔'
    });
  } else if (data.electricityUnits === 'under_200') {
    direct.push({
      ...solar,
      status: 'eligible',
      statusText: 'Eligible (90% Subsidy)',
      statusTextUrdu: 'اہل (90 فیصد سبسڈی)',
      matchReason: 'Protected consumption category (under 200 units) qualifies for top tier 90% government solar subsidy.',
      matchReasonUrdu: '200 یونٹ سے کم بجلی استعمال کرنے والے محفوظ صارفین 90 فیصد سرکاری سولر سبسڈی کے براہ راست اہل ہیں۔'
    });
  } else if (data.electricityUnits === '200_500') {
    direct.push({
      ...solar,
      status: 'eligible',
      statusText: 'Eligible (Phase 2)',
      statusTextUrdu: 'اہل (دوسرا مرحلہ)',
      matchReason: 'Domestic connection consuming 200-500 units qualifies for subsidized net-metering solar system.',
      matchReasonUrdu: '200 سے 500 یونٹ استعمال کرنے والے گھریلو صارفین رعایتی نیٹ میٹرنگ سولر سسٹم کے اہل ہیں۔'
    });
  } else {
    pending.push({
      ...solar,
      status: 'not_eligible_yet',
      statusText: 'Consumption Exceeds 500 Units',
      statusTextUrdu: '500 یونٹ سے زائد کھپت',
      matchReason: 'Scheme is capped at 500 units. Bring 6-month average consumption below 500 units to qualify.',
      matchReasonUrdu: 'یہ اسکیم 500 یونٹ تک کے میٹرز کے لیے ہے۔ 6 ماہ کی اوسط کھپت کم کرنے پر اہلیت ممکن ہے۔',
      whereToApplyLabel: 'Action required',
      whereToApplyLabelUrdu: 'ضروری اقدام',
      whereToApply: 'Reduce monthly electricity consumption below 500 units to enter the ballot.',
      whereToApplyUrdu: 'قرعہ اندازی میں شمولیت کے لیے بجلی کی ماہانہ کھپت 500 یونٹ سے نیچے لائیں۔'
    });
  }

  // 5. CM Apni Chhat, Apna Ghar (ACAG)
  const apniChhat = getScheme('apni-chhat');
  if (!data.isPunjabResident) {
    pending.push({
      ...apniChhat,
      status: 'not_eligible_yet',
      statusText: 'Punjab Plot Required',
      statusTextUrdu: 'پنجاب میں پلاٹ لازمی',
      matchReason: 'Residential plot must be located within Punjab territorial limits.',
      matchReasonUrdu: 'رہائشی پلاٹ کا پنجاب کے حدود میں واقع ہونا ضروری ہے۔'
    });
  } else if (data.monthlyIncome <= 100000) {
    if (data.ownsSmallPlot) {
      direct.push({
        ...apniChhat,
        status: 'eligible',
        statusText: 'Eligible',
        statusTextUrdu: 'اہل',
        matchReason: `Owns residential plot in ${enArea} area with household income (Rs ${data.monthlyIncome.toLocaleString()}) within Rs 100,000 threshold.`,
        matchReasonUrdu: `${isUrduArea} علاقے میں پلاٹ کی ملکیت اور ماہانہ آمدن (₨ ${data.monthlyIncome.toLocaleString()}) 1 لاکھ روپے کی حد کے اندر ہے۔`
      });
    } else {
      pending.push({
        ...apniChhat,
        status: 'not_eligible_yet',
        statusText: 'Plot Document Required',
        statusTextUrdu: 'پلاٹ ملکیت درکار',
        matchReason: `Requires title fard/registry of up to 5 Marla in urban or 10 Marla in rural areas. Free 3-marla plot quota available for landless laborers.`,
        matchReasonUrdu: `شہری 5 مرلہ یا دیہی 10 مرلہ زمین کی ملکیت کا ثبوت درکار ہے۔ بے زمین مزدوروں کے لیے 3 مرلہ مفت پلاٹ کوٹہ بھی دستیاب ہے۔`,
        whereToApplyLabel: 'Action required',
        whereToApplyLabelUrdu: 'ضروری اقدام',
        whereToApply: 'Obtain computerized land Fard from Arazi Record Center, or apply for Laborer 3-Marla quota.',
        whereToApplyUrdu: 'اراضی ریکارڈ سنٹر سے فرد ملکیت حاصل کریں یا مزدور کوٹہ میں 3 مرلہ پلاٹ کے لیے درخواست دیں۔'
      });
    }
  } else {
    pending.push({
      ...apniChhat,
      status: 'not_eligible_yet',
      statusText: 'Above Income Ceiling',
      statusTextUrdu: 'آمدنی کی حد سے زائد',
      matchReason: 'Monthly income exceeds official Rs 100,000 limit for this interest-free housing scheme.',
      matchReasonUrdu: 'ماہانہ آمدن بلاسود ہاؤسنگ اسکیم کی سرکاری حد 1 لاکھ روپے سے زیادہ ہے۔'
    });
  }

  // 6. CM Punjab E-Bike Scheme
  const ebike = getScheme('ebike-scheme');
  if (data.isStudent && data.isPunjabResident) {
    if (data.hasLearnerPermit) {
      direct.push({
        ...ebike,
        status: 'eligible',
        statusText: 'Eligible',
        statusTextUrdu: 'اہل',
        matchReason: `Regular student in Punjab holding valid motorcycle learner/driving license.`,
        matchReasonUrdu: `پنجاب میں زیر تعلیم ریگولر طالب علم اور کارآمد موٹرسائیکل لرنر یا ڈرائیونگ لائسنس کا حامل۔`
      });
    } else {
      pending.push({
        ...ebike,
        status: 'not_eligible_yet',
        statusText: 'Learner Permit Required',
        statusTextUrdu: 'لرنر پرمٹ درکار',
        matchReason: 'Mandatory prerequisite: Valid motorcycle driving license or learner permit issued by Punjab Police.',
        matchReasonUrdu: 'لازمی شرط: پنجاب ٹریفک پولیس کا جاری کردہ کارآمد موٹرسائیکل لرنر پرمٹ یا ڈرائیونگ لائسنس۔',
        whereToApplyLabel: 'Action required',
        whereToApplyLabelUrdu: 'ضروری اقدام',
        whereToApply: 'Obtain motorcycle learner permit online in 5 minutes via punjab.gov.pk or visit Khidmat Markaz, then apply at bikes.punjab.gov.pk.',
        whereToApplyUrdu: 'پنجاب پولیس کی ویب سائٹ سے 5 منٹ میں آن لائن لرنر پرمٹ حاصل کریں اور پھر فوری bikes.punjab.gov.pk پر اپلائی کریں۔'
      });
    }
  } else if (!data.isStudent && data.age >= 18 && data.age <= 29 && data.hasLearnerPermit) {
    pending.push({
      ...ebike,
      status: 'not_eligible_yet',
      statusText: 'Youth Quota Phase',
      statusTextUrdu: 'یوتھ کوٹہ فیز',
      matchReason: 'Phase 2 expansion covers working youth with driving permits.',
      matchReasonUrdu: 'دوسرا مرحلہ ملازمت پیشہ اور ہنرمند نوجوانوں کے لیے مختص ہے۔'
    });
  }

  // 7. CM Punjab Kisan Card & Green Tractor
  const kisan = getScheme('kisan-card');
  if (!data.isPunjabResident) {
    pending.push({
      ...kisan,
      status: 'not_eligible_yet',
      statusText: 'Punjab Land Required',
      statusTextUrdu: 'پنجاب اراضی لازمی',
      matchReason: 'Agricultural land must be located in Punjab province.',
      matchReasonUrdu: 'زرعی اراضی کا صوبہ پنجاب میں واقع ہونا لازمی ہے۔'
    });
  } else if (data.ownsAgriLand || data.employmentStatus === 'farmer') {
    direct.push({
      ...kisan,
      status: 'eligible',
      statusText: 'Eligible',
      statusTextUrdu: 'اہل',
      matchReason: `Farmer or cultivator with up to 12.5 acres agricultural land in Punjab.`,
      matchReasonUrdu: `پنجاب میں ساڑھے 12 ایکڑ تک زرعی زمین کا کاشتکار یا مالک۔`
    });
  } else {
    pending.push({
      ...kisan,
      status: 'not_eligible_yet',
      statusText: 'Farm Land Fard Required',
      statusTextUrdu: 'زرعی فرد ملکیت درکار',
      matchReason: 'Requires ownership or verified tenancy fard of agricultural land up to 12.5 acres.',
      matchReasonUrdu: 'ساڑھے 12 ایکڑ تک زرعی زمین کی فرد ملکیت یا مزارع ہونے کا ثبوت درکار ہے۔'
    });
  }

  // 8. CM Punjab Himmat Card
  const himmat = getScheme('himmat-card');
  if (data.hasDisability && data.isPunjabResident) {
    direct.push({
      ...himmat,
      status: 'eligible',
      statusText: 'Eligible',
      statusTextUrdu: 'اہل',
      matchReason: `Certified Person with Disability (PWD) holder of Special CNIC in Punjab.`,
      matchReasonUrdu: `پنجاب میں نادرا کے مخصوص معذوری نشان (ویل چیئر) والے خصوصی شناختی کارڈ کا حامل۔`
    });
  } else if (data.hasDisability && !data.isPunjabResident) {
    pending.push({
      ...himmat,
      status: 'not_eligible_yet',
      statusText: 'Punjab Domicile Required',
      statusTextUrdu: 'پنجاب ڈومیسائل درکار',
      matchReason: 'Himmat Card stipend is disbursed through Bank of Punjab for Punjab residents.',
      matchReasonUrdu: 'ہمت کارڈ وظیفہ صرف پنجاب کے مستقل رہائشیوں کو بینک آف پنجاب کے ذریعے دیا جاتا ہے۔'
    });
  }

  // 9. CM Punjab Dhee Rani Collective Marriage Program
  const dheeRani = getScheme('dhee-rani');
  if (data.hasDaughterMarriage && data.isPunjabResident) {
    if (data.monthlyIncome <= 60000 || data.employmentStatus === 'daily_wage' || data.employmentStatus === 'unemployed') {
      direct.push({
        ...dheeRani,
        status: 'eligible',
        statusText: 'Eligible',
        statusTextUrdu: 'اہل',
        matchReason: `Underprivileged family preparing for daughter's wedding with income <= Rs 60,000.`,
        matchReasonUrdu: `مستحق خاندان جو بیٹی کی شادی کی تیاری کر رہا ہے اور ماہانہ آمدن 60,000 روپے کے اندر ہے۔`
      });
    } else {
      pending.push({
        ...dheeRani,
        status: 'not_eligible_yet',
        statusText: 'Low-Income Quota',
        statusTextUrdu: 'کم آمدنی کوٹہ',
        matchReason: 'Priority given to orphan daughters or families earning under Rs 60,000.',
        matchReasonUrdu: 'ترجیح یتیم بچیوں اور 60,000 سے کم آمدنی والے گھرانوں کو دی جاتی ہے۔'
      });
    }
  }

  // 10. CM Youth Business & Technical Loans
  const youthLoan = getScheme('youth-loan');
  if (data.isPunjabResident && data.age >= 18 && data.age <= 45) {
    if (data.isYouthEntrepreneur || data.employmentStatus === 'self_employed' || data.employmentStatus === 'unemployed') {
      direct.push({
        ...youthLoan,
        status: 'eligible',
        statusText: 'Eligible',
        statusTextUrdu: 'اہل',
        matchReason: `Age (${data.age} yrs) and entrepreneurial/artisan status qualify for Bank of Punjab micro-finance.`,
        matchReasonUrdu: `عمر (${data.age} سال) اور کاروباری/ہنرمند حیثیت بینک آف پنجاب کے رعایتی قرض کے لیے اہل ہے۔`
      });
    } else {
      pending.push({
        ...youthLoan,
        status: 'not_eligible_yet',
        statusText: 'Business Proposal Required',
        statusTextUrdu: 'کاروباری منصوبہ درکار',
        matchReason: 'Submit small commercial business plan or TEVTA vocational certificate to qualify.',
        matchReasonUrdu: 'اہلیت کے لیے چھوٹا کاروباری منصوبہ یا ٹیوٹا فنی سرٹیفکیٹ جمع کروائیں۔'
      });
    }
  }

  // 11. Survey-Verified: Benazir Kafaalat (BISP)
  const bisp = getScheme('bisp-kafaalat');
  if (isGovt) {
    survey.push({
      ...bisp,
      status: 'not_eligible_yet',
      statusText: 'Govt Employees Ineligible',
      statusTextUrdu: 'سرکاری ملازمین کے لیے نہیں',
      matchReason: 'Federal BISP legislation excludes government employees and their spouses.',
      matchReasonUrdu: 'وفاقی بی آئی ایس پی قانون کے تحت سرکاری ملازمین اور ان کے اہل خانہ نااہل ہیں۔'
    });
  } else if (data.gender === 'female') {
    if (data.isBispRegistered) {
      survey.push({
        ...bisp,
        status: 'eligible',
        statusText: 'Active in NSER',
        statusTextUrdu: 'این ایس ای آر میں فعال',
        matchReason: 'Registered female head of family with active NSER biometric survey record.',
        matchReasonUrdu: 'خاندان کی رجسٹرڈ خاتون سربراہ جس کا بائیو میٹرک ریکارڈ این ایس ای آر میں فعال ہے۔'
      });
    } else if (data.monthlyIncome <= 60000) {
      survey.push({
        ...bisp,
        status: 'check_officially',
        statusText: 'Check officially',
        statusTextUrdu: 'سرکاری جانچ',
        matchReason: 'Female applicant with income under Rs 60,000. Send CNIC to 8171 to verify your official PMT poverty score.',
        matchReasonUrdu: 'خاتون درخواست گزار جن کی آمدن 60 ہزار سے کم ہے۔ اپنا غربت کا اسکور جاننے کے لیے 8171 پر شناختی کارڈ بھیجیں۔'
      });
    } else {
      survey.push({
        ...bisp,
        status: 'check_officially',
        statusText: 'Check officially',
        statusTextUrdu: 'سرکاری جانچ',
        matchReason: 'Verify PMT score (cutoff <= 32) at nearest BISP Tehsil Center.',
        matchReasonUrdu: 'قریبی تحصیل آفس میں اپنے غربت کے اسکور (PMT <= 32) کی تصدیق کروائیں۔'
      });
    }
  } else {
    survey.push({
      ...bisp,
      status: 'check_officially',
      statusText: 'Female Head Required',
      statusTextUrdu: 'خاتون سربراہ درکار',
      matchReason: 'BISP Kafaalat cash grants are issued exclusively to the adult female head of the family. Adult female members should verify via 8171.',
      matchReasonUrdu: 'بے نظیر کفالت وظیفہ صرف خاندان کی بالغ خاتون سربراہ کے نام جاری ہوتا ہے۔ گھر کی خواتین 8171 پر جانچ کریں۔'
    });
  }

  // 12. Survey-Verified: Benazir Nashonuma
  const nashonuma = getScheme('bisp-nashonuma');
  if (data.hasPregnantOrInfant) {
    survey.push({
      ...nashonuma,
      status: 'check_officially',
      statusText: 'Health Center Check',
      statusTextUrdu: 'ہسپتال میں تصدیق',
      matchReason: 'Pregnant mother or infant present in household. Immediate registration available at DHQ/THQ Hospital Nashonuma Center.',
      matchReasonUrdu: 'گھرانے میں حاملہ خاتون یا 2 سال سے کم عمر بچہ موجود ہے۔ ڈی ایچ کیو یا تحصیل ہسپتال سے فوری رجسٹریشن کروائیں۔'
    });
  } else {
    pending.push({
      ...nashonuma,
      status: 'not_eligible_yet',
      statusText: 'Maternal Criterion Required',
      statusTextUrdu: 'ماں اور بچے کی شرط درکار',
      matchReason: 'Exclusively for households with pregnant/lactating mothers or children under 24 months.',
      matchReasonUrdu: 'یہ پروگرام صرف حاملہ و دودھ پلانے والی ماؤں یا 2 سال سے کم عمر بچوں والے گھرانوں کے لیے ہے۔'
    });
  }

  const totalReviewed = direct.length + survey.length + pending.length;

  return {
    eligibleDirect: direct,
    surveyCheck: survey,
    pendingReq: pending,
    totalReviewed
  };
}
