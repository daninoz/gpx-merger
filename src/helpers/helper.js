import xml2js from 'xml2js'

export default {
  readGpxFile(url, cb) {
    var req = new window.XMLHttpRequest();
    req.open('GET', url, true);
    req.overrideMimeType('text/xml');
    req.onreadystatechange = function() {
      if (req.readyState != 4) return;
      if(req.status == 200) cb(req.responseText);
    };
    req.send(null);
  },

  convertRoutetoHash(routeString, cb) {
    var parser = new xml2js.Parser();

    parser.parseString(routeString, cb);
  },

  convertHashToRoute(gpxHash) {
    var builder = new xml2js.Builder()
    return builder.buildObject(gpxHash)
  }
}