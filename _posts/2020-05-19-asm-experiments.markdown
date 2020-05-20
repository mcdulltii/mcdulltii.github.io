---
layout: post
title:  "ASM-Experiments"
author: Aaron Ti
date:   2020-05-19
category: Exploits
abstract: Experiments with ASM Shellcodes in C++. Contains Exploits on Shellcode Generation and Loading of Functions within the Kernel and DLLs
website: https://github.com/mcdulltii/asm-experiments
---

## Methodology (ASM & ASM2)

Obtain address of GetProcAddress from address table

Call GetProcAddress to obtain address of LoadLibrary within kernel32.dll

Call LoadLibrary to load user32.dll

Call GetProcAddress to obtain address of a function within user32.dll

    eg. SwapMouseButton / MessageBoxA

Call function with required variables --> exploited!

Call GetProcAddress to obtain address of ExitProcess within kernel32.dll

Call ExitProcess to kill the executable process cleanly

REF: [Windows Shellcode Exploit](https://securitycafe.ro/2016/02/15/introduction-to-windows-shellcode-development-part-3/)

## Methodology (code & Crashinjector)

Iterates through kernel32.dll ordinals and compare function hashes for function to be injected

When function hash is found, call function with required variables within injected parent process --> exploited!

REF: [Shellcode PID Injection](http://www.rohitab.com/discuss/topic/40820-writing-shellcode-in-c/)
