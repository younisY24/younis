const products = [
  {
    id: 1,
    name: "دمبلص",
    price: "60.000 د.ع",
    discountPrice: "20,000 د.ع",
    image: "/images/p2x.png",
    link: "/p/x2"
  },
  {
];

// تهيئة الوضع الداكن بشكل محسن
function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function updateTheme() {
    if (prefersDark.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  
  updateTheme();
  prefersDark.addEventListener('change', updateTheme);
}

// تأثير الظهور عند التمرير
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

// إنشاء بطاقات المنتجات
function createProductCards() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;
  
  // مسح المحتوى الحالي
  productGrid.innerHTML = '';
  
  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card scroll-reveal';
    card.style.transitionDelay = `${index * 0.1}s`;
    
    // حاوية الصورة
    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image-container';
    
    // الصورة مع تحميل كسول
    const img = document.createElement('img');
    img.className = 'product-image';
    img.alt = product.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // معلومات المنتج
    const info = document.createElement('div');
    info.className = 'product-info';
    
    // اسم المنتج
    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = product.name;
    info.appendChild(name);
    
    // السعر المخفض
    if (product.discountPrice) {
      const discount = document.createElement('div');
      discount.className = 'product-discount';
      discount.textContent = product.discountPrice;
      info.appendChild(discount);
    }
    
    // السعر الحالي
    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = product.price;
    info.appendChild(price);
    
    // زر عرض المنتج
    const button = document.createElement('button');
    button.className = 'view-button';
    const link = document.createElement('a');
    link.href = product.link;
    link.textContent = 'عرض المنتج';
    button.appendChild(link);
    info.appendChild(button);
    
    imageContainer.appendChild(img);
    card.appendChild(imageContainer);
    card.appendChild(info);
    productGrid.appendChild(card);
    
    // تحميل الصورة بعد إنشاء العنصر
    setTimeout(() => {
      img.src = product.image;
      
      // إضافة حدث تكبير الصورة
      img.addEventListener('click', function() {
        zoomImage(product.image);
      });
    }, 100);
  });
}

function zoomImage(src) {
  // إنشاء عناصر التكبير
  const overlay = document.createElement('div');
  overlay.className = 'image-zoom-overlay';
  
  const zoomedImg = document.createElement('img');
  zoomedImg.className = 'zoomed-image';
  zoomedImg.src = src;
  zoomedImg.alt = 'صورة مكبرة للمنتج';
  
  // إضافة الصورة إلى الطبقة
  overlay.appendChild(zoomedImg);
  
  // إضافة الطبقة إلى الجسم
  document.body.appendChild(overlay);
  
  // تفعيل التكبير بعد تأخير بسيط لضمان عرض سلس
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);
  
  // إغلاق التكبير عند النقر
  overlay.addEventListener('click', function(e) {
    // فقط عند النقر على الصورة نفسها أو الخلفية
    if (e.target === overlay || e.target === zoomedImg) {
      overlay.classList.remove('active');
      
      // إزالة العنصر بعد انتهاء الانتقال
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 400);
    }
  });
  
  // منع النقر على الصور الأخرى أثناء التكبير
  overlay.addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

// تحسينات للأداء: تحميل الصور عند الحاجة فقط
function lazyLoadImages() {
  const images = document.querySelectorAll('.product-image');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (!img.src && img.dataset.src) {
          img.src = img.dataset.src;
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });
  
  images.forEach(img => {
    if (!img.src) {
      img.dataset.src = img.getAttribute('data-src') || '';
      observer.observe(img);
    }
  });
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  createProductCards();
  initScrollReveal();
  
  // إخفاء مؤشر التحميل
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500);
});

// تأخير تحميل الصور بعد تحميل المحتوى الأساسي
window.addEventListener('load', lazyLoadImages);
