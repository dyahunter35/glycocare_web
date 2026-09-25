/* ==========================================================================
   سُكّري بلس | الوحدة 10: نقطة الدخول الرئيسية (main.js)
   تهيئة الموقع وتشغيل وظائف كل صفحة حسب عناصرها الموجودة
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  dismissLoader();
  setupNavigation();
  updateFooterYear();
  updatePrintDate();
  initLocalStorage();
  setupGlobalInteractions();
  applyTheme();
  setupThemeToggle();

  // تشغيل الوظائف الخاصة بكل صفحة بحسب وجود عناصرها
  if (document.getElementById('stat-total-readings')) initHomePage();
  if (document.getElementById('glucose-form')) initDashboardPage();
  if (document.getElementById('lineChart')) initAnalyticsPage();
  if (document.getElementById('nutrition-search')) initNutritionPage();
  if (document.getElementById('doctor-contact-form')) initContactPage();
}