/* ==========================================================================
   سُكّري بلس | الوحدة 1: أدوات عامة (Utilities)
   دوال التواريخ والوقت، الإشعارات (Toast)، والنوافذ المنبثقة (Modal)
   ========================================================================== */

/* ----- 1.1 دوال التواريخ والوقت ----- */

// تاريخ اليوم بصيغة YYYY-MM-DD
function getTodayDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// تاريخ نسبي بإزاحة بالأيام عن اليوم الحالي
function getRelativeDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// الوقت الحالي بصيغة HH:MM
function getCurrentTime() {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// تأجيل تنفيذ الدالة حتى التوقف عن الاستدعاء (مفيد لحجم النافذة)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ----- 1.2 الإشعارات (Toast Notifications) ----- */

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';

  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ----- 1.3 النوافذ المنبثقة (Modals) ----- */

function openModal(title, bodyHTML) {
  let modalOverlay = document.getElementById('global-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'global-modal';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title"></h3>
          <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer">
          <button class="btn btn-primary btn-sm" onclick="closeModal()">إغلاق</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  modalOverlay.classList.add('active');
}

// نافذة تأكيد بطراز "هل أنت متأكد؟"
function openConfirmModal(message, onConfirm) {
  const contentHTML = `
    <p style="color:var(--text-main); font-size:1rem; line-height:1.6">${message}</p>
    <div style="display:flex; gap:0.75rem; justify-content:flex-end; margin-top:1.5rem">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-danger btn-sm" id="confirm-modal-action-btn">تأكيد الحذف</button>
    </div>
  `;
  openModal('تأكيد الإجراء', contentHTML);

  const confirmBtn = document.getElementById('confirm-modal-action-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      closeModal();
      if (onConfirm) onConfirm();
    });
  }
}

// إغلاق النافذة المنبثقة (تُعرَّف عامة لاستدعائها من HTML)
window.closeModal = function() {
  const modalOverlay = document.getElementById('global-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
};