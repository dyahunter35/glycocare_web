/* ==========================================================================
   سُكّري بلس | الوحدة 6: لوحة القياسات (dashboard.html)
   النموذج، التصنيف الفوري، السجل الكامل (إضافة/تعديل/حذف/تصدير)
   ========================================================================== */

// يحتفظ بمعرّف القراءة الجاري تعديلها (null = إضافة جديدة)
let editingReadingId = null;

function initDashboardPage() {
  const form = document.getElementById('glucose-form');
  const dateInput = document.getElementById('reading-date');
  const timeInput = document.getElementById('reading-time');

  // تعبئة الوقت والتاريخ التلقائي
  if (dateInput && !dateInput.value) dateInput.value = getTodayDate();
  if (timeInput && !timeInput.value) timeInput.value = getCurrentTime();

  // تحديث البطاقات العلوية والسجل
  updateDashboardStats();
  renderReadingsTable();

  // تحليل فوري عند تغيير القيمة أو النوع
  const valueInput = document.getElementById('reading-value');
  const typeSelect = document.getElementById('reading-type');
  const analyzeBtn = document.getElementById('analyze-btn');

  if (valueInput && typeSelect) {
    [valueInput, typeSelect].forEach(el => {
      el.addEventListener('input', previewClassification);
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      previewClassification(true);
    });
  }

  // تسليم النموذج للحفظ
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveFormReading();
    });

    const resetBtn = document.getElementById('reset-form-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        editingReadingId = null;
        form.reset();
        if (dateInput) dateInput.value = getTodayDate();
        if (timeInput) timeInput.value = getCurrentTime();
        hideClassificationResult();
      });
    }
  }

  // أدوات السجل: البحث والتصفية
  const searchInput = document.getElementById('table-search');
  const filterStatus = document.getElementById('filter-status');
  const filterType = document.getElementById('filter-type');
  const sortOrder = document.getElementById('sort-order');

  if (searchInput) searchInput.addEventListener('input', renderReadingsTable);
  if (filterStatus) filterStatus.addEventListener('change', renderReadingsTable);
  if (filterType) filterType.addEventListener('change', renderReadingsTable);
  if (sortOrder) sortOrder.addEventListener('change', renderReadingsTable);

  // أزرار التصدير والطباعة واستعادة البيانات
  const exportBtn = document.getElementById('export-csv-btn');
  const printBtn = document.getElementById('print-log-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const restoreDemoBtn = document.getElementById('restore-demo-btn');

  if (exportBtn) exportBtn.addEventListener('click', exportToCSV);
  if (printBtn) printBtn.addEventListener('click', () => window.print());
  if (clearAllBtn) clearAllBtn.addEventListener('click', confirmClearAllReadings);
  if (restoreDemoBtn) restoreDemoBtn.addEventListener('click', resetDemoData);
}

/* ----- 6.1 البطاقات الإحصائية العلوية ----- */

function updateDashboardStats() {
  const readings = getReadings();
  const lastEl = document.getElementById('dash-last-reading');
  const todayAvgEl = document.getElementById('dash-today-avg');
  const maxEl = document.getElementById('dash-max-reading');
  const minEl = document.getElementById('dash-min-reading');

  if (readings.length === 0) {
    if (lastEl) lastEl.textContent = '--';
    if (todayAvgEl) todayAvgEl.textContent = '--';
    if (maxEl) maxEl.textContent = '--';
    if (minEl) minEl.textContent = '--';
    return;
  }

  // آخر قراءة
  const latest = readings[readings.length - 1];
  if (lastEl) lastEl.textContent = `${latest.value} mg/dL`;

  // متوسط اليوم
  const todayStr = getTodayDate();
  const todayReadings = readings.filter(r => r.date === todayStr);
  if (todayAvgEl) {
    if (todayReadings.length > 0) {
      const avg = Math.round(todayReadings.reduce((acc, curr) => acc + curr.value, 0) / todayReadings.length);
      todayAvgEl.textContent = `${avg} mg/dL`;
    } else {
      todayAvgEl.textContent = 'لا توجد اليوم';
    }
  }

  // أعلى وأقل قراءة
  const values = readings.map(r => r.value);
  if (maxEl) maxEl.textContent = `${Math.max(...values)} mg/dL`;
  if (minEl) minEl.textContent = `${Math.min(...values)} mg/dL`;
}

/* ----- 6.2 التصنيف الفوري أثناء الإدخال ----- */

function previewClassification(showToastOnCheck = false) {
  const valInput = document.getElementById('reading-value');
  const typeSelect = document.getElementById('reading-type');
  const errorMsg = document.getElementById('value-error-msg');
  const resultCard = document.getElementById('result-card');

  if (!valInput || !typeSelect) return;

  const value = parseFloat(valInput.value);
  const type = typeSelect.value;

  if (isNaN(value) || value < 20 || value > 600) {
    if (valInput.value !== '') {
      errorMsg.classList.add('visible');
    } else {
      errorMsg.classList.remove('visible');
    }
    hideClassificationResult();
    return;
  }

  errorMsg.classList.remove('visible');
  const info = classifyGlucose(value, type);

  if (info && resultCard) {
    resultCard.classList.add('visible');
    resultCard.style.backgroundColor = info.bgColor;
    resultCard.style.borderColor = info.color;

    document.getElementById('result-title').textContent = info.title;
    document.getElementById('result-title').style.color = info.color;
    document.getElementById('result-value').textContent = `${value} mg/dL`;
    document.getElementById('result-desc').textContent = info.msg;
    document.getElementById('result-icon').className = `fas ${info.icon}`;
    document.getElementById('result-icon').style.color = info.color;

    // شريط النطاق البصري
    const percentage = Math.min(Math.max(((value - 40) / (250 - 40)) * 100, 5), 100);
    const rangeFill = document.getElementById('result-range-fill');
    if (rangeFill) {
      rangeFill.style.width = `${percentage}%`;
      rangeFill.style.backgroundColor = info.color;
    }

    if (showToastOnCheck === true) {
      showToast(`تم تحليل القراءة: ${info.title}`, 'info');
    }
  }
}

function hideClassificationResult() {
  const resultCard = document.getElementById('result-card');
  if (resultCard) resultCard.classList.remove('visible');
}

/* ----- 6.3 حفظ قراءة جديدة أو تعديل قائمة ----- */

function saveFormReading() {
  const valInput = document.getElementById('reading-value');
  const unitSelect = document.getElementById('reading-unit');
  const typeSelect = document.getElementById('reading-type');
  const dateInput = document.getElementById('reading-date');
  const timeInput = document.getElementById('reading-time');
  const notesInput = document.getElementById('reading-notes');

  const value = parseFloat(valInput.value);
  if (isNaN(value) || value < 20 || value > 600) {
    showToast('يرجى إدخال قيمة قراءة صحيحة بين 20 و 600 mg/dL', 'error');
    return;
  }

  const type = typeSelect.value;
  const classification = classifyGlucose(value, type);
  const status = classification ? classification.status : 'target';

  const readings = getReadings();

  if (editingReadingId) {
    // تعديل قراءة موجودة
    const index = readings.findIndex(r => r.id === editingReadingId);
    if (index !== -1) {
      readings[index] = {
        ...readings[index],
        value: value,
        unit: unitSelect.value,
        type: type,
        date: dateInput.value || getTodayDate(),
        time: timeInput.value || getCurrentTime(),
        notes: notesInput.value.trim(),
        status: status
      };
      showToast('تم تعديل القراءة بنجاح', 'success');
    }
    editingReadingId = null;
  } else {
    // إضافة قراءة جديدة
    const newReading = {
      id: Date.now().toString(),
      value: value,
      unit: unitSelect.value || 'mg/dL',
      type: type,
      date: dateInput.value || getTodayDate(),
      time: timeInput.value || getCurrentTime(),
      notes: notesInput.value.trim(),
      status: status,
      createdAt: Date.now()
    };
    readings.push(newReading);
    showToast('تم حفظ القراءة الجديدة بنجاح', 'success');
  }

  saveReadings(readings);
  document.getElementById('glucose-form').reset();
  dateInput.value = getTodayDate();
  timeInput.value = getCurrentTime();
  hideClassificationResult();
  updateDashboardStats();
  renderReadingsTable();
}

/* ----- 6.4 عرض جدول السجل مع البحث والتصفية ----- */

function renderReadingsTable() {
  const tbody = document.getElementById('readings-tbody');
  const emptyState = document.getElementById('table-empty-state');
  if (!tbody) return;

  let readings = getReadings();

  // تصفية وبحث
  const searchVal = (document.getElementById('table-search')?.value || '').toLowerCase();
  const filterStatusVal = document.getElementById('filter-status')?.value || 'all';
  const filterTypeVal = document.getElementById('filter-type')?.value || 'all';
  const sortOrderVal = document.getElementById('sort-order')?.value || 'newest';

  if (filterStatusVal !== 'all') {
    readings = readings.filter(r => r.status === filterStatusVal);
  }

  if (filterTypeVal !== 'all') {
    readings = readings.filter(r => r.type === filterTypeVal);
  }

  if (searchVal) {
    readings = readings.filter(r =>
      r.value.toString().includes(searchVal) ||
      (r.notes && r.notes.toLowerCase().includes(searchVal)) ||
      r.date.includes(searchVal)
    );
  }

  // الترتيب
  readings.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const timeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return sortOrderVal === 'newest' ? timeB - timeA : timeA - timeB;
  });

  tbody.innerHTML = '';

  if (readings.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  readings.forEach(r => {
    const tr = document.createElement('tr');

    // شارة الحالة
    let badgeHTML = '';
    if (r.status === 'target') badgeHTML = `<span class="badge badge-target"><i class="fas fa-check-circle"></i> ضمن الهدف</span>`;
    else if (r.status === 'high') badgeHTML = `<span class="badge badge-high"><i class="fas fa-arrow-up"></i> مرتفع</span>`;
    else if (r.status === 'low') badgeHTML = `<span class="badge badge-low"><i class="fas fa-arrow-down"></i> منخفض</span>`;
    else badgeHTML = `<span class="badge badge-borderline"><i class="fas fa-exclamation"></i> أقل من الهدف</span>`;

    // تسمية نوع القياس بالعربية
    const typeNames = {
      fasting: 'صائم',
      pre_meal: 'قبل الوجبة',
      post_meal: 'بعد الوجبة',
      bedtime: 'قبل النوم',
      random: 'قياس عشوائي'
    };

    tr.innerHTML = `
      <td data-label="القراءة"><strong>${r.value}</strong> ${r.unit || 'mg/dL'}</td>
      <td data-label="الحالة">${badgeHTML}</td>
      <td data-label="نوع القياس">${typeNames[r.type] || r.type}</td>
      <td data-label="التاريخ">${r.date}</td>
      <td data-label="الوقت">${r.time || '--'}</td>
      <td data-label="الملاحظات">${r.notes || '<span style="color:var(--text-light)">--</span>'}</td>
      <td data-label="الإجراءات">
        <div class="action-btns">
          <button class="icon-btn" title="تفاصيل" onclick="showReadingDetails('${r.id}')"><i class="fas fa-eye"></i></button>
          <button class="icon-btn" title="تعديل" onclick="editReading('${r.id}')"><i class="fas fa-edit"></i></button>
          <button class="icon-btn danger" title="حذف" onclick="confirmDeleteReading('${r.id}')"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ----- 6.5 عمليات التعديل والعرض والحذف ----- */

// تحميل بيانات قراءة في النموذج للتعديل
window.editReading = function(id) {
  const readings = getReadings();
  const item = readings.find(r => r.id === id);
  if (!item) return;

  editingReadingId = id;
  document.getElementById('reading-value').value = item.value;
  document.getElementById('reading-unit').value = item.unit || 'mg/dL';
  document.getElementById('reading-type').value = item.type;
  document.getElementById('reading-date').value = item.date;
  document.getElementById('reading-time').value = item.time;
  document.getElementById('reading-notes').value = item.notes || '';

  previewClassification();
  window.scrollTo({ top: document.getElementById('glucose-form').offsetTop - 100, behavior: 'smooth' });
  showToast('تم تحميل بيانات القراءة للتعديل', 'info');
};

// عرض تفاصيل قراءة بالنافذة المنبثقة
window.showReadingDetails = function(id) {
  const readings = getReadings();
  const item = readings.find(r => r.id === id);
  if (!item) return;

  const info = classifyGlucose(item.value, item.type);
  const typeNames = { fasting: 'صائم', pre_meal: 'قبل الوجبة', post_meal: 'بعد الوجبة', bedtime: 'قبل النوم', random: 'عشوائي' };

  const contentHTML = `
    <div style="text-align:center; margin-bottom:1.5rem">
      <div style="font-size:3rem; font-weight:900; color:${info ? info.color : 'var(--primary-blue)'}">${item.value} <span style="font-size:1.2rem; font-weight:600">mg/dL</span></div>
      <div style="margin-top:0.5rem">${info ? `<span class="badge badge-${info.status}">${info.title}</span>` : ''}</div>
    </div>
    <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.95rem">
      <div><strong>توقيت القياس:</strong> ${typeNames[item.type] || item.type}</div>
      <div><strong>التاريخ والوقت:</strong> ${item.date} - ${item.time || '--'}</div>
      <div><strong>الملاحظات:</strong> ${item.notes || 'لا توجد ملاحظات مسجلة.'}</div>
      <div style="margin-top:1rem; padding:0.85rem; background:var(--bg-app); border-radius:8px; font-size:0.85rem; color:var(--text-muted)">
        ${info ? info.msg : ''}
      </div>
    </div>
  `;

  openModal('تفاصيل القراءة المسجلة', contentHTML);
};

// تأكيد وحذف قراءة واحدة
window.confirmDeleteReading = function(id) {
  openConfirmModal('هل أنت تأكد من رغبتك في حذف هذه القراءة؟ لا يمكن التراجع عن هذا الإجراء.', () => {
    let readings = getReadings();
    readings = readings.filter(r => r.id !== id);
    saveReadings(readings);
    updateDashboardStats();
    renderReadingsTable();
    showToast('تم حذف القراءة بنجاح', 'success');
  });
};

// مسح جميع القراءات بعد التأكيد
function confirmClearAllReadings() {
  openConfirmModal('تنبيه هام! هل ترغب بالفعل في مسح جميع القراءات المسجلة من المتصفح؟', () => {
    saveReadings([]);
    updateDashboardStats();
    renderReadingsTable();
    showToast('تم مسح جميع البيانات بنجاح', 'warning');
  });
}

/* ----- 6.6 تصدير السجل إلى ملف CSV ----- */

function exportToCSV() {
  const readings = getReadings();
  if (readings.length === 0) {
    showToast('لا توجد بيانات مسجلة لتصديرها', 'error');
    return;
  }

  let csvContent = "\uFEFF"; // UTF-8 BOM للأحرف العربية
  csvContent += "القراءة,الوحدة,الحالة,نوع القياس,التاريخ,الوقت,الملاحظات\n";

  const typeNames = { fasting: 'صائم', pre_meal: 'قبل الوجبة', post_meal: 'بعد الوجبة', bedtime: 'قبل النوم', random: 'عشوائي' };

  readings.forEach(r => {
    const notesStr = r.notes ? `"${r.notes.replace(/"/g, '""')}"` : '""';
    csvContent += `${r.value},${r.unit || 'mg/dL'},${r.status},${typeNames[r.type] || r.type},${r.date},${r.time || ''},${notesStr}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `سجل_قياسات_السكر_${getTodayDate()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('تم تصدير سجل القراءات بنجاح إلى ملف CSV', 'success');
}