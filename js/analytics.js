/* ==========================================================================
   سُكّري بلس | الوحدة 7: التقارير والرسوم البيانية (analytics.html)
   محرك الرسم على Canvas: مخطط خطي، دائري (Donut)، وأعمدة
   ========================================================================== */

// الفترة الزمنية النشطة بالأيام (0 = جميع القراءات)
let activePeriodDays = 7;

// هل الوضع الليلي مُفعَّل؟ (لتلوين الرسوم بشكل مناسب)
function isDarkTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

// لوحة ألوان الرسوم حسب الوضع الحالي
function chartPalette() {
  return isDarkTheme() ? {
    grid: '#2A3B4A',
    axisText: '#9DB1C0',
    line: '#5FC1DD',
    titleText: '#E2F0F7'
  } : {
    grid: '#E2E8F0',
    axisText: '#687884',
    line: '#176B87',
    titleText: '#17324D'
  };
}

function initAnalyticsPage() {
  renderAnalytics();

  // أزرار تحديد الفترة
  const periodTabs = document.querySelectorAll('.period-tab');
  periodTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      periodTabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      activePeriodDays = parseInt(e.target.getAttribute('data-period')) || 0;
      renderAnalytics();
    });
  });

  // إعادة الرسم عند تغيير حجم الشاشة
  window.addEventListener('resize', debounce(() => {
    renderAnalytics();
  }, 250));

  // إعادة الرسم عند تبديل الوضع الليلي
  window.addEventListener('themechange', () => {
    renderAnalytics();
  });

  const printReportBtn = document.getElementById('print-report-btn');
  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => window.print());
  }
}

/* ----- 7.1 تجميع وعرض التقرير الكامل ----- */

function renderAnalytics() {
  let readings = getReadings();
  const emptyState = document.getElementById('analytics-empty-state');
  const mainContent = document.getElementById('analytics-main-content');

  if (readings.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (mainContent) mainContent.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (mainContent) mainContent.style.display = 'block';

  // تصفية حسب الفترة الزمنية
  if (activePeriodDays > 0) {
    const cutoff = Date.now() - (activePeriodDays * 86400000);
    readings = readings.filter(r => r.createdAt >= cutoff);
  }

  // فرز زمني
  readings.sort((a, b) => a.createdAt - b.createdAt);

  // تحديث بطاقات ملخص التقارير
  updateAnalyticsStats(readings);

  // رسم المخططات على Canvas
  const lineCanvas = document.getElementById('lineChart');
  const pieCanvas = document.getElementById('pieChart');
  const barCanvas = document.getElementById('barChart');

  if (lineCanvas) drawLineChart(lineCanvas, readings);
  if (pieCanvas) drawPieChart(pieCanvas, readings);
  if (barCanvas) drawBarChart(barCanvas, readings);

  // توليد ملخص النمط القائم على البيانات
  generatePatternSummary(readings);
}

// تحديث بطاقات الملخص: متوسط، أعلى، أقل، نسبة الهدف
function updateAnalyticsStats(readings) {
  const avgEl = document.getElementById('rep-avg');
  const maxEl = document.getElementById('rep-max');
  const minEl = document.getElementById('rep-min');
  const countEl = document.getElementById('rep-count');
  const targetPctEl = document.getElementById('rep-target-pct');

  if (readings.length === 0) return;

  const values = readings.map(r => r.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / readings.length);

  if (avgEl) avgEl.textContent = `${avg} mg/dL`;
  if (maxEl) maxEl.textContent = `${Math.max(...values)} mg/dL`;
  if (minEl) minEl.textContent = `${Math.min(...values)} mg/dL`;
  if (countEl) countEl.textContent = readings.length;

  const targetCount = readings.filter(r => r.status === 'target').length;
  const pct = Math.round((targetCount / readings.length) * 100);
  if (targetPctEl) targetPctEl.textContent = `${pct}%`;
}

/* ----- 7.2 المخطط الخطي (Line Chart) ----- */
function drawLineChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  ctx.clearRect(0, 0, width, height);

  if (data.length === 0) return;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // حد أقصى وأدنى للشبكة
  const minY = 40;
  const maxY = Math.max(...data.map(d => d.value), 220);
  const palette = chartPalette();

  // رسم خطوط الشبكة الأفقية
  const gridSteps = [70, 130, 180, 220];
  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = palette.axisText;
  ctx.font = '11px Cairo';

  gridSteps.forEach(val => {
    const y = padding.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    ctx.fillText(`${val}`, 15, y + 4);
  });

  // خطوط الحدود المرجعية (70 و 180)
  const y70 = padding.top + chartHeight - ((70 - minY) / (maxY - minY)) * chartHeight;
  const y180 = padding.top + chartHeight - ((180 - minY) / (maxY - minY)) * chartHeight;

  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#2E9F6B';
  ctx.beginPath();
  ctx.moveTo(padding.left, y70);
  ctx.lineTo(width - padding.right, y70);
  ctx.stroke();

  ctx.strokeStyle = '#D94B4B';
  ctx.beginPath();
  ctx.moveTo(padding.left, y180);
  ctx.lineTo(width - padding.right, y180);
  ctx.stroke();
  ctx.setLineDash([]); // إعادة التعيين

  // نقاط الخط
  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.value - minY) / (maxY - minY)) * chartHeight;
    return { x, y, value: d.value, status: d.status, date: d.date };
  });

  // تدرج تعبئة أسفل المنحنى
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, isDarkTheme() ? 'rgba(95, 193, 221, 0.30)' : 'rgba(23, 107, 135, 0.25)');
  gradient.addColorStop(1, 'rgba(23, 107, 135, 0.0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
  ctx.lineTo(points[0].x, padding.top + chartHeight);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // رسم المنحنى
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 3;
  ctx.stroke();

  // رسم النقاط الملونة
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    if (p.status === 'target') ctx.fillStyle = '#2E9F6B';
    else if (p.status === 'high') ctx.fillStyle = '#D94B4B';
    else if (p.status === 'low') ctx.fillStyle = '#F28C45';
    else ctx.fillStyle = '#E8B84A';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

/* ----- 7.3 المخطط الدائري (Pie/Donut Chart) ----- */
function drawPieChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  if (data.length === 0) return;

  const counts = {
    target: data.filter(d => d.status === 'target').length,
    high: data.filter(d => d.status === 'high').length,
    low: data.filter(d => d.status === 'low').length,
    borderline: data.filter(d => d.status === 'borderline').length
  };

  const colors = {
    target: '#2E9F6B',
    high: '#D94B4B',
    low: '#F28C45',
    borderline: '#E8B84A'
  };

  const total = data.length;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2.5;
  const innerRadius = radius * 0.6; // Donut style

  let startAngle = -Math.PI / 2;

  Object.keys(counts).forEach(key => {
    const sliceAngle = (counts[key] / total) * (Math.PI * 2);
    if (sliceAngle > 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[key];
      ctx.fill();
      startAngle += sliceAngle;
    }
  });

  // النص في المنتصف
  ctx.fillStyle = chartPalette().titleText;
  ctx.font = 'bold 16px Cairo';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${total} قراءة`, centerX, centerY);
}

/* ----- 7.4 مخطط الأعمدة (Bar Chart) ----- */
function drawBarChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  if (data.length === 0) return;

  const types = ['fasting', 'pre_meal', 'post_meal', 'bedtime', 'random'];
  const labels = ['صائم', 'قبل وجبة', 'بعد وجبة', 'قبل نوم', 'عشوائي'];

  const typeAvgs = types.map(t => {
    const filtered = data.filter(d => d.type === t);
    if (filtered.length === 0) return 0;
    return Math.round(filtered.reduce((acc, curr) => acc + curr.value, 0) / filtered.length);
  });

  const padding = { top: 30, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxVal = Math.max(...typeAvgs, 200);
  const palette = chartPalette();

  const barWidth = (chartWidth / types.length) * 0.5;

  typeAvgs.forEach((avg, i) => {
    const x = padding.left + (i * (chartWidth / types.length)) + (chartWidth / types.length - barWidth) / 2;
    const barH = (avg / maxVal) * chartHeight;
    const y = padding.top + chartHeight - barH;

    // رسم العمود
    ctx.fillStyle = palette.line;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]) : ctx.rect(x, y, barWidth, barH);
    ctx.fill();

    // القيمة فوق العمود
    if (avg > 0) {
      ctx.fillStyle = palette.titleText;
      ctx.font = 'bold 12px Cairo';
      ctx.textAlign = 'center';
      ctx.fillText(`${avg}`, x + barWidth / 2, y - 8);
    }

    // التسمية أسفل العمود
    ctx.fillStyle = palette.axisText;
    ctx.font = '11px Cairo';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - 15);
  });
}

/* ----- 7.5 ملخص النمط الآلي ----- */

function generatePatternSummary(readings) {
  const container = document.getElementById('pattern-summary-text');
  if (!container) return;

  if (readings.length < 3) {
    container.textContent = "لا توجد بيانات كافية حالياً لتكوين نمط دقيق. سجل المزيد من القراءات لاستعراض ملخص الاتجاهات.";
    return;
  }

  const targetCount = readings.filter(r => r.status === 'target').length;
  const highCount = readings.filter(r => r.status === 'high').length;
  const lowCount = readings.filter(r => r.status === 'low').length;
  const targetPct = Math.round((targetCount / readings.length) * 100);

  let summary = "";

  if (targetPct >= 70) {
    summary += `أداء ممتاز! أكثر من ${targetPct}% من القراءات المسجلة خلال هذه الفترة تقع ضمن النطاق المستهدف. `;
  } else if (highCount > targetCount) {
    summary += `يُلاحظ وجود ارتفاعات متكررة في القراءات المسجلة، خاصة بعد الوجبات. ينصح بمراجعة الخطة الغذائية. `;
  } else if (lowCount > 2) {
    summary += `تنبه وجود عدة قراءات منخفضة (أقل من 70 mg/dL). يرجى الانتباه ومراجعة الطبيب لتجنب هبوط السكر. `;
  } else {
    summary += `القراءات تتراوح بين الارتفاع والاعتدال. مراجعة متوسطات التوقيت تساعدك على استهداف الفترات الأكثر تقلبًا. `;
  }

  summary += " تنبيه: هذا الملخص آلي استرشادي ولا يغني عن التقييم الطبي المباشر.";

  container.textContent = summary;
}