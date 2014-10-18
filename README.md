node-brainfuckex
================

Brainfuck extended for node.js

Brainfuck extended is brainfuck with a register extension

use extended mode
=================

First you need to enable the extended modus. First set cell #1 to 0x1B (ESC), then set cell #0 to 1. Extended mode is now enabled. Cell #0 and #1 are set to 0 automatically after that.

To deactivate extended mode do the same.

Sample code (start with pointer at #0):
>[-]>+++++[<+++++>-]<++<+#
