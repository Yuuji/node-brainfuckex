node-brainfuckex
================

Brainfuck extended for node.js

Brainfuck extended is brainfuck with a register extension

debugging
---------
Use # in code and the interpreter will output debug information

use extended mode
-----------------

First you need to enable the extended modus. First set cell #1 to 0x1B (ESC), then set cell #0 to 1. Extended mode is now enabled. Cell #0 is set to 0 automatically after that. Cell #1 is set to 1 if extended mode is enabled or to 0 if extended mode is disabled.

To deactivate extended mode do the same.

Sample code to enable: (start with pointer at #0, ends with pointer at #0):

    >+[[-]>+++++[<+++++>-]<++<+>-]<

Sample code to disable: (start with pointer at #0, ends with pointer at #0):

    >+[[-]>+++++[<+++++>-]<++<+>]<

Call file
---------

To call a file the extended mode must be enabled! Every called file will run in sandbox mode (own memory)!

First write the filename (you can ignore the extension if it is .bf oder .js and there is no file with ne filename without the extension) to the stack, e.g. S4.

If there are arguments, you have to set the next address to ETX (0x03), then the arguments. Between every argument there must be a ETX as delimiter. But not after the last argument!

Last finish the arguments with a EOT (0x04).

Sample without arguments:

    f i l e n a m e EOT

Sample with argument:

    f i l e n a m e ETX a r g 1 ETX a r g 2 EOT


To announce the address of the arguments (S4 in the sample) you have to write it (4) to S2.
Also you always have to announce the address where the return value will be saved to S3. Also if there will be no return value!

At least write 0x02 to S1 (0x02: run file). And set S0 to 0x01 (do it!).

After call S0 and S1 will be cleared to 0.

Return
------

To return the extended mode must be enabled!

First write the value to the stack, e.g. S4.

If there are more then one return value, you have to set the the address between two values to ETX (0x03). Between every return value there must be a ETX as delimiter. But not after the last return value!

Last finish the return values with a EOT (0x04).

Sample with one return value:

    v a l 1 EOT

Sample with two return values:

    v a l 1 ETX v a l 2 EOT


To announce the address of the return values (S4 in the sample) you have to write it (4) to S2.

At least write 0x01 to S1 (0x01: return). And set S0 to 0x01 (do it!).

the code will stop after this


Open file for reading
---------------------

To open a file for reading the extended mode must be enabled!

First write the filename to the stack, e.g. S4, followed by a EOT (0x04).

To announce the address of the return values (S4 in the sample) you have to write it (4) to S2.

At least write 0x03 to S1 (0x03: open file for reading). And set S0 to 0x01 (do it!).

Now you can use , for read one char from file.

After call S0 and S1 will be cleared to 0.

Open file for writing
---------------------

To open a file for writing the extended mode must be enabled!

First write the filename to the stack, e.g. S4, followed by a EOT (0x04).

To announce the address of the return values (S4 in the sample) you have to write it (4) to S2.

At least write 0x04 to S1 (0x04: open file for writing). And set S0 to 0x01 (do it!).

Now you can use . for write one char from file.

After call S0 and S1 will be cleared to 0.

Close file
---------------------

To close a file pointer (after reading or writing) the extended mode must be enabled!

First write the filename to the stack, e.g. S4, followed by a EOT (0x04).

To announce the address of the return values (S4 in the sample) you have to write it (4) to S2.

At least write 0x05 to S1 (0x05: close file). And set S0 to 0x01 (do it!).

After call S0 and S1 will be cleared to 0.
