/* ==========================================================================
   سُكّري بلس | الوحدة 5: الصفحة الرئيسية (index.html)
   الإحصائيات السريعة ونصيحة اليوم المتغيرة
   ========================================================================== */

// نصائح صحية متغيرة للصفحة الرئيسية
const DAILY_TIPS = [
  "سجّل وقت القياس وحالة الوجبة بدقة للمساعدة في فهم نمط تغير السكر.",
  "راجع نمط القراءات الأسبوعي بدلاً من الاعتماد على قراءة واحدة منفصلة.",
  "المشي لمستمدة 15-30 دقيقة بعد الوجبة يساعد على تنظيم مستويات السكر.",
  "شرب الماء بكميات كافية يدعم الوظائف الحيوية والتوازن الصحي.",
  "احرص على اتباع النطاق المخصص لك من قبل فريقك الطبي المباشر."
];

function initHomePage() {
  const readings = getReadings();

  // إحصائيات سريعة
  const totalEl = document.getElementById('stat-total-readings');
  const avg7El = document.getElementById('stat-7day-avg');
  const targetPctEl = document.getElementById('stat-target-percent');
  const lastValEl = document.getElementById('stat-last-value');

  if (readings.length > 0) {
    if (totalEl) totalEl.textContent = readings.length;

    // متوسط آخر 7 أيام
    const last7Days = readings.filter(r => (Date.now() - r.createdAt) <= 7 * 86400000);
    const avg7 = last7Days.length > 0
      ? Math.round(last7Days.reduce((acc, curr) => acc + curr.value, 0) / last7Days.length)
      : Math.round(readings.reduce((acc, curr) => acc + curr.value, 0) / readings.length);
    if (avg7El) avg7El.textContent = avg7 + ' mg/dL';

    // نسبة ضمن الهدف
    const targetCount = readings.filter(r => r.status === 'target').length;
    const targetPct = Math.round((targetCount / readings.length) * 100);
    if (targetPctEl) targetPctEl.textContent = targetPct + '%';

    // آخر قراءة
    const latest = readings[readings.length - 1];
    if (lastValEl) lastValEl.textContent = latest.value + ' mg/dL';
  }

  // تدوير نصيحة اليوم
  const tipTextEl = document.getElementById('daily-tip-text');
  if (tipTextEl) {
    const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    tipTextEl.textContent = randomTip;
  }
}