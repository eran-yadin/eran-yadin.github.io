---
title: Time in circuit
description: Limits, neglecting small numbers, and why a good engineer knows what NOT to calculate.
date: 2026-08-29
tags: [engineering, math, spice]
---

when first interacted with math in collage, calculus, we got the chance to use limits, epsilons and infinite strive. those at first glance like many other terms in math look unimportant untouched by the day by day. this oncourse very wrong and misleading.
today we are going to wrap our head around limits and neglecting small numbers and they can save your time when it comes to electrical engineering and over all in engineering.

> [!NOTE]
> an engineer can calculate to mir small or infinite numbers, a good engineer can neglect those save time, money and improve efficiency, while not giving up on precision

# understanding 
to understand what is the idea of neglecting small numbers, there are two ways to thing about it; precision and size
with size, think about the ground, the ground made of a lot of rocks with diffrent sizes, from boulders all the way to small pebbles and dust particles. you drive a car, you don't care about the dust particles but you do car about small pebbles because your suspension cans smooth them out. now you drive a big truck and the pebbles are now non of your concern, but the boulder still are.
diffrent uses, size, speed effect what can you neglected.
now for more mathematic way to understand it. you measure an distance. what is the precision you need to write down\ measure. its depend on the use cans. if the distance is very small then every number after the decimal is important. take a board manufacturing, you can think in millimeter because the size of the wire on the board is one tens of a millimeter. now you measure an house and then distance of tens of millimeter is not that important, the tools you use cant give result at this precision. 
think of pie 3.1415926 think how little the digit of the 6 add compare to the digit of the 4 .if the 3 is in meters then the 6 is $6/10000000$ of a meter this is less then size of strand of hair
# infinite
if something is striving to infinite for example the x on a graph then a small number in relative to it (to x) is getting infinitely small. you can say by mathematic terms
$$ \displaystyle \lim_{x \to \infty } \frac{c}{x}$$
where $c$ is a small number (1,9,10,356,9834) and $x$ strive to infinite
so if the small number is so small can we just say that its strive to zero, in this case yes. then what we get is:
$$ \displaystyle \lim_{x \to \infty } \frac{c}{x}=\frac{0}{x}=0$$
where i cant do this if the number on the top for example strive to infinite too. for example
$$ \displaystyle \lim_{x \to \infty } \frac{x}{3x}=\frac{1}{3}$$
we can get rid of the $x$ and stay with final number
i think i explain this enough, mathematically and realistically.
# how does it effect my circuit
in real life everything have some resistance, impendence, capacitance. if we would like to simulate the circuit we will face a problem, too many parameters, adding time to calculation and simulation. but if you think about it the wire resistance is neglected compare to my 1k resistor. i can ignore the wire resistance, and still get pretty accurate measurements. 
this is one way we can use the tricks i should you before to gain more efficiency.
most of the tricks which save time in the math behind circuitry is build on the idea of small and large numbers and most importantly their ratio.