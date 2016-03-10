var fs = require('fs');
var path = require('path');
var bfInternal = require(__dirname + '/bf.js');

var tempDir = process.cwd() + '/.brainfuckex';

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Todo: Clean old files

var bfrequire = function(filename) {
    var code = fs.readFileSync(filename).toString();

    return function(parameters, output, input) {
        return bf(code, parameters, output, input, filename);
    };
}

var bf = function(code, parameters, output, input, filename) {
    filename = filename || '';
    var crypto = require('crypto');

    var tempFile = crypto.createHash('md5').update(code).digest('hex');
    tempFile = tempDir + '/' + tempFile + '.js';

    if (!fs.existsSync(tempFile)) {
        var fp = fs.openSync(tempFile, 'w');
        code = code.replace(/[^-+\.,\[\]<>#]/g, '');

        var jsCode = '';
        jsCode += 'var bfCall = function(bf, bfe, parameters, output, input) {' + "\n";
        jsCode += 'var ret;' + "\n";
        jsCode += 'bf.init(bfe, parameters, output, input);' + "\n";

        var buffer = new Buffer(jsCode, 'ascii');
        fs.writeSync(fp, buffer, 0, buffer.length);

        var insertLast = function() {
            var jsCode = '';
            switch (last) {
                case '>':
                    jsCode = 'bf.move(' + lastCount + ');';
                    break;
                case '<':
                    jsCode = 'bf.move(-' + lastCount + ');';
                    break;
                case '+':
                    jsCode = 'ret = bf.add(' + lastCount + '); if (ret!==false) { return ret; }';
                    break;
                case '-':
                    jsCode = 'ret =bf.add(-' + lastCount + '); if (ret!==false) { return ret; }';
                    break;
                case '[':
                    jsCode = '';
                    for (var k = 1; k <= lastCount; k++) {
                        jsCode += 'while (bf.getMem()) {' + "\n";
                    }
                    break;
                case ']':
                    jsCode = '';
                    for (var k = 1; k <= lastCount; k++) {
                        jsCode += '}' + "\n";
                    }
                    break;
                case '.':
                    jsCode = 'bf.output();';
                    break;
                case ',':
                    jsCode = 'bf.input();';
                    break;
                case '#':
                    jsCode = 'bf.debug();';
                    break;
            }

            var buffer = new Buffer(jsCode + "\n", 'ascii');
            fs.writeSync(fp, buffer, 0, buffer.length);
        };

        var last = false;
        var lastCount = 1;
        for (var i = 0; i < code.length; i++) {
            var current = code[i];

            if (current === last) {
                lastCount++;
                continue;
            } else {
                insertLast();
                lastCount = 1;
                last = current;
            }
        }
        insertLast();

        var jsCode = '';
        jsCode += "}\n\n";
        jsCode += 'module.exports = bfCall';

        var buffer = new Buffer(jsCode, 'ascii');
        fs.writeSync(fp, buffer, 0, buffer.length);

        fs.closeSync(fp);
    }

    var call = require(tempFile);
    return call(new bfInternal(), {
        run: bf,
        require: bfrequire
    }, parameters, output, input);
};

module.exports = {
    run: bf,
    require: bfrequire
};
