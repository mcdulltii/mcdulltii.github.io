---
layout: post
title:  "CTFSGCTF 2022 Writeups"
author: Aaron Ti
date:   2022-03-13
category: CTF Writeups
abstract: CTFSGCTF 2022 Authored Reverse-Engineering Writeups
---

## Introduction

This is the second run of CTFSGCTF! Looking back at the first run of the CTF, there are much more people participating this time round. The challenges that I authored last year were unsolved, so I made sure this year’s are easier. I’m proud to say that 2 out of the 3 challenges I created this year are solved, with the last challenge partially understood.

Okay, enough dragging. Next are my write-ups for the 3 challenges I created.

---

## Disappointment

Challenge file [Download](https://raw.githubusercontent.com/mcdulltii/coding/master/CTFSG_RE/calc.exe)

### Challenge concept

Runtime nondeterminism to randomly choose functions to run. Uses pyinstaller and Cython to compile scripts.

### Description

```
WhY yOu nOt DoCToR yeT?
```

### Solution

Use pyinstxtractor to decompile pyinstaller executable. Since these python modules that are decompiled by pyinstxtractor are encrypted, the key can be found in `calc.exe_extracted\pyimod00_crypto_key.pyc`.

By referring to the pyinstaller documentation, python modules `.pyc.encrypted` are encrypted using tinyaes with AES CTR, and Zlib compressed. The decrypted python `.pyc` modules can then be decompiled using `decompyle3`.

The flag decryption function can be found in `evaluator.pyc`, where the `decrypt_flag` extern function is called when `self.count >= 50` and `expression == OBTAIN_STRING`. However, when these conditions are correct, only the class is used within `decrypt_flag`.

As the `decryptor.pyd` binary where `decrypt_flag` is exported from, is decompiled from pyinstxtractor, we can just create our own script to import `decrypt_flag`. When the function is called by itself and with class arguments, python will give errors based on what variables and class arguments are required as input. i.e. `self.count`

Thus by incrementing a count in a class as an argument, the return value of `decrypt_flag` will eventually give the decrypted flag (After the end of the CTF, other solutions exist, i.e. importing COUNT directly from the module).

<script src="https://gist.github.com/mcdulltii/a2d07e43c6b40e38107be61c64346583.js"></script>

Solve script:

<script src="https://gist.github.com/mcdulltii/35a72c5645ec1c422a7f7040953dd14f.js"></script>

---

## Wordle

Challenge file [Download](https://raw.githubusercontent.com/mcdulltii/coding/master/CTFSG_RE/wordle.exe)

### Challenge concept

C++ shellcode injections using pe2shc with IPC. Uses xorstr, lazy_importer and anti-*. Flag is checked using hash calculations.

### Description

```
NY Times bought Wordle for seven figures. But I have the game right here!
```

### Solution

In CFF Explorer, one can find and export the `BLOCK_BIN` resource from the wordle.exe resource directory.

The wordle executable is just a front with the wordle game. After winning the game successfully, the number of tries a player has made is passed into an IPC. Meanwhile, a thread is created, which loads the `BLOCK_BIN` resource as a shellcode, thereby mmap-ed and run.

![Pipe Variable]({{ site.baseurl }}/assets/img/CTFSGCTF22/pipevar.png)

<script src="https://gist.github.com/mcdulltii/32072a987767cfd4d57c5896af726fae.js"></script>

By using Frida, we can deduce the IPC variable that's passed. However, with the number of tries as `1`, the variable passed is `39`? What's going on? With the min number of tries as `1` to the max number as `6`, the sequence of variables goes as respectively: `39`, `79`, `119`, `159`, `199`, `239`. We can deduce from this linearly increasing sequence that the algorithm used is merely `40 * numTries - 1`.

By statically reversing the `BLOCK_BIN` shellcode, since there are much less obfuscations as compared to the original executable, one can actually see the IPC being read from the first function called in main. (From `CreateFileA` and `ReadFile` on `\\\\.\\pipe\\crack`)

![BLOCK_BIN]({{ site.baseurl }}/assets/img/CTFSGCTF22/block_bin.png)

As we now know the variables passed into the IPC are the above mentioned sequence, we can patch the `BLOCK_BIN` shellcode at the first function called by main. Below shows that the stack variable `pipeVar` is initialized to be statically 239. This number can be modified on runtime later using Frida into any of the numbers within the sequence.

![Read Variable]({{ site.baseurl }}/assets/img/CTFSGCTF22/readpipe.png)

A string array is initialized after the IPC is read, which is later on used in a `memcmp`. By debugging till the `memcmp` instruction, one can see that our input is calculated and stored in rcx, while the initialized string from the array is stored in rdx.

![Comparisons]({{ site.baseurl }}/assets/img/CTFSGCTF22/comparison.png)

Using Frida, we can modify the `pipeVar` variable, then hook the `memcmp` variable to verify whether our input has matched the strings from the initialized array. Using the flag format `CTFSG{` as prepender, the strings match and loopback, till our newline character, only when numTries is at value `6`. This confirms that the expected number of tries is `6`. (As for how our input characters are calculated, we can find cross references to our input characters and the `pipeVar` are used together)

![Check Flag]({{ site.baseurl }}/assets/img/CTFSGCTF22/checkflag.png)

<script src="https://gist.github.com/mcdulltii/bb07ccafc0c596b219fc6f76337e0040.js"></script>

In summary, the process flow is diagrammed as shown below.

![Process Diagram]({{ site.baseurl }}/assets/img/CTFSGCTF22/diag.png)

The below code implements all the above calculations and bruteforces printable characters as input to match the above initialized string array.

Solve script:

<script src="https://gist.github.com/mcdulltii/03ca5ebe3b65a65c2ecea18bcaf0cea2.js"></script>

---

## Work From Home

Challenge file [Download](https://raw.githubusercontent.com/mcdulltii/coding/master/CTFSG_RE/WFH/re)

### Challenge concept

Uses an image input to display ASCII art. Reads image dimensions to form a Blowfish cipher key to decrypt hash on runtime.

### Description

```
I’ve given up hoping for my clique’s overseas trip to happen, but i guess this will suffice.
```

### Solution

From static analysis, the module `re` has 4 important exports/function calls:

```
re::_::__init_function
re::main
core::ops::function::FnOnce::call_once
re::decrypt
```

As shown above is the function call order.

This control flow can be found indirectly from `start > _libc_csu_init` and `off_80635F0` thread offset, since not all of the above calls are found in `re::main`.

Process flow pseudocode:

```c++
GLOBAL_DIM = [0, 0]
# offset = .rodata:56038
HASH = "75b3dbc4753319e588298497c4b99e1ad639857cc748c91b"

# offset = .text:53D09
start > _libc_csu_init > re::_::__init_function:
    # offset = .text:8CA5, .data.rel.ro:63608
    new Thread(*core::ops::function::FnOnce::call_once)

start > re::main:
    img = input(image_path)
    width, height = img.dimensions
    # offset = .text:7F55, .text:80B0
    width_new, height_new = resize(img) where width < 120 and height < 120
    GLOBAL_DIM = [width_new, height_new]

core::ops::function::FnOnce::call_once:
    # offset = .text:5BBC
    key = mangle(GLOBAL_DIM)
    while (1) {
        # offset = .text:5CD3
        re::decrypt(key, HASH)
    }
```

As stated above are the base offsets of the disassembly which give hints towards the above pseudocode.

Below are two methods to solve the challenge, where one may require more debugging and correlation.

1. Bruteforce by varying image input

    - Vary the dimensions of a preset image
    - Run the binary on the varied size images
    - Filter for outputs with flag format

2. Bruteforce by varying string injection and implementing loopback

    - Intercept `re::decrypt` function call with frida
    - Inject key string with our own bruteforce key string

    ![frida]({{ site.baseurl }}/assets/img/CTFSGCTF22/frida.png)

    - Filter for outputs with flag format
        - Decrypted string can be retrieved from `stdio::_print` function call (need not be the flag as there are multiple false positives)

        ![Decrypted string]({{ site.baseurl }}/assets/img/CTFSGCTF22/print.png)

    - Loopback to `re::decrypt` function call if flag not found
        - Loopback can be checked using `OsString::into_string` return code on decrypted string
            - For example: Incorrect key string

            ![Incorrect key]({{ site.baseurl }}/assets/img/CTFSGCTF22/incorrect.png)

            - Correct key string (need not be the flag key as there are multiple false positives)

            ![Correct key]({{ site.baseurl }}/assets/img/CTFSGCTF22/correct.png)

Ensure thread scheduling is locked when debugging to prevent early exits!

![GDB start]({{ site.baseurl }}/assets/img/CTFSGCTF22/gdb.png)

Since the key string (which can be found by debugging till .text:5BBC), for any image input given, is always length of 4 and as `[0-9]{4}`, the key is bruteforce-able.

Solve script:

<script src="https://gist.github.com/mcdulltii/c4165ae741aa7fa467e9b43ce37196ac.js"></script>

---

## Conclusion

Hopefully these write-ups give some insight and closure to those who participated in the CTFSGCTF this year. Any comments and feedback is highly appreciated!

See you next time~
