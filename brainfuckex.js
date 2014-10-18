var bf = function(code, output, input) {
	var mem = {0:0};
	var ptr = 0;
	var inptr = 0;
	var stepptr = 0;
	var opening = [];

	var step = function() {
		switch (code[stepptr]) {
			case '>':
				ptr++;
				if (typeof mem[ptr] === 'undefined') {
					mem[ptr] = 0;
				}
				break;
			case '<':
				if (ptr===0) {
					throw new Error('Seqfault at ' + (stepptr+1));
				}
				ptr--;
				break;
			case '+':
				if (mem[ptr]===0xFF) {
					mem[ptr] = 0;
				} else {
					mem[ptr]++;
				}
				break;
			case '-':
				if (mem[ptr]===0) {
					mem[ptr] = 0xFF;
				} else {
					mem[ptr]--;
				}
				break;
			case '[':
				if (mem[ptr] === 0) {
					var jumpOver = 1;
					var startPtr = stepptr;
					stepptr++;
					while (stepptr < code.length && jumpOver > 0) {
						if (code[stepptr] === '[') {
							jumpOver++;
						} else if (code[stepptr] === ']') {
							jumpOver--;
						}
						//console.log(code[stepptr] + ' - ' + jumpOver);
						stepptr++;
					}

					if (stepptr >= code.length) {
						throw new Error('Syntax error at ' + (startPtr+1));
					}
					stepptr--;
				} else {
					opening.push(stepptr);
				}
				break;
			case ']':
				if (opening.length === 0) {
					throw new Error('Syntax error at ' + (stepptr+1));
				}
				var stepTo = opening.pop();

				if (mem[ptr] !== 0) {
					stepptr = stepTo - 1;
				}
				break;
			case '.':
				output(String.fromCharCode(mem[ptr]));
				break;
			case ',':
				if (inptr >= input.length) {
					mem[ptr] = 0;
				} else {
					mem[ptr] = input.charCodeAt(inptr);
				}
				inptr++;
				break;
			case '#':
				console.log('mem:');
				console.log(mem);
				console.log('ptr: ' + ptr);
				console.log('opening:');
				console.log(opening);
				break;
		}
		if (false) {
				console.log('stepptr: ' + stepptr);
				console.log('code: ' + code[stepptr]);
				console.log('mem:');
				console.log(mem);
				console.log('ptr: ' + ptr);
				console.log('opening:');
				console.log(opening);
				console.log("\n\n");
		}
		stepptr++;
	};

	while (stepptr < code.length) {
		step();
	}
};

module.exports = {
	run: bf,
	require: function(filename) {
		var fs = require('fs');
		var code = fs.readFileSync(filename).toString();

		return function(output, input) {
			return bf(code, output, input);
		};
	}
};
