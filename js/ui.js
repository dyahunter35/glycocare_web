/* ==========================================================================
   سُكّري بلس | الوحدة 4: عناصر الواجهة العامة (UI)
   شاشة التحميل، التنقل، التذييل، وزر العودة للأعلى
   ========================================================================== */

// إخفاء شاشة التحميل بعد ظهور الصفحة
function dismissLoader() {
  const loader = document.getElementById('app-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 300);
  }
}

// تفعيل قائمة الجوال وتمييز الصفحة الحالية
function setupNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu-list');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });
  }

  // تمييز رابط الصفحة الحالية
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// تحديث سنة التذييل تلقائياً
function updateFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// زر العودة للأعلى (يظهر بعد التمرير 400px)
function setupGlobalInteractions() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// طباعة تاريخ اليوم في ترويسة الطباعة إن وُجدة
function updatePrintDate() {
  const el = document.getElementById('print-date');
  if (el) {
    el.textContent = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

/* ==========================================================================
   4.1 الوضع الليلي (Dark Mode)
   يخزّن التفضيل في المتصفح ويبدّل الخاصية data-theme على عنصر <html>
   ========================================================================== */
const THEME_KEY = 'sukkariPlusTheme';

// تطبيق السمة المحفوظة وتحديث أيقونة الزر
function applyTheme() {
  let isDark = false;
  try {
    isDark = localStorage.getItem(THEME_KEY) === 'dark';
  } catch (e) {
    console.error('تعذر الوصول إلى تفضيلات المتصفح:', e);
  }

  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // أيقونة القمر/الشمس
  const icon = document.querySelector('#theme-toggle i');
  if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// تطبيق السمة مبكرًا عند تحميل الملف لتجنب وميض الوضع الفاتح
applyTheme();

// ربط زر التبديل وحفظ التفضيل
function setupThemeToggle() {
  applyTheme();

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      try {
        localStorage.setItem(THEME_KEY, isDark ? 'light' : 'dark');
      } catch (e) {
        console.error('تعذر حفظ التفضيل:', e);
      }
      applyTheme();
      // إعلام باقي الوحدات (مثل الرسوم البيانية) لتحديث ألوانها
      window.dispatchEvent(new CustomEvent('themechange'));
    });
  }
}