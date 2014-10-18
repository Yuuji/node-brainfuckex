var fs = require('fs');
var path = require('path');

var bfrequire = function(filename) {
	var code = fs.readFileSync(filename).toString();
	
	return function(parameters, output, input) {
		return bf(code, parameters, output, input);
	};
}

var bf = function(code, parameters, output, input) {
	var mem = {0:0, 1:0};
	var ptr = 0;
	var inptr = 0;
	var stepptr = 0;
	var opening = [];

	var isExtended = false;

	var readFile = false;
	var readFilePtr = 0;
	var writeFile = false;
	var writeFilePtr = 0;

	output = output || function(str) {
			return process.stdout.write(str, 'ascii');
	};

	parameters = parameters || [];

	if (parameters.length>0) {
		var pPtr = 4;
		var first = true;
		for (var key in parameters) {
			var param = parameters[key];
			if (!first) {
				mem[pPtr] = 0x03;
				pPtr++;
			}
			first = false;

			for (var i = 0; i < param.length; i++) {
				mem[pPtr] = param.charCodeAt(i);
				pPtr++;
			}
		}
		
		mem[pPtr] = 0x04;
	}

	var getFunctionData = function() {
		var parameterPtr = mem[2];
		var returnPtr = mem[3];

		var parameters = [];
		var parameter = '';

		while (mem[parameterPtr] !== 0x04) {
			if (mem[parameterPtr] === 0x03) {
				parameters.push(parameter);
				parameter = '';
			} else {
				parameter += String.fromCharCode(mem[parameterPtr]);
			}
			parameterPtr++;
		}
		parameters.push(parameter);

		return {
			parameters: parameters,
			returnPtr: returnPtr
		};
	};

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

				if (ptr===0 && mem[ptr]===1) {
					switch (mem[ptr+1]) {
						case 0x1B:	// ESC
							isExtended = isExtended ? false : true;
							mem[ptr] = 0;
							mem[ptr+1] = isExtended ? 1 : 0;
							break;
						case 0x01: // return
							var data = getFunctionData();
							return data.parameters;
							break;
						case 0x02: // run
							if (isExtended) {
								var data = getFunctionData();
								var filename = data.parameters[0];
								var type = 'js';
								var parameters = data.parameters.slice(1);
								if (fs.existsSync(filename)) {
									if (path.extname === 'bf') {
										type = 'bf';
									}
								} else {
									if (fs.existsSync(filename + '.bf')) {
										filename += '.bf';
										type = 'bf';
									} else if (fs.existsSync(filename + '.js')) {
										filename += '.js';
									} else {
										throw new error('File not found: ' + filename);
									}
								}

								var func;
								if (type==='bf') {
									func = bfrequire(filename);
									parameters = [parameters];
								} else {
									func = require(filename);
								}
							
								var returnData = func.apply(this, parameters);

								mem[ptr] = 0;
								mem[ptr+1] = 0;
							
								if (typeof returnData === 'string') {
									returnData = [returnData];
								}

								if (typeof returnData === 'object' && returnData.length) {
									var first = true;
									var pPtr = data.returnPtr;
								
									for (var key in returnData) {
										var returnValue = returnData[key];
									
										if(!first) {
											mem[pPtr] = 0x03;
											pPtr++;
										}
										first = false;

										for (var i=0; i < returnValue.length; i++) {
											mem[pPtr] = returnValue.charCodeAt(i);
											pPtr++;
										}
									}

									mem[pPtr] = 0x04;
								}
							}
							break;
						case 0x03:	// open file for reading
							var data = getFunctionData();
							var filename = data.parameters[0];

							if (!fs.existsSync(filename)) {
								throw new Error('file does not exists: ' + filename);
							}

							if (readFile !== false) {
								fs.closeSync(readFile);
							}

							readFile = fs.openSync(filename, 'r');
							readFilePtr = 0;

							mem[ptr] = mem[ptr+1] = 0;
							break;
						case 0x04: // open file for writeing
							var data = getFunctionData();
							var filename = data.parameters[0];

							if (writeFile !== false) {
								fs.closeSync(writeFile);
							}

							writeFile = fs.openSync(filename, 'w');
							writeFilePtr = 0;
							
							mem[ptr] = mem[ptr+1] = 0;
							break;
						case 0x05: // close file
							if (readFile) {
								fs.closeSync(readFile);
								readFile = false;
							}
							
							if (writeFile) {
								fs.closeSync(writeFile);
								writeFile = false;
							}
							
							mem[ptr] = mem[ptr+1] = 0;

							break;
					}


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
				if (readFile !== false) {
					var buffer=new Buffer(1);
					var bytes = fs.readSync(readFile, buffer, 0, 1, readFilePtr);

					if (bytes === 0) {
						mem[ptr] = 0;
					} else {
						mem[ptr] = buffer.toString('ascii',0,1).charCodeAt(0);
					}

					readFilePtr++;
				} else {
					if (inptr >= input.length) {
						mem[ptr] = 0;
					} else {
						mem[ptr] = input.charCodeAt(inptr);
					}
					inptr++;
				}
				break;
			case '#':
				console.log('mem:');
				console.log(mem);
				console.log('ptr: ' + ptr);
				console.log('isExtendedMode: ' + isExtended);
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

		return false;
	};

	while (stepptr < code.length) {
		var returnValue = step();

		if (returnValue !== false) {
			return returnValue;
		}
	}
};

module.exports = {
	run: bf,
	require: bfrequire
};
