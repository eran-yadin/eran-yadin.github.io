---
title: Open Tractor CAN
description: Open hardware and software that lets owners of older tractors connect new technology to old iron — read the CAN bus, act as an ISOBUS tractor ECU, bridge to phones and laptops.
date: 2026-08-28
tags: [hardware, firmware, can-bus, isobus, agriculture, open-source]
status: research
featured: true
---

Modern ag tech — GPS guidance, telemetry, ISOBUS implements, phone apps — assumes a modern tractor.
Millions of working tractors from the 1990s–2010s have CAN buses (J1939 / ISOBUS / proprietary) that are
locked behind dealer tools, and older tractors have no bus at all. This project aims to change that.

## Goals

- **Read** — pull live data (engine RPM, speed, PTO, hitch, fuel, temperatures, fault codes) off an old
  tractor's CAN bus, or off add-on sensors on pre-CAN tractors.
- **Write** — send data *into* the tractor's world: act as an ISOBUS Tractor ECU so a modern implement gets
  ground speed / PTO / hitch info from an old tractor, or feed guidance and section-control data to a cab display.
- **Bridge** — expose all of that over BLE / Wi-Fi / USB / SocketCAN so phones, laptops, AgOpenGPS and
  farm-management software can use it.
- **Document** — build an open, community-maintained database of tractor CAN message definitions (DBC files)
  per make / model / year.

## Status

**Phase 0 — research.** Protocols, existing projects and candidate hardware have been surveyed; the next step
is picking a target tractor to capture real bus traffic from.

> [!warning] Safety first
> A tractor is a multi-tonne machine. Anything that *writes* to the bus is done in listen-only mode first,
> then in the shop with the wheels chocked, and never in the field until proven.

## Planned layout

| Part | What lives there |
|---|---|
| `hardware/` | KiCad sources for the interface board |
| `firmware/` | MCU firmware (ESP32 or similar) for the board |
| `software/` | Host-side tools: logging, decoding, apps, integrations |
| `data/dbc/` | Open CAN message definitions per tractor make/model |
| `docs/` | Design notes, research, protocol references |

## Licensing

Everything is meant to be reusable by anyone: hardware under CERN-OHL-S, firmware and software under GPL-3.0,
data and docs under CC-BY-SA-4.0. If you have a tractor with a CAN bus and a laptop, you can contribute by
capturing and sharing a log.
