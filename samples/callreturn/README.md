Callreturn sample
================

This sample shows how to return values from called files

run.js
------

This is only the bootstrap file. It only run the callrun.bf file with the brainfuck interpreter.

callrun.bf
-------

This file is really simple. First we have to activate the extended mode so we can use the register to use extended functions. This happens in line 2.

In line 5 and 6 we only prepare the text.

Now we write 'pl' to the stack (p to S4 and l to S5). This is the filename of the file we want to run. Next we write a ETX (0x03) to S6. This is a parameter delimiter.

The second parameter is 0x05, the delimiter ETX and the third parameter is 0x02. We finish the parameters with a EOT (0x04).
Important: Don't enter a ETX after the last parameter!

Now we have:<br />
p l ETX 0x05 ETX 0x02 EOT <br />
4 5 6   7    8   9    10

To run the file, we have to announce the address of the parameters (S4). For this, we have to write the address (4) to S2.

Out file has no return value, but we also have to announce the address for the return value. We write the address (4) to S3.

The brainfuck interpreter have to know, what to do. To run a file, we have to write 2 (function call) to S1.

Finally we run the function with set S0 to 1.

Notice: After the call S0 and S1 will be set to 0 by the interpreter.

After the interpreter runs the pl.bf file, the result is saved in S4. We add 48 to the value (number to ascii) and output it.


pl.bf
-----

The given parameters we found in S4 und S6 with the delimiter ETX in S5.
We add the second argument (2) to the first argument (5) and saves it to S4.

Like in callrun.bf we set the address of the return value to S2.

To return the value, we have to set S1 to 1 (return). And call the interpreter to return (S0 to 1)

Run / Output
------

$ node run.js<br />
7
