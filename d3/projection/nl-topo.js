// Thanks to Rowin Ruizendaal (https://github.com/RowinRuizendaal) for the projection
import { json } from 'd3';


export default function () {
  return fetch('https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson')
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}