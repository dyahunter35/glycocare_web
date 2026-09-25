/* ==========================================================================
   سُكّري بلس | الوحدة 9: التواصل والطوارئ (contact.html)
   نموذج التواصل التجريبي والأسئلة الشائعة (Accordion)
   ========================================================================== */

function initContactPage() {
  const form = document.getElementById('doctor-contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleContactSubmit();
    });
  }

  // إعداد الأسئلة الشائعة Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      // إغلاق باقي العناصر
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      } else {
        header.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// محاكاة إرسال نموذج التواصل (تجريبي - لا يوجد خادم)
function handleContactSubmit() {
  const name = document.getElementById('contact-name')?.value.trim();
  const email = document.getElementById('contact-email')?.value.trim();
  const phone = document.getElementById('contact-phone')?.value.trim();
  const subject = document.getElementById('contact-subject')?.value.trim();
  const message = document.getElementById('contact-message')?.value.trim();
  const consent = document.getElementById('contact-consent')?.checked;

  if (!name || !email || !message || !consent) {
    showToast('يرجى ملء كافة الحقول المطلوبة والموافقة على الشرط', 'error');
    return;
  }

  // محاكاة الإرسال
  const contentHTML = `
    <div style="text-align:center; padding:1rem">
      <div style="font-size:3.5rem; color:var(--status-target); margin-bottom:1rem"><i class="fas fa-paper-plane"></i></div>
      <h3 style="color:var(--dark-blue); font-size:1.4rem; margin-bottom:0.5rem">تم إرسال النموذج التجريبي بنجاح!</h3>
      <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.6">
        شكراً لك يا <strong>${name}</strong>. تم تجربة إرسال الاستفسار بنجاح في الواجهة.
        تنبيه: هذه محاكاة تجريبية مخصصة لمشروع التخرج ولا يتم إرسال بيانات حقيقية للخادم.
      </p>
    </div>
  `;

  openModal('تم الإرسال بنجاح', contentHTML);
  document.getElementById('doctor-contact-form').reset();
}