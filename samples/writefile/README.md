WRITEfile sample
================

This sample shows how to open a file for writing.

run.js
------

This is only the bootstrap file. It only run the writefile.bf file with the brainfuck interpreter.

writefile.bf
-------

This file is really simple. First we have to activate the extended mode so we can use the register to use extended functions. This happens in line 2.

In line 5 and 6 we only prepare the text.

Now we write 'text.txt' to the stack beginning at S4. This is the filename of the file we want to open. Next we write a EOT (0x04) as filename end.

Now we have:<br />
t e s t . t x  t  EOT <br />
4 5 6 7 8 9 10 11 12

To run the file, we have to announce the address of the filename (S4). For this, we have to write the address (4) to S2.

The brainfuck interpreter have to know, what to do. To open a file, we have to write 4 (open file for writing) to S1.

Finally we run the function with set S0 to 1.

Notice: After the call S0 and S1 will be set to 0 by the interpreter.

Now we can write from file with .!

After writing we have to close file. For this write 0x05 to S1 and 0x01 to S0.


Run / Output
------

$ node run.js<br />
$ cat text.txt<br />
Hello World!
