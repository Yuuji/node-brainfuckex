Enable extended mode:
>+[[-]>+++++[<+++++>-]<++<+>-]<

Now we try to run another brainfuck file:
>>>>++++++++++[<++++++++++>-]<
[>+>+>>+>+<<<<<-]
>
++++>                                           'h'
+++++++++++++++++++>                            'w'
+++>                                            ETX (end of parameter)
-->                                             'b'
++>                                             'f'
++++>                                           EOT (end of parameters)
<[<]<                                           jump to S2
++++                                            set text address to S4
>++++<                                          set return address to S4
<++                                             set function to run (2)
<+                                              ok run file
