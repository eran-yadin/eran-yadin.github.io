---
title: Mind blowing with coil
description: Everything is a capacitor — even a disconnected coil. A rough-estimate LTspice thought experiment about the parasitic capacitance hiding in plain sight.
date: 2026-08-29
tags: [electronics, spice, physics]
---

# Everything is a Capacitor
In electricity its very hard to understand that the rules you know in the class also apply to everyday objects
For this i will ask you a question:
What would happen if ill just take a coil out of an system will it stay charged?
On the surface you will think that stupid, nothing is going to happen. But you thing, wait.. if i do it with capacitor it stay charge. Does the coil work the same way? If that was the case coil would act as an battery, which is true but is an constant-current source and current is just the movement of electrons.
Thing are starting to break.
But this is why its beautiful that answer is more straight forward then you think.
And it all have to do with capacitance.
We learned in physics: capacitor is two metal sheets which are not touching.
Capacitance is just the area of the metal sheets and the distance between them with a factor of the material between the them.
What if everything act like this. your car is a capacitor with you and when you touch the metal part of the car, the car discharge all the charge in the side of the car and shock you on the way.
So everything is a capacitor, we are not noticing it because its not the formal way we think on capacitors.
# The Coil Problem
Ok lets get back to the coil problem, we can all a agree that when current flow through the coil electro magnetic wave is created a round the coil. When we disconnect the coil we stay with the electromagnetic wave but without the source of energy. Now come the best part, the entire coil act as a capacitor compare to the ground. For this demonstration and for ease we are going to thing on the 2 sides of the coil, the 2 unconnected cable as the metal sheet and the other side of the sheet as the ground. It is very hard to wrap your head around it.
Here is the schematic for this demonstration
![[The Coil Problem-1.png]]
The right side of C1 and the left side of C2 is the edges of the cable of the coil.
Now we are going to find the capacitance of the capacitors.
For this we are going to say we are using a cable with radius of R.
So the size of the sheet is $A=\pi R^2$ .
And the distance is the distance between the 2 sides of the coil.

> [!NOTE]
> Again what I'm doing here is very VERY rough estimations, with very rough assumptions
> meaning its only for the understanding of the concept.
> If ill would really try to calculate the capacitance of the coil ill have also to work on each loop, calculating the surface and side, which can be rough estimated by L⋅2R⋅N where:
> - L = coil length in loop
> - 2R = diameter
> - N = number of loops

---
Lets create an coil, it
- **Diameter (d):** $1[mm]=0.001[m]$
- **Radius (r):** $0.0005[m]$
- **Number of turns (N):** 100
- **Length (l):** $20[cm]=0.2[m]$
- **Core Material:** Compressed Ferrite (assuming a common relative permeability $μr​≈1000$)
- **Vacuum Permeability (μ0​):** $4\pi ×10^{-7}[\frac{Tm}{A}]$
$$L≈\frac{0.21.256×10^{−3}⋅10000⋅7.854×10^{−7}​}{0.2}$$ 
$$L=4.93×10^{-5}[H]$$
----
Now for the capacitor
- **Area (A)**: $7.853×10^{-7}[m^2]$
- **Distance(m)**: $0.2[m]$
$$C=\frac{κ⋅ε0​⋅A}{d}​$$ $$C=\frac{1⋅8.854×10^{-12}⋅7.853×10^{-7}}{0.2}=3.476×10^{-17}$$
Very tiny.
What we are getting from the graph of the current over time look like this.
![[The Coil Problem-2.png]]
This is in the span of 1 second.
We see a lot of straight line but at the start there is a little color, like a jump.
Lets zoom in.
![[The Coil Problem-3.png]]
This is in the span 1 nano second.
We see a very short burst of energy, which wave back an forward in the coil, loss energy over time.
The inductor by default have small resistance of $1[m\Omega]$ in the LTspice software.
This demonstrate the great idea which is; everything is a capacitor at some degree, but the reason we cant see this by default is because its so short, it just look like instance.
This is something which happen a lot in electrical engineering.  Short unconceivable time, on very small components can contribute to the bigger picture. In this time the energy from the burst which turn to magnetic fluctuations in the coil, damped oscillation because of resistance of the coil, dissipating as heat.

> [!tip]
> Short inconceivable changes in fraction of a time frame by small undertook components can lead by combination to a bigger result, which seem out of the ordinary

