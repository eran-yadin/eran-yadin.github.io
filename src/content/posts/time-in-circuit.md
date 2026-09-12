---
title: Time in circuit
description: Limits, neglecting small numbers, and why a good engineer knows what NOT to calculate.
date: 2026-08-29
tags: [engineering, math, spice]
---

When we first interacted with math in college — calculus — we got the chance to use limits, epsilons and striving to infinity. At first glance those, like many other terms in math, look unimportant, untouched by the day-to-day. This of course is very wrong and misleading.
Today we are going to wrap our heads around limits and neglecting small numbers, and how they can save you time in electrical engineering — and in engineering overall.

> [!NOTE]
> An engineer can calculate down to minuscule or infinite numbers; a good engineer can neglect those to save time and money and improve efficiency, while not giving up on precision.

# Understanding
To understand the idea of neglecting small numbers, there are two ways to think about it: precision and size.
With size, think about the ground. The ground is made of a lot of rocks of different sizes, from boulders all the way down to small pebbles and dust particles. When you drive a car, you don't care about the dust particles, but you do care about small pebbles, because your suspension can't smooth them out. Now you drive a big truck, and the pebbles are none of your concern — but the boulders still are.
Different uses, sizes and speeds affect what you can neglect.
Now for a more mathematical way to understand it. You measure a distance. What precision do you need to write down / measure? It depends on the use case. If the distance is very small, then every digit after the decimal is important. Take board manufacturing: you can think in millimeters, because the width of a wire on the board is a tenth of a millimeter. Now you measure a house, and a distance of tens of millimeters is not that important — the tools you use can't even give results at that precision.
Think of pi, 3.1415926. Think how little the digit 6 adds compared to the digit 4. If the 3 is in meters, then the 6 is $6/10000000$ of a meter — less than the width of a strand of hair.
# Infinite
If something is striving to infinity — for example the x on a graph — then a small number relative to it (to x) is getting infinitely small. In mathematical terms:
$$ \displaystyle \lim_{x \to \infty } \frac{c}{x}$$
where $c$ is a small number (1, 9, 10, 356, 9834) and $x$ strives to infinity.
So if the small number is so small, can we just say that it strives to zero? In this case, yes. Then what we get is:
$$ \displaystyle \lim_{x \to \infty } \frac{c}{x}=\frac{0}{x}=0$$
But I can't do this if the number on top, for example, strives to infinity too. For example:
$$ \displaystyle \lim_{x \to \infty } \frac{x}{3x}=\frac{1}{3}$$
We can get rid of the $x$ and stay with a final number.
I think I've explained this enough, mathematically and realistically.
# How does it affect my circuit
In real life everything has some resistance, impedance and capacitance. If we want to simulate a circuit, we face a problem: too many parameters, adding time to calculation and simulation. But if you think about it, the wire resistance is negligible compared to my 1k resistor. I can ignore the wire resistance and still get pretty accurate measurements.
This is one way we can use the tricks I showed you before to gain more efficiency.
Most of the tricks that save time in the math behind circuitry are built on the idea of small and large numbers — and most importantly, their ratio.