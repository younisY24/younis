
// إضافة رسالة ترحيبية في الكونسول
console.log('تطبيق الويب جاهز للاستخدام! - تم تحميل الإصدار العربي');

window.addEventListener('load', () => {
  // تغيير اتجاه الصفحة للغة العربية
  document.body.style.direction = 'rtl';
  document.body.style.textAlign = 'right';

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ar/sw.js') // تغيير المسار للدل العربية
      .then(reg => {
        console.log('تم تسجيل خدمة العامل بنجاح');
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateButton();
            }
          });
        });

        // Check for updates daily
        setInterval(() => reg.update(), 24 * 60 * 60 * 1000);
      })
      .catch(err => console.error('خطأ في تسجيل خدمة العامل:', err));
  }

  // Show install button
  if ('BeforeInstallPromptEvent' in window) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      showInstallButton(e);
    });
  }
});

function showUpdateButton() {
  const btn = document.createElement('button');
  btn.innerHTML = '🔄 تحديث التطبيق';
  btn.title = 'نسخة جديدة متاحة - انقر للتحديث';
  btn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 30px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Segoe UI', Tahoma, sans-serif;
  `;

  // إضافة مؤثرات تفاعلية
  btn.addEventListener('mouseover', () => btn.style.opacity = '0.9');
  btn.addEventListener('mouseout', () => btn.style.opacity = '1');
  btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.98)');
  btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');

  btn.onclick = () => {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg?.waiting) {
        reg.waiting.postMessage({type: 'SKIP_WAITING'});
        btn.innerHTML = 'جارٍ التحديث...';
        setTimeout(() => window.location.reload(), 300);
      }
    });
  };

  document.body.appendChild(btn);
  console.log('عرض زر التحديث');
}

function showInstallButton(event) {
  const btn = document.createElement('button');
  btn.innerHTML = '📱 تثبيت التطبيق';
  btn.title = 'تثبيت التطبيق على جهازك';
  btn.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    padding: 12px 20px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 30px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Segoe UI', Tahoma, sans-serif;
  `;

  // إضافة مؤثرات تفاعلية
  btn.addEventListener('mouseover', () => btn.style.opacity = '0.9');
  btn.addEventListener('mouseout', () => btn.style.opacity = '1');
  btn.addEventListener('mousedown', () => btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)');
  btn.addEventListener('mouseup', () => btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)');

  btn.onclick = () => {
    event.prompt();
    btn.style.display = 'none'; // إخفاء الزر بعد النقر
    console.log('تم بدء عملية التثبيت');
  };

  document.body.appendChild(btn);
  console.log('عرض زر التثبيت');
}
