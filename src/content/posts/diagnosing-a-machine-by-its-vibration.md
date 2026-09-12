---
title: Diagnosing a machine by its vibration
description: A data-analysis training game — an accelerometer recording, a machine that "sounds weird", and an FFT hunt that ends at a single damaged gear tooth.
date: 2026-09-12
tags: [dsp, python, data-analysis, vibration]
---

I built myself a training exercise: a coolant pump skid that "sounds weird", 4 seconds of accelerometer
data, and one question — **is something wrong, and if so, which component?** This post is the problem and
the solution I found, plots and all.

## The problem

The machine is a coolant pump running 24/7 at a steady operating point: an induction motor drives a 4:1
gearbox, the gearbox drives a centrifugal pump. An accelerometer sits on the motor-side gearbox housing,
vertical axis. There are two recordings in one CSV, both 4.0 s at 5000 Hz:

- `baseline_g` — recorded 3 months ago, machine known healthy
- `current_g` — recorded yesterday, after the techs reported a **rhythmic "growl"** that wasn't there before

What the nameplate gives us to work with:

| Parameter | Value |
|---|---|
| Motor nominal speed | 1750 RPM (≈ 29 Hz shaft speed) |
| Gearbox ratio | 4:1 reduction |
| Pinion / gear teeth | 23 / 92 |
| Motor-side bearing | 9 rolling elements (BPFO ≈ 3.572×, BPFI ≈ 5.428× shaft speed) |
| Pump impeller | 6 vanes on the gearbox output shaft |
| Mains | 50 Hz (expect some pickup) |

The useful thing about a steady-duty machine: anything weird in the data is from the machine itself, not
from changing operating conditions.

> [!tip] Why the nameplate matters
> Every rotating part writes its signature at a predictable frequency: the motor shaft at 1× ≈ 29 Hz, the
> **gear mesh at 23 teeth × 29 Hz ≈ 670 Hz**, bearings at their BPFO/BPFI ratios, the impeller at 6× pump
> shaft speed. Diagnosis is matching the peaks you find to the frequencies the machine *could* produce.

## Time domain first

First look — just plot both signals over time:

```python
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

df = pd.read_excel("machine_vibration.xlsx")
Time, BaseLine, Weird = df['time_s'], df['baseline_g'], df['current_g']

fig = plt.figure()
BaseAx, WeirdAx = fig.add_subplot(2,1,1), fig.add_subplot(2,1,2)
BaseAx.plot(Time, BaseLine, linewidth=0.1);  BaseAx.set_title("Base Line")
WeirdAx.plot(Time, Weird, linewidth=0.1);    WeirdAx.set_title("Weird Line")
plt.tight_layout()
```

![[attachments/time-domain.png]]

You can see there *is* a difference between the baseline and the current state — the current signal is
visibly fatter. But that's all the time domain gives you: something changed. To say *what* changed we need
the frequency content.

## Into the frequency domain

FFT of each signal, frequency axis in Hz:

```python
fs = 5000
N  = len(BaseLine)
BaseLine_fft = np.fft.fftshift(np.fft.fft(BaseLine))
Current_fft  = np.fft.fftshift(np.fft.fft(Weird))
f_hz = np.fft.fftshift(np.fft.fftfreq(N, d=1/fs))
```

![[attachments/baseline-fft.png]]

![[attachments/abnormal-fft.png]]

And the money plot — both spectra overlaid (current in red, baseline dashed blue):

![[attachments/overlay-fft.png]]

The current recording is peaking far above the baseline around **670 Hz** — which is exactly the
**Gear Mesh Frequency**: 23 pinion teeth × ~29 Hz motor shaft = ~670 Hz.

## Filtering the peaks out of the noise

To compare the two spectra properly I reduced each one to a list of real peaks: clip everything below an
amplitude of 500 (that's the noise floor), keep only the positive-frequency half, and export what survives:

```python
amp_cut = 500
half = len(f_hz) // 2
spectrum = np.clip(np.abs(Current_fft), amp_cut, None)[half:]

peaks = [(f, a) for f, a in zip(f_hz[half:], spectrum) if a > amp_cut]
pd.DataFrame(peaks, columns=['frequency', 'amplitude']).to_excel("freq_abnormal.xlsx")
```

I moved both peak lists into Excel and examined them side by side:

![[attachments/freq-table-excel.png]]

Three clear "stairs" of frequency groups:

1. **Low (7–104 Hz)** — shaft speeds, 50 Hz mains pickup. **No change** from baseline. So the shafts,
   coupling and mains environment are fine.
2. **Mid (641–700 Hz)** — the GMF cluster. **Grew ~3.3×** compared to baseline. Note the shape: a big
   peak at ~670 Hz with **sidebands at ±29 Hz** (641 and 700 Hz) — the gear mesh is being modulated once
   per *motor shaft* revolution.
3. **High (1312–1371 Hz)** — appeared out of nowhere. But 1341 ≈ 2 × 670: this is just the **2nd harmonic
   of the GMF**, with the same ±29 Hz sidebands.

The ±29 Hz spacing is the key. 29 Hz is the *pinion* shaft (motor side), not the 7.3 Hz gear shaft. A
defect that hits once per pinion revolution and excites the gear mesh means the problem is on one of the
**23 pinion teeth** — and that once-per-rev pulse at 29 Hz is exactly the "rhythmic growl" the techs
described.

There's also a smaller cluster growing around 1500 Hz, again with ~29 Hz spacing — which makes me suspect
more than one tooth may be involved:

![[attachments/harmonics-1500hz.png]]

## Verdict

> [!check] Diagnosis
> **A damaged tooth (possibly more than one) on the 23-tooth pinion in the gearbox.**
> Evidence: ~3.3× growth of the gear-mesh frequency and its 2nd harmonic, both flanked by sidebands at
> the motor-shaft rate of ~29 Hz. Low-frequency content unchanged → shafts, coupling and bearings look fine;
> no vane-pass or broadband growth → the pump itself is healthy.
>
> **Action:** open the gearbox and visually inspect the pinion teeth. Nothing else needs maintenance.

## What I took from it

- The time domain tells you *that* something changed; the spectrum tells you *what*.
- Sideband spacing is a fingerprint: it names the shaft that carries the fault.
- A harmonic at 2× isn't a second problem — chasing 1341 Hz as its own defect would have been a dead end.

The FFT plumbing here is the same maths that powers [[projects/fourier-lab|Fourier Lab]], which is where I
first built the intuition for reading spectra.
