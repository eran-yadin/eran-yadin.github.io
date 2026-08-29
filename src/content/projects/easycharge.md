---
title: EasyCharge
description: A management system for electric-vehicle charging stations written in C — binary search trees, linked lists and a FIFO queue behind a menu-driven console app.
date: 2025-07-18
tags: [c, data-structures, course-project]
status: done
repo: https://github.com/eran-yadin/EasyCharge
---

Written for a college systems-programming course. It runs as a menu-driven console app over a plain-text
database and covers the life of a charging session: find the nearest station, put a car on a port, check on
it, stop the charge and bill it.

Behind the menu sit the data structures the course was actually about:

- stations in a **binary search tree**, cars in a second tree;
- ports as a **linked list** per station;
- a **FIFO queue** of cars waiting when every port is busy.

## The database

Four CSV-style text files, read at the top of every menu iteration and rewritten after it, so the on-disk
state is always current.

| file | row |
|---|---|
| `Stations.txt` | `ID,StationName,NumOfPorts,CoordX,CoordY` |
| `Ports.txt` | `StationID,PortNumber,PortType,Status,…,CarLicense` |
| `Cars.txt` | `License,PortType,TotalPayed,StationID,PortNumber,InQueue` |
| `LineOfCars.txt` | `License,StationID` — the waiting queues |

## Build

The repository is a Visual Studio 2022 solution (`app.sln`) — open and build. On Linux/macOS it needs two small
fixes (a missing `<errno.h>` include and an integer-as-pointer sentinel that GCC 14+ rejects); with those it
compiles with `gcc -std=c11`. Run it from `app/`, since the data files are opened by relative path.
