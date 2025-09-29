// تهيئة الخريطة (بدون نصوص صينية)
const map = L.map('map').setView([33,120],5);

// Base Map بلا أسماء
L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by Stamen Design'
}).addTo(map);

// تحويل تاريخ نصي إلى كائن Date
function parseDate(str){ return d3.timeParse("%Y-%m-%d")(str); }

// جمع كل المناطق
const allRegions = [...chinaRegions.features, ...japanRegions.features];

// رسم كل منطقة كـ Polygon
const polygons = allRegions.map(f=>{
  const poly = L.polygon(f.geometry.coordinates[0].map(c=>[c[1],c[0]]), {color:'gray', weight:2, fill:false})
    .bindTooltip(f.properties.name,{permanent:true,direction:'center'})
    .addTo(map);
  poly.feature = f;
  return poly;
});

// إعداد التواريخ اليومية
const startDate = parseDate("1937-07-07");
const endDate = parseDate("1945-08-15");
const allDates = d3.timeDay.range(startDate,endDate);

// السلايدر
const slider = document.getElementById('timeSlider');
slider.min = 0; slider.max = allDates.length-1; slider.value=0;
const dateLabel = document.getElementById('dateLabel');

function updateMap(idx){
  const curDate = allDates[idx];
  dateLabel.textContent = d3.timeFormat("%Y-%m-%d")(curDate);

  polygons.forEach(poly=>{
    const props = poly.feature.properties;
    const occupy = parseDate(props.occupyDate);
    const liberate = parseDate(props.liberateDate);

    if(curDate >= occupy && curDate < liberate){
      poly.setStyle({color:'red',fill:true,fillColor:'red',fillOpacity:0.3});
    } else if(curDate >= liberate){
      poly.setStyle({color:'green',fill:true,fillColor:'green',fillOpacity:0.3});
    } else {
      poly.setStyle({color:'gray',fill:false});
    }
  });
}

// حدث تغيير السلايدر
slider.addEventListener('input', e=>{ updateMap(parseInt(e.target.value)); });

// التشغيل اليومي
let playTimer = null;
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');

function play(){
  playBtn.style.display='none';
  pauseBtn.style.display='inline';
  if(playTimer) clearInterval(playTimer);
  playTimer = setInterval(()=>{
    let idx = parseInt(slider.value);
    if(idx >= slider.max){ pause(); return; }
    idx++; slider.value = idx;
    updateMap(idx);
  }, 200); // كل يوم 200ms
}

function pause(){
  if(playTimer) clearInterval(playTimer);
  playBtn.style.display='inline';
  pauseBtn.style.display='none';
}

playBtn.addEventListener('click', play);
pauseBtn.addEventListener('click', pause);

// بدء العرض
updateMap(0);
