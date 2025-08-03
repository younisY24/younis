const backButton = document.createElement('button');
backButton.innerHTML = '←';

backButton.style.position = 'fixed';
backButton.style.top = '20px';
backButton.style.right = '20px';
backButton.style.width = '40px';
backButton.style.height = '40px';
backButton.style.fontSize = '20px';
backButton.style.border = 'none';
backButton.style.borderRadius = '50%';
backButton.style.cursor = 'pointer';
backButton.style.zIndex = '1000';
backButton.style.display = 'flex';
backButton.style.alignItems = 'center';
backButton.style.justifyContent = 'center';
backButton.style.transition = 'background-color 0.3s, color 0.3s, opacity 0.3s';
backButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';

// تحديد إذا كان المتصفح في الوضع الداكن
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (isDarkMode) {
  backButton.style.backgroundColor = '#333';
  backButton.style.color = '#fff';
} else {
  backButton.style.backgroundColor = '#fff';
  backButton.style.color = '#000';
}

// تغيير تلقائي عند تبديل المستخدم الوضع
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  const darkMode = e.matches;
  backButton.style.backgroundColor = darkMode ? '#333' : '#fff';
  backButton.style.color = darkMode ? '#fff' : '#000';
});

backButton.onclick = () => history.back();

document.body.appendChild(backButton);
