Call sample
================

This sample shows the use the register to call another brainfuck file with given arguments.

run.js
------

This is only the bootstrap file. It only run the call.bf file with the brainfuck interpreter.

call.bf
-------

This file is really simple. First we have to activate the extended mode so we can use the register to use extended functions. This happens in line 2.

In line 5 and 6 we only prepare the text.

Now we write 'hw' to the stack (h to S4 and w to S5). This is the filename of the file we want to run. Next we write a ETX (0x03) to S6. This is a parameter delimiter.

The second parameter is 'bf'. We finish the parameters with a EOT (0x04).
Important: Don't enter a ETX after the last parameter!

Now we have:<br />
h w ETX b f EOT <br />
4 5 6   7 8 9

To run the file, we have to announce the address of the parameters (S4). For this, we have to write the address (4) to S2.

Out file has no return value, but we also have to announce the address for the return value. We write the address (4) to S3.

The brainfuck interpreter have to know, what to do. To run a file, we have to write 2 (function call) to S1.

Finally we run the function with set S0 to 1.

Notice: After the call S0 and S1 will be set to 0 by the interpreter.


hw.bf
-----

This file outputs the text "Hello World, " + parameter + "!".

The parameter (given from call.bf) is at S4 at start.

Run / Output
------

$ node run.js<br />
Hello World, bf!
