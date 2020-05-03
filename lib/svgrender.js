var Q = require('q');
var fs = require('fs');

var canvg = require('canvg');
var canvas = require('canvas');

var DOMParser = require('xmldom').DOMParser;
var fetch = require('node-fetch');

function renderSvg(outputfilename, svgdata, width, height) {
    var d = Q.defer();

    try {
        var can = canvas.createCanvas(width, height);
        var ctx = can.getContext("2d")

        preset = canvg.presets.node({ DOMParser, canvas, fetch });
        preset.ignoreAnimation = true;
        
        v = canvg.Canvg.fromString(ctx, svgdata, preset);
        v.render();
        var out = fs.createWriteStream(outputfilename);
        var stream = can.jpegStream();

        stream.on('data', function (chunk) {
            out.write(chunk);
        });

        stream.on('end', function () {
            console.log('saved jpeg');
            d.resolve()
        });
        stream.on('error', d.reject);
    } catch (err) {
        return Q.reject(err);
    }

    return d.promise;
}

module.exports = renderSvg;
