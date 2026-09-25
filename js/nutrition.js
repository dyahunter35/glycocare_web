/* ==========================================================================
   سُكّري بلس | الوحدة 8: الدليل الصحي والغذاء (nutrition.html)
   قائمة الوجبات المقترحة مع البحث والتصفية وعرض التفاصيل
   ========================================================================== */

// قاعدة بيانات الوجبات الغذائية المقترحة
const NUTRITION_ITEMS = [
  {
    id: '1',
    name: 'سلاطة الخضروات الورقية والزيتون',
    category: 'breakfast',
    categoryName: 'الإفطار',
    desc: 'سلاطة منعشة غنية بالألياف وقليلة الكربوهيدرات تساعد على ضبط السكر.',
    whyHealthy: 'الألياف الورقية تبطئ امتصاص السكر وتوفر فيتامينات هامة.',
    ingredients: 'خس، خيار، جرجير، زيت زيتون، ليمون، قليل من الجبن الأبيض.',
    icon: 'fa-leaf'
  },
  {
    id: '2',
    name: 'طبق الشوفان الكامل مع القرفة',
    category: 'breakfast',
    categoryName: 'الإفطار',
    desc: 'وجبة إفطار دافئة مشبعة توفر طاقة مستدامة طوال الصباح.',
    whyHealthy: 'الشوفان يتضمن ألياف البيتا جلوكان المعززة لحساسية الإنسولين.',
    ingredients: 'شوفان كامل، حليب خالي الدسم، قرفة، بذور الشيا.',
    icon: 'fa-bowl-rice'
  },
  {
    id: '3',
    name: 'سمك السلمون المشوي مع البروكلي',
    category: 'lunch',
    categoryName: 'الغداء',
    desc: 'وجبة غداء متكاملة غنية بالأوميغا 3 والبروتين عالي الجودة.',
    whyHealthy: 'البروتين والأدهان الصحية تحافظ على استقرار الجلوكوز بعد الوجبة.',
    ingredients: 'فيلييه سلمون، بروكلي مبخر، ثوم، زيت زيتون.',
    icon: 'fa-fish'
  },
  {
    id: '4',
    name: 'دجاج مشوي مع طبق الخضروات المشكلة',
    category: 'lunch',
    categoryName: 'الغداء',
    desc: 'طبق غداء متوازن يتبع قاعدة طبق السكري الصحي.',
    whyHealthy: 'خالي من السكريات المضافة وغني بالبروتين المشبع.',
    ingredients: 'صدر دجاج مشوي، كوسة، فلفل رومي، جزر، نصف كوب أرز بني.',
    icon: 'fa-drumstick-bite'
  },
  {
    id: '5',
    name: 'شوربة العدس بالأعشاب والليمون',
    category: 'dinner',
    categoryName: 'العشاء',
    desc: 'وجبة عشاء خفيفة ومغذية تمنح الدفء دون إثقال المعدة.',
    whyHealthy: 'العدس مصدر ممتاز للبروتين النباتي والألياف المشبعة.',
    ingredients: 'عدس أصفر، بصل، كمون، زيت زيتون، عصير ليمون.',
    icon: 'fa-utensils'
  },
  {
    id: '6',
    name: 'حفنة لوز خام وجوز',
    category: 'snacks',
    categoryName: 'الوجبات الخفيفة',
    desc: 'تصيرة مقرمشة ومثالية بين الوجبات الرئيسية.',
    whyHealthy: 'تحتوي على دهون صحية ولا تسبب ارتفاعاً مفاجئاً في السكر.',
    ingredients: 'لوز نيء، جوز، فستق بدون ملح.',
    icon: 'fa-apple-whole'
  },
  {
    id: '7',
    name: 'مشروب الشاي الأخضر بالنعناع',
    category: 'beverages',
    categoryName: 'المشروبات',
    desc: 'مشروب دافئ مضاد للأكسدة وبدون سعرات حرارية.',
    whyHealthy: 'بديل ممتاز للمشروبات الغازية والمحلاة بالسكر.',
    ingredients: 'أوراق شاي أخضر، نعناع طازج، ماء دافئ.',
    icon: 'fa-mug-hot'
  },
  {
    id: '8',
    name: 'خبز الحبوب الكاملة المشددة',
    category: 'alternatives',
    categoryName: 'بدائل مقترحة',
    desc: 'بديل ممتاز للخبز الأبيض المكرر.',
    whyHealthy: 'مؤشر جلايسيمي منخفض مقارنة بالمخبوزات البيضاء.',
    ingredients: 'دقيق قمح كامل، بذور الكتان، نخالة.',
    icon: 'fa-bread-slice'
  }
];

function initNutritionPage() {
  renderNutritionCards(NUTRITION_ITEMS);

  // مربع البحث الفوري
  const searchInput = document.getElementById('nutrition-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = NUTRITION_ITEMS.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.whyHealthy.toLowerCase().includes(q)
      );
      renderNutritionCards(filtered);
    });
  }

  // أزرار التصفية الفئوية
  const filterBtns = document.querySelectorAll('.nutri-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const cat = e.target.getAttribute('data-category');
      if (cat === 'all') {
        renderNutritionCards(NUTRITION_ITEMS);
      } else {
        const filtered = NUTRITION_ITEMS.filter(item => item.category === cat);
        renderNutritionCards(filtered);
      }
    });
  });
}

// رسم بطاقات الوجبات داخل الحاوية
function renderNutritionCards(items) {
  const container = document.getElementById('nutrition-cards-container');
  if (!container) return;

  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted)">لا توجد نتائج مطابقة لمفهوم البحث.</div>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'food-card';
    card.innerHTML = `
      <div class="food-card-img">
        <i class="fas ${item.icon}"></i>
      </div>
      <div class="food-card-body">
        <div style="margin-bottom:0.5rem"><span class="pill-tag">${item.categoryName}</span></div>
        <h3 class="food-title">${item.name}</h3>
        <p class="food-desc">${item.desc}</p>
        <div style="margin-top:auto">
          <button class="btn btn-secondary btn-sm" style="width:100%" onclick="showMealDetails('${item.id}')">
            <i class="fas fa-info-circle"></i> التفاصيل والمكونات
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// عرض تفاصيل وجبة بالنافذة المنبثقة
window.showMealDetails = function(id) {
  const item = NUTRITION_ITEMS.find(n => n.id === id);
  if (!item) return;

  const contentHTML = `
    <div style="text-align:center; margin-bottom:1.25rem">
      <div style="font-size:2.5rem; color:var(--primary-blue); margin-bottom:0.5rem"><i class="fas ${item.icon}"></i></div>
      <h3 style="color:var(--dark-blue); font-size:1.3rem">${item.name}</h3>
      <span class="pill-tag" style="margin-top:0.35rem; display:inline-block">${item.categoryName}</span>
    </div>
    <div style="display:flex; flex-direction:column; gap:1rem; font-size:0.95rem">
      <div><strong>الوصف:</strong> ${item.desc}</div>
      <div><strong>لماذا تعد خياراً متوازناً؟</strong> ${item.whyHealthy}</div>
      <div><strong>المكونات المقترحة:</strong> ${item.ingredients}</div>
      <div style="background:var(--light-blue); padding:0.85rem; border-radius:8px; font-size:0.85rem; color:var(--dark-blue); margin-top:0.5rem">
        <i class="fas fa-lightbulb"></i> نصيحة: ناقش الكميات المناسبة لحاجتك اليومية مع أخصائي التغذية المتابع لحالتك.
      </div>
    </div>
  `;

  openModal('تفاصيل الوجبة الغذائية', contentHTML);
};