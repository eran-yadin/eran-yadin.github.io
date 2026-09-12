---
title: Convolution
description: What convolution actually does — flip, slide, sum — and using it to smooth a noisy signal, with an interactive Python visualizer.
date: 2026-08-29
tags: [dsp, python, math]
---

# basic
we are going to talk about convolution in regard of N time stamps
we can calcilate the convolution of 2 functions using simple tactic
take one flip him
take is N's relative to n
and then Sigma them together

# example
in this example we see 2 u(n) function in convolution
![[convolution 1.png|422|422]]
in the bottom you can see in green the result 
red is h
blue is x
and right now they are not overlaying each other
so the result is 0
![[convolution 2.png|454|454]]
now we are in the middle of the overlay process
so the more we move the h the more we get in the result because there are more part to sum in the Sigma
![[convolution 3.png|407|454x244]]
now we are fully inside (the h is inside the x) and there for there is no change
![[convolution 4.png|409|453x243]]
and here is the result
# why
we do we need it
of course we can know the result if we have one convolution. bla bla 
we are not asking this
i want to know what the fuck can i do with it
smoothing
like blurring image, in photoshop
we can smooth or blur a signal
filtering out weird sounds

# example
here i create a simple function to smooth noise from a signal
![[convolution 5.png|697|697]]
here we can see:
blue - x: is the noise
red - h: is the smoother
the bigger the h the more smooth
green is the result
here is with h = 5
![[convolution 6.png]]
and here is with h = 40
![[convolution 7.png]]
what we are doing in hear is basic filtering and smoothing sound in the most dumb way. if you want to actually filter high or low pitch take a look Fourier filter.
https://en.wikipedia.org/wiki/Discrete_Fourier_transform
in the most basic: turn signal to separated frequencies choose which one fall less and which one get boosted. 
we can also talk on unwanted filtering because of analog to digital translation and so on. 
which is smoothing ill do in an other note.
you want little mind fuck take a look on [sinc](https://en.wikipedia.org/wiki/Sinc_function) function in the [fft](https://en.wikipedia.org/wiki/Fast_Fourier_transform) 
# code
here is the code:
## part 1
```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
  
# הגדרת ציר משתנה העזר k
k = np.arange(-5, 25)
  
# 1. יצירת אות הכניסה x[k] (אות מרובע שמתחיל ב-0 ומסתיים ב-10)
x = np.where((k >= 0) & (k <= 10), 1.0, 0.0)
  
# 2. הגדרת פונקציה לתגובת ההלם h[n-k]
# ניצור חלון ברוחב 4. נחלק ב-4 כדי לייצר ממוצע אמיתי (smooth)
window_width = 4
def get_h_shifted(n, k_array):
    # עבור כל איבר ב-k, נבדוק את הערך של h במיקום n-k
    indices = n - k_array
    return np.where((indices >= 0) & (indices < window_width), 1.0 / window_width, 0.0)
  
# 3. הכנת הגרפים
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))
plt.subplots_adjust(bottom=0.25, hspace=0.4)
  
# גרף עליון: x[k] ו- h[n-k]
markerline_x, stemlines_x, baseline_x = ax1.stem(k, x, linefmt='b-', markerfmt='bo', basefmt='k-', label='x[k] (Signal)')
markerline_h, stemlines_h, baseline_h = ax1.stem(k, get_h_shifted(0, k), linefmt='r--', markerfmt='ro', basefmt=' ', label='h[n-k] (Window)')
ax1.set_title("Shift & Multiply: x[k] and h[n-k]")
ax1.set_xlabel("k")
ax1.set_xlim([k[0], k[-1]])
ax1.set_ylim([-0.2, 1.5])
ax1.legend()
ax1.grid(True)
  
# גרף תחתון: y[n]
n_vals = np.arange(-5, 25)
y_vals = np.zeros_like(n_vals, dtype=float)
markerline_y, stemlines_y, baseline_y = ax2.stem(n_vals, y_vals, linefmt='g-', markerfmt='go', basefmt='k-', label='y[n] (Output)')
ax2.set_title("Sum: y[n] = x[n]*h[n]")
ax2.set_xlabel("n")
ax2.set_xlim([n_vals[0], n_vals[-1]])
ax2.set_ylim([-0.2, 1.5])
ax2.legend()
ax2.grid(True)
  
# 4. הוספת הסליידר (Slider)
ax_n = plt.axes([0.2, 0.1, 0.65, 0.03])
slider_n = Slider(ax_n, 'Time (n)', n_vals[0], n_vals[-1], valinit=n_vals[0], valstep=1)
  
# 5. פונקציית העדכון שתרוץ בכל פעם שמזיזים את הסליידר
def update(val):
    current_n = int(slider_n.val)
    # עדכון המיקום של החלון המשוקף והמוזז
    current_h_shifted = get_h_shifted(current_n, k)
    # עדכון הגרף העליון
    markerline_h.set_ydata(current_h_shifted)
    # חישוב הערך החדש של y[n] (סכום המכפלות)
    current_y = np.sum(x * current_h_shifted)
    # עדכון מערך התוצאות עד לזמן הנוכחי
    idx = np.where(n_vals == current_n)[0][0]
    y_vals[:idx+1] = [np.sum(x * get_h_shifted(n, k)) for n in n_vals[:idx+1]]
    y_vals[idx+1:] = np.nan # מסתיר את הערכים העתידיים שעוד לא חישבנו
    # עדכון הגרף התחתון
    markerline_y.set_ydata(y_vals)
    fig.canvas.draw_idle()

slider_n.on_changed(update)
update(n_vals[0]) # אתחול המצב הראשון

  
plt.show()
```
## part 2
```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
  
# הגדרת ציר משתנה העזר k
k = np.arange(-10, 100)
  
# 1. יצירת אות הכניסה x[k] (אות מרובע שמתחיל ב-0 ומסתיים ב-10)
# 1. יצירת אות הכניסה x[k] (אות "מגעיל" ורועש)
np.random.seed(42) # כדי שהרעש יהיה קבוע בכל הרצה
base_signal = np.sin(0.4 * k) # הגל המקורי והחלק (סינוס)
noise = 0.6 * np.random.randn(len(k)) # קפיצות אקראיות
x = base_signal + noise
# 2. הגדרת פונקציה לתגובת ההלם h[n-k]
# ניצור חלון ברוחב 4. נחלק ב-4 כדי לייצר ממוצע אמיתי (smooth)
window_width = 40
def get_h_shifted(n, k_array):
    # עבור כל איבר ב-k, נבדוק את הערך של h במיקום n-k
    indices = n - k_array
    return np.where((indices >= 0) & (indices < window_width), 1.0 / window_width, 0.0)
  
# 3. הכנת הגרפים
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))
plt.subplots_adjust(bottom=0.25, hspace=0.4)
  
# גרף עליון: x[k] ו- h[n-k]
markerline_x, stemlines_x, baseline_x = ax1.stem(k, x, linefmt='b-', markerfmt='bo', basefmt='k-', label='x[k] (Signal)')
markerline_h, stemlines_h, baseline_h = ax1.stem(k, get_h_shifted(0, k), linefmt='r--', markerfmt='ro', basefmt=' ', label='h[n-k] (Window)')
ax1.set_title("Shift & Multiply: x[k] and h[n-k]")
ax1.set_xlabel("k")
ax1.set_xlim([k[0], k[-1]])
ax1.set_ylim([-0.2, 1.5])
ax1.legend()
ax1.grid(True)
  
# גרף תחתון: y[n]
n_vals = np.arange(-10, 100)
y_vals = np.zeros_like(n_vals, dtype=float)
markerline_y, stemlines_y, baseline_y = ax2.stem(n_vals, y_vals, linefmt='g-', markerfmt='go', basefmt='k-', label='y[n] (Output)')
ax2.set_title("Sum: y[n] = x[n]*h[n]")
ax2.set_xlabel("n")
ax2.set_xlim([n_vals[0], n_vals[-1]])
ax2.set_ylim([-1.5, 1.5])
ax2.legend()
ax2.grid(True)
  
# 4. הוספת הסליידר (Slider)
ax_n = plt.axes([0.2, 0.1, 0.65, 0.03])
slider_n = Slider(ax_n, 'Time (n)', n_vals[0], n_vals[-1], valinit=n_vals[0], valstep=1)
  
# 5. פונקציית העדכון שתרוץ בכל פעם שמזיזים את הסליידר
def update(val):
    current_n = int(slider_n.val)
    # עדכון המיקום של החלון המשוקף והמוזז
    current_h_shifted = get_h_shifted(current_n, k)
    # עדכון הגרף העליון
    markerline_h.set_ydata(current_h_shifted)
    # חישוב הערך החדש של y[n] (סכום המכפלות)
    current_y = np.sum(x * current_h_shifted)
    # עדכון מערך התוצאות עד לזמן הנוכחי
    idx = np.where(n_vals == current_n)[0][0]
    y_vals[:idx+1] = [np.sum(x * get_h_shifted(n, k)) for n in n_vals[:idx+1]]
    y_vals[idx+1:] = np.nan # מסתיר את הערכים העתידיים שעוד לא חישבנו
    # עדכון הגרף התחתון
    markerline_y.set_ydata(y_vals)
    fig.canvas.draw_idle()
  
slider_n.on_changed(update)
update(n_vals[0]) # אתחול המצב הראשון
  
plt.show()
```
## if you having trouble
```python
import subprocess, sys
  
packages = [
    "numpy",
    "matplotlib",
]
  
subprocess.check_call([sys.executable, "-m", "pip", "install"] + packages)
print("\nAll done. Run: python conv_with_N.py")
```
## explanation 
### conv_with_N.py
Interactive visualization of discrete convolution: a noisy signal `x[k]` convolved with a moving-average window `h[n-k]`.
#### Run
```sh
python conv_with_N.py
```

#### What you see
- **Top plot** — the input signal `x[k]` (blue) and the sliding window `h[n-k]` (red)
- **Bottom plot** — the output `y[n]`, built up step by step
#### How to use
Drag the **Time (n)** slider at the bottom to move the window across the signal. The output plot fills in as you advance `n`.
#### Tweak

| Variable | Location | Effect |
|---|---|---|
| `window_width` | line 16 | Width of the averaging window (default: 20) |
| `k` range | line 6 | Range of the input signal |
| `noise` amplitude | line 12 | Amount of noise added to the sine wave |