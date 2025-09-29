// main.js
// يعتمد على: geojsonData (من geoData.js) و d3 + leaflet محملين في الصفحة

// إعداد الخريطة
const map = L.map('map').setView([34.5,116],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OSM'}).addTo(map);

// تحميل الطبقات من GeoJSON وعمل map للـlayers بالاسم العربي
const areaLayers = {}; // name -> layer
const baseStyle = {color:'#333', weight:1, fillOpacity:0};
const geoLayer = L.geoJSON(geojsonData, {
  style: baseStyle,
  onEachFeature: function(feature, layer){
    const name = feature.properties.name;
    layer.areaName = name;
    // اسم عربي ثابت كـ tooltip
    layer.bindTooltip(name, {permanent:true, direction:'center', className:'areaLabel'});
    areaLayers[name] = layer;
  }
}).addTo(map);

// سجل السيطرة للمدن (قائمة تغيّرات: تاريخ واسم الجهة)
// الصيغة: controlLog[area] = [ {date:"YYYY-MM-DD", side:"اليابان"|'الصين'}, ... ]
// مهم: ضع تغييرات زمنية مرتبة تصاعدياً
const controlLog = {
  "بكين": [
    {date:"1937-07-07", side:"الصين"},
    {date:"1937-07-09", side:"اليابان"},
    {date:"1945-08-15", side:"الصين"} // التحرير بعد استسلام اليابان
  ],
  "شنغهاي": [
    {date:"1937-08-01", side:"الصين"},
    {date:"1937-08-13", side:"اليابان"},
    {date:"1945-08-15", side:"الصين"}
  ],
  "نانجينغ": [
    {date:"1937-12-01", side:"الصين"},
    {date:"1937-12-13", side:"اليابان"},
    {date:"1945-08-15", side:"الصين"}
  ],
  "ووهان": [
    {date:"1938-09-01", side:"الصين"},
    {date:"1938-10-10", side:"اليابان"},
    {date:"1945-08-15", side:"الصين"}
  ]
  // أضف مدن/مناطق إضافية بنفس الصيغة إذا تريد
};

// تحويل تواريخ لبنية زمنية ودوال مساعدة
const parseDate = d3.timeParse("%Y-%m-%d");
const formatDate = d3.timeFormat("%Y-%m-%d");
function toMillis(s){ return parseDate(s).getTime(); }

// بناء لائحة كل الأيام بين البداية والنهاية
const startDate = parseDate("1937-07-07");
const endDate = parseDate("1945-08-15");
const allDates = d3.timeDay.range(startDate, d3.timeDay.offset(endDate,1)); // شامل النهاية

// UI عناصر
const slider = document.getElementById('timeSlider');
slider.min = 0;
slider.max = allDates.length - 1;
slider.value = 0;
const dateLabel = document.getElementById('dateLabel');

// لون حسب الجهة
function colorFor(side){
  if(!side) return null;
  if(side === "اليابان") return "#1f78b4"; // أزرق
  if(side === "الصين") return "#e31a1c";  // أحمر
  return null;
}

// تعيين حالة السيطرة لكل منطقة في يوم معين
function applyControlForDate(idx){
  const day = allDates[idx];
  const dayMillis = day.getTime();
  dateLabel.textContent = formatDate(day);

  // لكل منطقة نبحث عن آخر حدث <= اليوم
  for(const areaName in controlLog){
    const log = controlLog[areaName];
    // البحث الخطي: اختر آخر سجل تاريخ <= اليوم
    let currentSide = null;
    for(let i=0;i<log.length;i++){
      const rec = log[i];
      if( toMillis(rec.date) <= dayMillis ){
        currentSide = rec.side;
      } else break;
    }
    const layer = areaLayers[areaName];
    if(layer){
      if(currentSide){
        // طبق اللون الدائم على حدود المنطقة وملئها
        const col = colorFor(currentSide);
        layer.setStyle({fillColor: col, color: col, fillOpacity: 0.6, weight:1});
        layer.currentControl = currentSide;
      } else {
        // لا سيطرة مسجله => إرجاع للوضع الافتراضي
        layer.setStyle(baseStyle);
        layer.currentControl = null;
      }
    }
  }
}

// تحديث أولي
applyControlForDate(0);

// تفاعل السلايدر
slider.addEventListener('input', ()=> applyControlForDate(parseInt(slider.value)));

// تشغيل/ايقاف تلقائي
let timer = null;
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedSel = document.getElementById('speedSel');

playBtn.addEventListener('click', ()=>{
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline';
  let idx = parseInt(slider.value);
  const stepMs = parseInt(speedSel.value);
  timer = setInterval(()=>{
    if(idx >= slider.max){
      clearInterval(timer);
      playBtn.style.display='inline';
      pauseBtn.style.display='none';
      return;
    }
    idx++;
    slider.value = idx;
    applyControlForDate(idx);
  }, stepMs);
});

pauseBtn.addEventListener('click', ()=>{
  clearInterval(timer);
  playBtn.style.display='inline';
  pauseBtn.style.display='none';
});

// عند النقر على منطقة يفتح popup يذكر السيطرة الحالية وتاريخ آخر تغيير
for(const nm in areaLayers){
  const lyr = areaLayers[nm];
  lyr.on('click', function(e){
    const current = this.currentControl ? this.currentControl : "لا سيطرة مسجلة";
    // ابحث عن آخر تاريخ تغير لهذه المنطقة
    const log = controlLog[nm] || [];
    const lastRec = log.length ? log[log.length-1] : null;
    const lastDate = lastRec ? lastRec.date : '—';
    this.bindPopup(`<b>${nm}</b><br/>الحالة الآن: ${current}<br/>آخر تغيير مسجل: ${lastDate}`).openPopup();
  });
}
