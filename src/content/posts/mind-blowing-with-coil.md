---
title: Mind blowing with coil
description: Everything is a capacitor — even a disconnected coil. A rough-estimate LTspice thought experiment about the parasitic capacitance hiding in plain sight.
date: 2026-08-29
tags: [electronics, spice, physics]
---

# Everything is a Capacitor
In electricity it's very hard to grasp that the rules you learn in class also apply to everyday objects.
So let me ask you a question:
What would happen if I just took a coil out of a system — would it stay charged?
On the surface you'll think that's stupid — nothing is going to happen. But then you think: wait… if I do it with a capacitor, it stays charged. Does the coil work the same way? If that were the case, a coil would act as a battery — which is true, except it's a constant-current source, and current is just the movement of electrons.
Things are starting to break.
But this is the beautiful part: the answer is more straightforward than you think.
And it all has to do with capacitance.
We learned in physics: a capacitor is two metal sheets that are not touching.
Capacitance is just the area of the metal sheets and the distance between them, with a factor for the material between them.
What if everything acts like this? Your car forms a capacitor with you, and when you touch its metal body, the car discharges all the charge stored in its side — shocking you on the way.
So everything is a capacitor; we just don't notice it, because it's not the formal way we think about capacitors.
# The Coil Problem
OK, let's get back to the coil problem. We can all agree that when current flows through a coil, an electromagnetic wave is created around it. When we disconnect the coil, we're left with the electromagnetic wave but without the source of energy. Now comes the best part: the entire coil acts as a capacitor relative to the ground. For this demonstration, and to keep it simple, we'll treat the two sides of the coil — the two unconnected cables — as the metal sheets, and the ground as the other side. It is very hard to wrap your head around.
Here is the schematic for this demonstration:
![[The Coil Problem-1.png]]
The right side of C1 and the left side of C2 are the ends of the coil's cable.
Now we are going to find the capacitance of the capacitors.
For this, let's say we are using a cable with a radius of R.
So the area of the sheet is $A=\pi R^2$.
And the distance is the distance between the two sides of the coil.

> [!NOTE]
> Again, what I'm doing here is a very, VERY rough estimation, with very rough assumptions —
> meaning it's only for understanding the concept.
> If I really tried to calculate the capacitance of the coil, I would also have to work on each loop, calculating the surface and sides — which can be roughly estimated by L⋅2R⋅N where:
> - L = coil length in loops
> - 2R = diameter
> - N = number of loops

---
Let's create a coil:
- **Diameter (d):** $1[mm]=0.001[m]$
- **Radius (r):** $0.0005[m]$
- **Number of turns (N):** 100
- **Length (l):** $20[cm]=0.2[m]$
- **Core Material:** Compressed Ferrite (assuming a common relative permeability $μr​≈1000$)
- **Vacuum Permeability (μ0​):** $4\pi ×10^{-7}[\frac{Tm}{A}]$
$$L≈\frac{0.21.256×10^{−3}⋅10000⋅7.854×10^{−7}​}{0.2}$$ 
$$L=4.93×10^{-5}[H]$$
----
Now for the capacitor:
- **Area (A)**: $7.853×10^{-7}[m^2]$
- **Distance (d)**: $0.2[m]$
$$C=\frac{κ⋅ε0​⋅A}{d}​$$ $$C=\frac{1⋅8.854×10^{-12}⋅7.853×10^{-7}}{0.2}=3.476×10^{-17}$$
Very tiny.
The graph of the current over time looks like this.
![[The Coil Problem-2.png]]
This is in the span of 1 second.
We see a lot of straight line, but at the start there is a little color, like a jump.
Let's zoom in.
![[The Coil Problem-3.png]]
This is in the span of 1 nanosecond.
We see a very short burst of energy, which waves back and forth in the coil, losing energy over time.
The inductor by default has a small resistance of $1[m\Omega]$ in LTspice.
This demonstrates the great idea: everything is a capacitor to some degree, but the reason we can't see it by default is that it's so short — it just looks instantaneous.
This is something that happens a lot in electrical engineering. Short, inconceivable time frames on very small components can add up to the bigger picture. In this time the energy from the burst turns into magnetic fluctuations in the coil — a damped oscillation, because of the coil's resistance, dissipating as heat.

> [!tip]
> Short, inconceivable changes, in a fraction of a time frame, by small overlooked components, can combine into a bigger result — one that seems out of the ordinary.

