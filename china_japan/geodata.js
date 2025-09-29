// بيانات المناطق بالعربي بصيغة GeoJSON (أمثلة مختصرة)
const chinaRegions = {
  "type": "FeatureCollection",
  "features": [
    {
      "type":"Feature",
      "properties": { "name":"شنغهاي", "status":"neutral", "occupyDate":"1937-08-13", "liberateDate":"1945-08-15" },
      "geometry": { "type":"Polygon", "coordinates":[ [[121.3,31.0],[121.7,31.0],[121.7,31.4],[121.3,31.4],[121.3,31.0]]] }
    },
    {
      "type":"Feature",
      "properties": { "name":"نانجينغ", "status":"neutral", "occupyDate":"1937-12-13", "liberateDate":"1945-08-15" },
      "geometry": { "type":"Polygon", "coordinates":[ [[118.6,31.9],[119.0,31.9],[119.0,32.2],[118.6,32.2],[118.6,31.9]]] }
    },
    {
      "type":"Feature",
      "properties": { "name":"ووهان", "status":"neutral", "occupyDate":"1938-10-01", "liberateDate":"1945-08-15" },
      "geometry": { "type":"Polygon", "coordinates":[ [[114.1,30.4],[114.7,30.4],[114.7,30.8],[114.1,30.8],[114.1,30.4]]] }
    }
  ]
};

const japanRegions = {
  "type": "FeatureCollection",
  "features": [
    {
      "type":"Feature",
      "properties": { "name":"طوكيو", "status":"neutral", "occupyDate":"1937-07-07", "liberateDate":"1945-08-15" },
      "geometry": { "type":"Polygon", "coordinates":[ [[139.6,35.6],[139.9,35.6],[139.9,35.9],[139.6,35.9],[139.6,35.6]]] }
    }
  ]
};
