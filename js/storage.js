/* ==========================================================================
   سُكّري بلس | الوحدة 2: التخزين المحلي (LocalStorage)
   إدارة حفظ واسترجاع القراءات في المتصفح + البيانات التجريبية
   ========================================================================== */

// مفاتيح التخزين
const STORAGE_KEY = 'sukkari_plus_readings';
const INIT_KEY = 'sukkariPlusInitialized';

// قائمة البيانات التجريبية الأولية (12 قراءة متنوعة لمبارهنة النظام)
const DEMO_READINGS = [
  { id: '1', value: 115, unit: 'mg/dL', type: 'fasting', date: getRelativeDate(-13), time: '07:30', notes: 'قياس صباحي بعد الصيام 8 ساعات', status: 'target', createdAt: Date.now() - 13*86400000 },
  { id: '2', value: 165, unit: 'mg/dL', type: 'post_meal', date: getRelativeDate(-12), time: '14:15', notes: 'بعد وجبة الغداء الساخنة', status: 'target', createdAt: Date.now() - 12*86400000 },
  { id: '3', value: 65,  unit: 'mg/dL', type: 'fasting', date: getRelativeDate(-10), time: '07:15', notes: 'شعور بخفة وتعب طفيف', status: 'low', createdAt: Date.now() - 10*86400000 },
  { id: '4', value: 142, unit: 'mg/dL', type: 'fasting', date: getRelativeDate(-9),  time: '08:00', notes: 'بعد عشاء متأخر', status: 'high', createdAt: Date.now() - 9*86400000 },
  { id: '5', value: 120, unit: 'mg/dL', type: 'pre_meal', date: getRelativeDate(-8),  time: '13:00', notes: 'قبل الوجبة الرئيسية', status: 'target', createdAt: Date.now() - 8*86400000 },
  { id: '6', value: 195, unit: 'mg/dL', type: 'post_meal', date: getRelativeDate(-7), time: '15:30', notes: 'تناول قطعتين حلوى', status: 'high', createdAt: Date.now() - 7*86400000 },
  { id: '7', value: 76,  unit: 'mg/dL', type: 'fasting', date: getRelativeDate(-6),  time: '07:45', notes: 'قريب من النطاق الأدنى', status: 'borderline', createdAt: Date.now() - 6*86400000 },
  { id: '8', value: 110, unit: 'mg/dL', type: 'bedtime', date: getRelativeDate(-5),  time: '22:30', notes: 'قبل النوم مباشرة', status: 'target', createdAt: Date.now() - 5*86400000 },
  { id: '9', value: 135, unit: 'mg/dL', type: 'random',  date: getRelativeDate(-4),  time: '17:00', notes: 'قياس أثناء العمل', status: 'target', createdAt: Date.now() - 4*86400000 },
  { id: '10', value: 108, unit: 'mg/dL', type: 'fasting', date: getRelativeDate(-3), time: '07:20', notes: 'صيام ممتاز وحالة جيدة', status: 'target', createdAt: Date.now() - 3*86400000 },
  { id: '11', value: 155, unit: 'mg/dL', type: 'post_meal', date: getRelativeDate(-1), time: '14:00', notes: 'وجبة متوازنة غنية بالألياف', status: 'target', createdAt: Date.now() - 1*86400000 },
  { id: '12', value: 118, unit: 'mg/dL', type: 'fasting', date: getTodayDate(),     time: '07:30', notes: 'قياس اليوم الصباحي', status: 'target', createdAt: Date.now() }
];

/* ----- 2.1 التهيئة الأولى ----- */

// يفُعّل في أول زيارة فقط: يحمّل البيانات التجريبية كي يعرض النظام أمثلة ملموسة
function initLocalStorage() {
  try {
    if (!localStorage.getItem(INIT_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_READINGS));
      localStorage.setItem(INIT_KEY, 'true');
    }
  } catch (e) {
    console.error('تعذر الوصول إلى localStorage:', e);
  }
}

/* ----- 2.2 قراءة وحفظ البيانات ----- */

function getReadings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('خطأ في قراءة البيانات:', e);
    return [];
  }
}

function saveReadings(readings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
    return true;
  } catch (e) {
    console.error('خطأ في حفظ البيانات:', e);
    showToast('تعذر حفظ البيانات في المتصفح', 'error');
    return false;
  }
}

/* ----- 2.3 استعادة البيانات التجريبية ----- */

function resetDemoData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_READINGS));
  showToast('تمت استعادة البيانات التجريبية بنجاح', 'success');
  setTimeout(() => window.location.reload(), 800);
}