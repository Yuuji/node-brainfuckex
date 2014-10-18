Enable extended mode:
>+[[-]>+++++[<+++++>-]<++<+>-]<

Now we try to run another brainfuck file:
>>>>++++++++++[<++++++++++>-]<
[>+>+>+>+>>+>+>+<<<<<<<<-]
++++[>>>>>++++++++++<<<<<-]
>++++++++++++++++									't'
>+													'e'
>+++++++++++++++									's'
>++++++++++++++++									't'
>++++++												Point
>++++++++++++++++									't'
>++++++++++++++++++++								'x'
>++++++++++++++++									't'
>++++
[<]													Jump to S2
<++++												Set address of filename
<+++<+												Open file
>>>>												Jump to S4
,[.,]												Read file and output
[-]++++++++++										Enter
<<<+++++<+											Close file
