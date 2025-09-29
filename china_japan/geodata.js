// geoData.js
// GeoJSON مبسّط لمناطق/مدن مهمة (الأسماء عربية فقط).
const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type":"Feature",
      "properties":{"name":"بكين"},
      "geometry":{"type":"Polygon",
        "coordinates":[
          [
            [116.0,39.5],
            [116.7,39.5],
            [116.7,40.0],
            [116.0,40.0],
            [116.0,39.5]
          ]
        ]
      }
    },
    {
      "type":"Feature",
      "properties":{"name":"شنغهاي"},
      "geometry":{"type":"Polygon",
        "coordinates":[
          [
            [121.2,31.0],
            [121.7,31.0],
            [121.7,31.5],
            [121.2,31.5],
            [121.2,31.0]
          ]
        ]
      }
    },
    {
      "type":"Feature",
      "properties":{"name":"نانجينغ"},
      "geometry":{"type":"Polygon",
        "coordinates":[
          [
            [118.7,31.9],
            [119.5,31.9],
            [119.5,32.2],
            [118.7,32.2],
            [118.7,31.9]
          ]
        ]
      }
    },
    {
      "type":"Feature",
      "properties":{"name":"ووهان"},
      "geometry":{"type":"Polygon",
        "coordinates":[
          [
            [114.0,30.4],
            [114.5,30.4],
            [114.5,30.8],
            [114.0,30.8],
            [114.0,30.4]
          ]
        ]
      }
    }
    // اذا احتجت تضيف مناطق ثانية: انسخ البلوك وأغير properties.name والإحداثيات
  ]
};
