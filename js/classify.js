/* ==========================================================================
   سُكّري بلس | الوحدة 3: التصنيف الطبي الاسترشادي (Classification)
   تصنيف قراءات سكر الدم حسب المعايير العامة (ADA) وتوقيت القياس
   ========================================================================== */

function classifyGlucose(val, type) {
  const value = parseFloat(val);
  if (isNaN(value)) return null;

  // صائم أو قبل الوجبة
  if (type === 'fasting' || type === 'pre_meal') {
    if (value < 70) {
      return {
        status: 'low',
        title: 'منخفض',
        color: 'var(--status-low)',
        bgColor: 'var(--status-low-bg)',
        icon: 'fa-arrow-down',
        msg: 'القراءة منخفضة عن 70 mg/dL. ينصح بتناول 15 جرام كربوهيدرات سريعة وإعادة الفحص بعد 15 دقيقة وفق خطتك.'
      };
    } else if (value >= 70 && value <= 79) {
      return {
        status: 'borderline',
        title: 'أقل من النطاق',
        color: 'var(--status-borderline)',
        bgColor: 'var(--status-borderline-bg)',
        icon: 'fa-exclamation',
        msg: 'القراءة قريبة من الحد الأدنى. يفضل متابعة الأعراض والانتباه للوجبة القادمة.'
      };
    } else if (value >= 80 && value <= 130) {
      return {
        status: 'target',
        title: 'ضمن النطاق المستهدف',
        color: 'var(--status-target)',
        bgColor: 'var(--status-target-bg)',
        icon: 'fa-check-circle',
        msg: 'ممتاز! القراءة تقع ضمن النطاق الموصى به عموماً للصيام وقبل الوجبات (80-130 mg/dL).'
      };
    } else {
      return {
        status: 'high',
        title: 'أعلى من النطاق',
        color: 'var(--status-high)',
        bgColor: 'var(--status-high-bg)',
        icon: 'fa-arrow-up',
        msg: 'القراءة أعلى من 130 mg/dL قبل الوجبة. راجع النشاط والوجبة والالتزام بالخطة العلاجية.'
      };
    }
  }

  // بعد الوجبة بساعة إلى ساعتين
  if (type === 'post_meal') {
    if (value < 70) {
      return {
        status: 'low',
        title: 'منخفض',
        color: 'var(--status-low)',
        bgColor: 'var(--status-low-bg)',
        icon: 'fa-arrow-down',
        msg: 'مستوى السكر منخفض بعد الوجبة. يرجى اتباع إرشادات التعامل مع هبوط السكر.'
      };
    } else if (value >= 70 && value < 180) {
      return {
        status: 'target',
        title: 'ضمن النطاق بعد الوجبة',
        color: 'var(--status-target)',
        bgColor: 'var(--status-target-bg)',
        icon: 'fa-check-circle',
        msg: 'ممتاز! القراءة أقل من 180 mg/dL بعد الوجبة بساعة إلى ساعتين.'
      };
    } else {
      return {
        status: 'high',
        title: 'مرتفع بعد الوجبة',
        color: 'var(--status-high)',
        bgColor: 'var(--status-high-bg)',
        icon: 'fa-arrow-up',
        msg: 'القراءة 180 mg/dL أو أعلى بعد الوجبة. تحقق من مكونات الوجبة وكمية الكربوهيدرات.'
      };
    }
  }

  // قبل النوم أو قياس عشوائي
  if (type === 'bedtime' || type === 'random') {
    if (value < 70) {
      return {
        status: 'low',
        title: 'منخفض',
        color: 'var(--status-low)',
        bgColor: 'var(--status-low-bg)',
        icon: 'fa-arrow-down',
        msg: 'قراءة منخفضة. ينصح بمعالجتها فوراً خاصة قبل النوم لمنع الهبوط الليلي.'
      };
    } else if (value >= 70 && value <= 180) {
      return {
        status: 'target',
        title: 'ضمن النطاق المرجعي العام',
        color: 'var(--status-target)',
        bgColor: 'var(--status-target-bg)',
        icon: 'fa-check-circle',
        msg: 'القراءة متوازنة وضمن الحدود الآمنة العامة.'
      };
    } else {
      return {
        status: 'high',
        title: 'مرتفع',
        color: 'var(--status-high)',
        bgColor: 'var(--status-high-bg)',
        icon: 'fa-arrow-up',
        msg: 'القراءة أعلى من 180 mg/dL. ينصح بمراجعة العوامل المؤثرة كالجهد والوجبات.'
      };
    }
  }

  return null;
}