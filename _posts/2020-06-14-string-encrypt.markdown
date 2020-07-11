---
layout: post
title:  "String-encrypt"
author: Aaron Ti
date:   2020-06-14
category: Exploits
abstract: String encryption parser in Python. Outputs a decryption function for encrypting an inputted string
website: https://github.com/mcdulltii/String-encrypt
---

## Information

- Python 3 compatible

- Encrypts string input with randomized functions

  - i.e. XOR, NEG, ADD, SUB, INC, DEC

  - Increase variability using index of decryption loop

- Supported languages:

  - C/C++

  - Python

  - Javascript

  - Java

## Usage

### ![Help](https://raw.githubusercontent.com/mcdulltii/String-encrypt/master/img/1.png)

## Example commands

```shell
> ./parser.py -s hello -e 10 -l py -t 3 -o hello.py
```

### ![Output](https://raw.githubusercontent.com/mcdulltii/String-encrypt/master/img/2.png)

## Aim

```shell
> ./parser.py -s hello_world -l C -e 150 -t 100 -o test.c
> gcc -O3 -s -o test test.c
```

Although the encoding algorithm is clearly written in our output similar to the one shown above, there is no trace of our algorithm in the system trace of the running executable

### ![Aim](https://raw.githubusercontent.com/mcdulltii/String-encrypt/master/img/systrace.png)

By increasing the number of encoding steps, the complexity of the encoding increases linearly. By using the GCC GNU compiler to further optimize the decoding algorithm as well as stripping the final executable, the executable will be more troublesome to reverse 

The optimization from the GCC `-O3` hugely decreased the initialization of the char array into the ones below

### ![Initialize](https://raw.githubusercontent.com/mcdulltii/String-encrypt/master/img/Initialization.png)

The decoding algorithm can be reversed, but due to the variability and reliance on the index of the decryption loop, the reversing of this loop gets more troublesome

### ![Encoding](https://raw.githubusercontent.com/mcdulltii/String-encrypt/master/img/Encoding.png)

As shown below, the binary does perfectly fine in decoding the char array and printing it in the console

### ![Running](https://raw.githubusercontent.com/mcdulltii/String-encrypt/master/img/Run.png)

## References

- [Stringencrypt](https://www.stringencrypt.com)

### Note: Program is made without reference to the executable from the website. The python program here is written from scratch with reference solely to the outputs of the string encryption there