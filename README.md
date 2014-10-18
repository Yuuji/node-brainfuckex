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
