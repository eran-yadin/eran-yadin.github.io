---
title: DE0 Calculator & LED Games
description: A 16-bit calculator with a multiplexed seven-segment display, plus two button-driven LED games, on a Terasic DE0 FPGA board — mixed schematic, Verilog and VHDL.
date: 2026-02-23
tags: [fpga, vhdl, verilog, quartus, course-project]
status: done
repo: https://github.com/eran-yadin/qar_final_2.0
---

Final project for a digital-systems course, built for the Terasic DE0 (Cyclone III `EP3C16F484C6`) in
Quartus II 9.1. The top level is a block-diagram schematic; the arithmetic and control blocks underneath are
Verilog and VHDL, and the wide adders, counters and multipliers are Altera LPM megafunctions.

Last successful fit: 1,912 of 15,408 logic elements (12%), 389 registers, 52 pins — plenty of room to spare.

## The calculator

Two 16-bit operands come from counters driven by the push buttons; `SW[9:8]` picks the operation; the 32-bit
result is converted to BCD and multiplexed across the seven-segment digits.

| `op_select` | operation |
|---|---|
| `00` | add |
| `01` | subtract |
| `10` | multiply |
| `11` | divide |

There are two ALU versions that differ on the non-commutative operations:

- **`alu_32bit`** computes `A − B` and `A / B` as written. If `A < B` the difference clamps to `0`;
  division by zero returns `0xFFFFFFFF` as an error marker.
- **`alu_32bit_2`** sorts the operands first and computes `max − min` and `max / min`, so the result is
  order-independent and never needs to go negative.

> [!tip] Toolchain note
> Quartus II 9.1 is required, not Quartus Prime — Cyclone III support was dropped after Quartus II 13.1,
> so recent versions cannot target this device at all.

## Build

Open `final_pro_E_D.qpf`, compile, program `final_pro_main.sof` over USB-Blaster (JTAG). Pin assignments are
committed in the `.qsf`; two Tcl scripts (`de0_pins.tcl`, `final_IO.tcl`) regenerate them if they're ever lost.
