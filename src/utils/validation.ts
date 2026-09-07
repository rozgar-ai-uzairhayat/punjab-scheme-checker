import { CitizenData, Language } from '../types';

export interface ValidationItem {
  id: string;
  step: 1 | 2 | 3;
  field: string;
  severity: 'error' | 'warning' | 'info' | 'pass';
  titleEn: string;
  titleUr: string;
  messageEn: string;
  messageUr: string;
  impactEn?: string;
  impactUr?: string;
  suggestedFix?: {
    labelEn: string;
    labelUr: string;
    action: Partial<CitizenData>;
  };
}

export interface ValidationReport {
  isValid: boolean; // True if no blocking errors
  score: number; // 0 - 100
  errorCount: number;
  warningCount: number;
  passCount: number;
  step1Valid: boolean;
  step2Valid: boolean;
  step3Valid: boolean;
  step1Errors: string[];
  step2Errors: string[];
  step3Errors: string[];
  items: ValidationItem[];
}

export function validateCitizenData(data: CitizenData, lang: Language = 'en'): ValidationReport {
  const items: ValidationItem[] = [];

  // ==========================================
  // STEP 1 VALIDATIONS: HOUSEHOLD & FINANCIAL
  // ==========================================

  // 1. Income Check
  if (data.monthlyIncome === undefined || data.monthlyIncome === null || isNaN(data.monthlyIncome)) {
    items.push({
      id: 'income-empty',
      step: 1,
      field: 'monthlyIncome',
      severity: 'error',
      titleEn: 'Monthly Income Required',
      titleUr: 'ماہانہ آمدنی درکار ہے',
      messageEn: 'Please specify your combined monthly household income.',
      messageUr: 'براہ کرم اپنے گھرانے کی کل ماہانہ آمدنی درج کریں۔',
      impactEn: 'Required to determine welfare cutoff thresholds.',
      impactUr: 'فلاحی اسکیموں کی حد کے تعین کے لیے لازمی ہے۔',
      suggestedFix: {
        labelEn: 'Set to Punjab average (₨ 45,000)',
        labelUr: 'پنجاب اوسط (45,000 روپے) درج کریں',
        action: { monthlyIncome: 45000 }
      }
    });
  } else if (data.monthlyIncome <= 0) {
    items.push({
      id: 'income-zero',
      step: 1,
      field: 'monthlyIncome',
      severity: 'error',
      titleEn: 'Invalid Monthly Income',
      titleUr: 'آمدنی کی غلط مقدار',
      messageEn: 'Monthly income must be greater than 0.',
      messageUr: 'ماہانہ آمدنی صفر سے زیادہ ہونی چاہیے۔',
      impactEn: 'Zero income inputs cannot be calculated against official brackets.',
      impactUr: 'صفر آمدنی کا سرکاری آمدنی سلیب کے ساتھ موازنہ ممکن نہیں۔',
      suggestedFix: {
        labelEn: 'Set to Minimum Wage (₨ 37,000)',
        labelUr: 'کم از کم اجرت (37,000 روپے) منتخب کریں',
        action: { monthlyIncome: 37000 }
      }
    });
  } else if (data.monthlyIncome > 500000) {
    items.push({
      id: 'income-high',
      step: 1,
      field: 'monthlyIncome',
      severity: 'warning',
      titleEn: 'High Household Income',
      titleUr: 'زیادہ ماہانہ آمدنی',
      messageEn: 'Reported monthly income exceeds Rs 500,000. Most targeted poverty and subsidized schemes have a maximum ceiling of Rs 60,000 to Rs 300,000.',
      messageUr: 'درج کردہ آمدنی 5 لاکھ روپے سے زیادہ ہے۔ اکثر فلاحی اسکیموں کی زیادہ سے زیادہ حد 60 ہزار سے 3 لاکھ روپے ہے۔',
      impactEn: 'Citizen will be disqualified from BISP, Nigahban, ACAG Housing, and Honhaar Scholarship.',
      impactUr: 'بی آئی ایس پی، نگہبان، اپنی چھت اپنا گھر اور ہونہار اسکالرشپ کے لیے نااہل ہو سکتے ہیں۔'
    });
  } else if (data.monthlyIncome <= 60000) {
    items.push({
      id: 'income-optimal',
      step: 1,
      field: 'monthlyIncome',
      severity: 'pass',
      titleEn: 'Low-Income Relief Threshold Met',
      titleUr: 'کم آمدنی ریلیف معیار پر پورا',
      messageEn: 'Income is under Rs 60,000/month, qualifying for maximum targeted social assistance.',
      messageUr: 'ماہانہ آمدنی 60 ہزار روپے سے کم ہے جو ہدف شدہ فلاحی امداد کے لیے موزوں ہے۔',
      impactEn: 'Direct match for CM Nigahban Card and Roshan Gharana Solar priority.',
      impactUr: 'وزیراعلیٰ نگہبان کارڈ اور روشن گھرانہ سولر اسکیم کے لیے براہ راست موزوں۔'
    });
  }

  // 2. Household Size Check
  if (!data.householdSize || data.householdSize < 1) {
    items.push({
      id: 'household-invalid',
      step: 1,
      field: 'householdSize',
      severity: 'error',
      titleEn: 'Invalid Household Size',
      titleUr: 'گھر کے افراد کی غلط تعداد',
      messageEn: 'Household size must be at least 1 person.',
      messageUr: 'گھرانے میں کم از کم 1 فرد کا ہونا لازمی ہے۔',
      impactEn: 'Per-capita poverty metrics cannot be evaluated.',
      impactUr: 'فی کس غربت کا تعین نہیں کیا جا سکتا۔',
      suggestedFix: {
        labelEn: 'Set to Punjab average (5 members)',
        labelUr: 'پنجاب کی اوسط (5 افراد) منتخب کریں',
        action: { householdSize: 5 }
      }
    });
  } else if (data.householdSize > 20) {
    items.push({
      id: 'household-large',
      step: 1,
      field: 'householdSize',
      severity: 'warning',
      titleEn: 'Large Household Verified',
      titleUr: 'بہت بڑا گھرانہ',
      messageEn: 'Household size exceeds 20 persons. Ensure this reflects immediate dependent family under one kitchen.',
      messageUr: 'افراد کی تعداد 20 سے زیادہ ہے۔ تسلی کر لیں کہ یہ ایک ہی چولہے پر منحصر گھرانہ ہے۔',
      impactEn: 'NSER field verification checks joint household composition.',
      impactUr: 'این ایس ای آر سروے مشترکہ گھرانے کی تصدیق کرتا ہے۔'
    });
  } else {
    items.push({
      id: 'household-pass',
      step: 1,
      field: 'householdSize',
      severity: 'pass',
      titleEn: 'Household Size Standard',
      titleUr: 'گھرانے کے افراد کا درست معیار',
      messageEn: `${data.householdSize} members recorded. Aligns with provincial demographic parameters.`,
      messageUr: `${data.householdSize} افراد درج کیے گئے۔ صوبائی خاندانی معیار کے مطابق درست ہے۔`
    });
  }

  // 3. Electricity Check
  if (data.electricityUnits === 'under_200') {
    items.push({
      id: 'electricity-protected',
      step: 1,
      field: 'electricityUnits',
      severity: 'pass',
      titleEn: 'Protected Electricity Bracket',
      titleUr: 'محفوظ بجلی کیٹگری',
      messageEn: 'Under 200 monthly units qualifies for 90% government solar subsidy.',
      messageUr: '200 سے کم یونٹس حکومت کی 90 فیصد سولر سبسڈی کے لیے اہل ہیں۔',
      impactEn: 'Qualifies for CM Roshan Gharana 1KW solar panel systems.',
      impactUr: 'وزیراعلیٰ روشن گھرانہ 1 کے وی سولر پینل سسٹم کے لیے اہل۔'
    });
  } else if (data.electricityUnits === 'above_500') {
    items.push({
      id: 'electricity-high',
      step: 1,
      field: 'electricityUnits',
      severity: 'warning',
      titleEn: 'High Electricity Consumption',
      titleUr: 'زیادہ بجلی کی کھپت',
      messageEn: 'Exceeds the 500-unit ceiling for subsidized solar systems and Nigahban relief.',
      messageUr: '500 یونٹ سے زائد کھپت حکومتی سولر سبسڈی اور نگہبان ریلیف کی حد سے باہر ہے۔',
      impactEn: 'Ineligible for CM Roshan Gharana Solar Phase 1 & 2.',
      impactUr: 'روشن گھرانہ فیز 1 اور 2 کے لیے نااہل۔'
    });
  }

  // ==========================================
  // STEP 2 VALIDATIONS: DEMOGRAPHICS & LEGAL
  // ==========================================

  // 4. Age Check
  if (!data.age || isNaN(data.age)) {
    items.push({
      id: 'age-empty',
      step: 2,
      field: 'age',
      severity: 'error',
      titleEn: 'Age Required',
      titleUr: 'عمر درکار ہے',
      messageEn: 'Please enter the applicant\'s age.',
      messageUr: 'براہ کرم درخواست گزار کی عمر درج کریں۔',
      impactEn: 'Age is mandatory for youth, student, and pension policies.',
      impactUr: 'یوتھ، طلباء اور پنشن پالیسیوں کے لیے عمر لازمی ہے۔',
      suggestedFix: {
        labelEn: 'Set to adult age (28 years)',
        labelUr: 'بالغ عمر (28 سال) درج کریں',
        action: { age: 28 }
      }
    });
  } else if (data.age < 16) {
    items.push({
      id: 'age-underage',
      step: 2,
      field: 'age',
      severity: 'error',
      titleEn: 'Minimum Age Requirement (16+)',
      titleUr: 'کم از کم عمر کی حد (16+ سال)',
      messageEn: 'Applicant must be at least 16 years old to hold a legal NADRA identity card/Juvenile card.',
      messageUr: 'قانونی شناختی کارڈ یا جووینائل کارڈ کے لیے کم از کم 16 سال عمر لازمی ہے۔',
      impactEn: 'Minors under 16 cannot be primary applicants for provincial schemes.',
      impactUr: '16 سال سے کم عمر افراد صوبائی اسکیموں میں بنیادی درخواست گزار نہیں بن سکتے۔',
      suggestedFix: {
        labelEn: 'Adjust age to 18 (Full adult citizen)',
        labelUr: 'عمر 18 سال (مکمل شہری) کریں',
        action: { age: 18 }
      }
    });
  } else if (data.age > 105) {
    items.push({
      id: 'age-invalid-high',
      step: 2,
      field: 'age',
      severity: 'error',
      titleEn: 'Invalid Age Entered',
      titleUr: 'درج کردہ عمر غلط ہے',
      messageEn: 'Please verify and enter an authentic citizen age.',
      messageUr: 'براہ کرم درست اور مصدقہ عمر درج کریں۔'
    });
  } else {
    items.push({
      id: 'age-pass',
      step: 2,
      field: 'age',
      severity: 'pass',
      titleEn: 'Age Verified for Civil Rights',
      titleUr: 'شہری حقوق کے مطابق عمر مصدقہ',
      messageEn: `Applicant is ${data.age} years old and eligible for citizen program applications.`,
      messageUr: `درخواست گزار کی عمر ${data.age} سال ہے اور وہ اسکیموں کے لیے اہل ہے۔`
    });
  }

  // 5. Domicile Check
  if (!data.isPunjabResident) {
    items.push({
      id: 'domicile-non-punjab',
      step: 2,
      field: 'isPunjabResident',
      severity: 'warning',
      titleEn: 'Non-Punjab Domicile Notice',
      titleUr: 'غیر پنجاب ڈومیسائل اطلاع',
      messageEn: 'Punjab provincial schemes require Punjab domicile/permanent CNIC address. Federal BISP schemes remain accessible.',
      messageUr: 'پنجاب کی صوبائی اسکیموں کے لیے پنجاب ڈومیسائل یا شناختی کارڈ لازمی ہے۔ وفاقی بی آئی ایس پی اسکیمیں کھلی رہیں گی۔',
      impactEn: 'Disqualified from ACAG Housing, Sehat Card Plus (Punjab), Roshan Gharana, and Kisan Card.',
      impactUr: 'اپنی چھت اپنا گھر، صحت کارڈ پنجاب، روشن گھرانہ اور کسان کارڈ کے لیے نااہل۔',
      suggestedFix: {
        labelEn: 'Confirm Punjab Residence (Yes)',
        labelUr: 'پنجاب رہائش کی تصدیق کریں (ہاں)',
        action: { isPunjabResident: true }
      }
    });
  } else {
    items.push({
      id: 'domicile-pass',
      step: 2,
      field: 'isPunjabResident',
      severity: 'pass',
      titleEn: 'Punjab Domicile Confirmed',
      titleUr: 'پنجاب ڈومیسائل کی تصدیق',
      messageEn: 'Eligible for all Government of Punjab provincial welfare and grant programs.',
      messageUr: 'حکومت پنجاب کے تمام فلاحی اور گرانٹ پروگراموں کے لیے اہل ہے۔'
    });
  }

  // 6. Government Employee Check
  if (data.employmentStatus === 'govt_employee') {
    items.push({
      id: 'employment-govt',
      step: 2,
      field: 'employmentStatus',
      severity: 'warning',
      titleEn: 'Civil Servant Statutory Rule',
      titleUr: 'سرکاری ملازمین کا قانونی ضابطہ',
      messageEn: 'Government employees and their immediate spouses are excluded from poverty relief (BISP/Nigahban) by statutory law, but remain eligible for Sehat Card, Solar Scheme, and Housing loans.',
      messageUr: 'سرکاری ملازمین قانون کے تحت بی آئی ایس پی اور نگہبان نقد امداد کے اہل نہیں، تاہم صحت کارڈ، سولر اور ہاؤسنگ قرضوں کے اہل ہیں۔',
      impactEn: 'BISP Kafaalat and CM Nigahban cards will be marked disqualified.',
      impactUr: 'بی آئی ایس پی کفالت اور نگہبان کارڈ نااہل قرار دیے جائیں گے۔'
    });
  }

  // ==========================================
  // STEP 3 VALIDATIONS: TARGETED CROSS-CHECKS
  // ==========================================

  // 7. Motorcycle Learner Permit vs Age (Traffic Law Cross-Check)
  if (data.hasLearnerPermit && data.age < 18) {
    items.push({
      id: 'cross-learner-age',
      step: 3,
      field: 'hasLearnerPermit',
      severity: 'warning',
      titleEn: 'Motorcycle License Age Restriction',
      titleUr: 'ڈرائیونگ لائسنس کی عمر کی پابندی',
      messageEn: 'Punjab Traffic Police regulations mandate a minimum age of 18 for motorcycle driving licenses.',
      messageUr: 'پنجاب ٹریفک پولیس قوانین کے مطابق موٹر سائیکل لائسنس کے لیے کم از کم 18 سال عمر لازمی ہے۔',
      impactEn: 'May cause E-Bike verification rejection during police biometric check.',
      impactUr: 'ای بائیک کی نادرا/پولیس بائیو میٹرک تصدیق میں رکاوٹ بن سکتی ہے۔',
      suggestedFix: {
        labelEn: 'Set age to 18 (Eligible for License)',
        labelUr: 'عمر 18 سال کریں (لائسنس کے لیے اہل)',
        action: { age: 18 }
      }
    });
  }

  // 8. Student Scholarship vs Age (Higher Education Rule)
  if (data.isStudent && data.age > 22) {
    items.push({
      id: 'cross-student-age',
      step: 3,
      field: 'isStudent',
      severity: 'warning',
      titleEn: 'Honhaar Scholarship Age Ceiling (<=22)',
      titleUr: 'ہونہار اسکالرشپ کی زیادہ سے زیادہ عمر (22 سال)',
      messageEn: 'CM Honhaar Undergraduate Scholarship enforces an upper age limit of 22 years at time of application.',
      messageUr: 'وزیراعلیٰ پنجاب ہونہار انڈر گریجویٹ اسکالرشپ میں درخواست کے وقت عمر کی آخری حد 22 سال ہے۔',
      impactEn: 'Honhaar 100% full tuition scholarship will be flagged as age-ineligible, though student E-Bikes may still be accessible.',
      impactUr: 'ہونہار اسکالرشپ نااہل ہو جائے گی، تاہم طالب علم ای بائیک اسکیم میں درخواست دے سکتے ہیں۔',
      suggestedFix: {
        labelEn: 'Set age to 21 (Scholarship Eligible)',
        labelUr: 'عمر 21 سال کریں (اسکالرشپ کے لیے اہل)',
        action: { age: 21 }
      }
    });
  } else if (data.isStudent && data.age <= 22) {
    items.push({
      id: 'student-pass',
      step: 3,
      field: 'isStudent',
      severity: 'pass',
      titleEn: 'Undergraduate Age Alignment Confirmed',
      titleUr: 'طالب علم کی عمر اسکالرشپ معیار کے مطابق',
      messageEn: 'Age (<=22) and undergraduate status match CM Honhaar Scholarship requirements.',
      messageUr: 'عمر (22 سال یا کم) اور طالب علم اسٹیٹس ہونہار اسکالرشپ کے لیے موزوں ہے۔'
    });
  }

  // 9. Farmer vs Agri Land Cross-Check
  if (data.employmentStatus === 'farmer' && !data.ownsAgriLand) {
    items.push({
      id: 'cross-farmer-land',
      step: 3,
      field: 'ownsAgriLand',
      severity: 'warning',
      titleEn: 'Kisan Card PLRA Land Record Required',
      titleUr: 'کسان کارڈ کے لیے زرعی اراضی کا اندراج',
      messageEn: 'You selected Farmer occupation, but did not indicate agricultural landownership or registered tenancy.',
      messageUr: 'آپ نے کسان پیشہ منتخب کیا ہے، لیکن زرعی زمین یا مزارعت کا اندراج منتخب نہیں کیا۔',
      impactEn: 'CM Kisan Card requires verified land ownership/cultivation via Punjab Land Record Authority (PLRA).',
      impactUr: 'کسان کارڈ کے لیے پنجاب لینڈ ریکارڈ اتھارٹی (PLRA) میں زمین کا اندراج لازمی ہے۔',
      suggestedFix: {
        labelEn: 'Check Agricultural Land (Up to 12.5 Acres)',
        labelUr: 'زرعی زمین کی ملکیت منتخب کریں (12.5 ایکڑ تک)',
        action: { ownsAgriLand: true }
      }
    });
  }

  // 10. Apni Chhat Apna Ghar Housing Check
  if (data.ownsSmallPlot && data.monthlyIncome <= 100000 && data.isPunjabResident) {
    items.push({
      id: 'housing-pass',
      step: 1,
      field: 'ownsSmallPlot',
      severity: 'pass',
      titleEn: 'Apni Chhat Apna Ghar (ACAG) Prime Match',
      titleUr: 'اپنی چھت اپنا گھر کے لیے بہترین میچ',
      messageEn: 'Small plot ownership, Punjab residency, and income <= Rs 100,000 meet all official criteria for Rs 1.5M interest-free housing construction loan.',
      messageUr: 'چھوٹے پلاٹ کی ملکیت، پنجاب رہائش اور 1 لاکھ سے کم آمدنی 15 لاکھ روپے بلاسود ہاؤسنگ قرض کی تمام شرائط پوری کرتی ہے۔'
    });
  }

  // Calculate scores and status
  const errors = items.filter((i) => i.severity === 'error');
  const warnings = items.filter((i) => i.severity === 'warning');
  const passes = items.filter((i) => i.severity === 'pass');

  const step1Errors = items.filter((i) => i.step === 1 && i.severity === 'error').map((i) => (lang === 'ur' ? i.messageUr : i.messageEn));
  const step2Errors = items.filter((i) => i.step === 2 && i.severity === 'error').map((i) => (lang === 'ur' ? i.messageUr : i.messageEn));
  const step3Errors = items.filter((i) => i.step === 3 && i.severity === 'error').map((i) => (lang === 'ur' ? i.messageUr : i.messageEn));

  const step1Valid = step1Errors.length === 0;
  const step2Valid = step2Errors.length === 0;
  const step3Valid = step3Errors.length === 0;

  // Score computation: 100 baseline, -30 per error, -10 per warning
  let score = 100;
  score -= errors.length * 35;
  score -= warnings.length * 10;
  score = Math.max(10, Math.min(100, score));

  return {
    isValid: errors.length === 0,
    score,
    errorCount: errors.length,
    warningCount: warnings.length,
    passCount: passes.length,
    step1Valid,
    step2Valid,
    step3Valid,
    step1Errors,
    step2Errors,
    step3Errors,
    items
  };
}
