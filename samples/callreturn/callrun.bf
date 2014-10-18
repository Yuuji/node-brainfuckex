Enable extended mode:
>+[[-]>+++++[<+++++>-]<++<+>-]<

Now we try to run another brainfuck file:
>>>>++++++++++[<++++++++++>-]<
[>+>+<<-]
>
++++++++++++>						'p'
++++++++>							'l'
+++>								ETX (end of parameter)
+++++>								5
+++>								ETX (end of parameter)
++>									2
++++>								EOT (end of parameters)

<[<]<								jump to S2
++++								set text address to S4
>++++<								set return address to S4
<++									set function to run (2)
<+									ok run file

>>>>								jump to return value
>[-]>[-]++++++++[<++++++>-]<		8 mul 6
[<+>-]								S4 plus 48
<.									Output result
[-]++++++++++.						Enter
