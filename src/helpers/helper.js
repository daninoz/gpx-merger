import xml2js from "xml2js";

import { colors } from "@/constants";

const usedColors = [];

export default {
  readGpxFile(url, cb) {
    var req = new window.XMLHttpRequest();
    req.open("GET", url, true);
    req.overrideMimeType("text/xml");
    req.onreadystatechange = function() {
      if (req.readyState != 4) return;
      if (req.status == 200) cb(req.responseText);
    };
    req.send(null);
  },

  convertRoutetoHash(routeString, cb) {
    var parser = new xml2js.Parser();

    parser.parseString(routeString, cb);
  },

  convertHashToRoute(gpxHash) {
    var builder = new xml2js.Builder();
    return builder.buildObject({ gpx: gpxHash.gpx });
  },

  getColor() {
    const newColor = colors.find((color) => {
      return !usedColors.includes(color);
    });

    usedColors.push(newColor);

    return newColor;
  },

  removeUsedColor(color) {
    for (let i = 0; i < usedColors.length; i++) {
      if (usedColors[i] === color) {
        usedColors.splice(i, 1);
      }
    }
  },

  getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371000; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },
};
