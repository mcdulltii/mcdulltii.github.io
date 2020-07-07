---
layout: post
title:  "CDDC20 Writeups WG5 - WG4"
author: Aaron Ti
date:   2020-07-05
category: CTF Writeups
abstract: CDDC20 Writeups WG5 - WG4. Consists of blood, sweat and tears from overguessing
---

## Warp Gate 5

---

### Crypto-1

![crypto-1]({{ site.baseurl }}/assets/img/CDDC20/Crypto-1.png)

```
JHLZHY_ZLSSZ_ZLHZOLSSZ_IF_AOL_ZLHZOVYL
```
ROT 19
```
CAESAR_SELLS_SEASHELLS_BY_THE_SEASHORE
```

Flag: `CDDC20{CAESAR_SELLS_SEASHELLS_BY_THE_SEASHORE}`

---

### Crypto-2

![crypto-2]({{ site.baseurl }}/assets/img/CDDC20/Crypto-2.png)

```
hq hm kbq jipoox yhnnhatoq qb abkmqjtaq p mijhim bn hknijikaim, ipaS yidikyikq tdbk hqm djIyiaimmbJ pky ipas mhcdoi hk hqmion. hn, pnqij ybhkg mb, bkI mhcdox rkbarm btq poo qsi aikQjpo hknijikaim pky djimikqm bki'm ptyhikai vhqs qsi mqpjqhkg-dbhkq pky qsi abkaoTmhbk, bki cpx dJbytai p mqpjqohKg, qsbtgs dbmmhlox p cijiqjhahbtM, inniaq.
```
Brute force Substitution cipher (https://quipqiup.com/)
```
it is not really difficult to construct a series of inferences, eacH dependent upon its prEdecessoR and each simple in itself. if, after doing so, onE simply knocks out all the cenTral inferences and presents one's audience with the starting-point and the conclUsion, one may pRoduce a startliNg, though possibly a meretriciouS, effect.
```
Use the capital letters to form the flag

Flag: `CDDC20{HERETURNS}`

---

### Crypto-3

![crypto-3]({{ site.baseurl }}/assets/img/CDDC20/Crypto-3.png)

![dancing men]({{ site.baseurl }}/assets/img/CDDC20/files/Crypto-3.png)

Use Dancing Men Cipher (https://www.dcode.fr/dancing-men-cipher)

Flag: `CDDC20{WELOVETODANCEANDCODEALLDAYLONG}`

---

### Forensics-1

![forensics-1]({{ site.baseurl }}/assets/img/CDDC20/Forensics-1.png)

<!-- ![flipped]({{ site.baseurl }}/assets/img/CDDC20/files/Forensics-1.jpg) -->

When viewing the comments, it gives `02CDDC{yhp4rg07ohp_5i_EmOs3wa}` in XPComments field

-> reverse each word

Flag: `CDDC20{pho70gr4phy_i5_aw3sOmE}`

---

### Forensics-2

![forensics-2]({{ site.baseurl }}/assets/img/CDDC20/Forensics-2.png)

```shell
> ls -a
. .. .ash_history
> cat .ash_history
CDDC20{Sh4LL_we_Sh3LL?}
```

Flag: `CDDC20{Sh4LL_we_Sh3LL?}`

---

### Forensics-3

![forensics-3]({{ site.baseurl }}/assets/img/CDDC20/Forensics-3.png)

Install FTK Imager to view disk image

Rename TopSecret to TopSecret.ad1, Open FTK Imager and add as a image

Flag is found in !ecret.txt

Flag: `CDDC20{Lorem-Ipsum-Foo-Bar}`

---

### Misc-2

![misc-2]({{ site.baseurl }}/assets/img/CDDC20/Misc-2.png)

```shell
> ./myprog GZ2gXZ3bD2qqNyNxXb5LJ8HfHQtTL5VHA
```

Run binary with password key as input

Flag: `CDDC20{c0mManD_l1n3_ArguM3n75sSs}`

---

### Misc-3

![misc-3]({{ site.baseurl }}/assets/img/CDDC20/Misc-3.png)

Find difference between files to find annotation

Flag: `CDDC20{KNOW_UR_RIGHTS}`

---

### Network-1

![network-1]({{ site.baseurl }}/assets/img/CDDC20/Network-1.png)

Export confidential.pdf object from pcap file to obtain flag

Flag: `CDDC20{TLP_RED_EYES_ONLY}`

---

### RE-1

![RE-1]({{ site.baseurl }}/assets/img/CDDC20/RE-1.png)

Decompile using https://github.com/countercept/python-exe-unpacker (use python 2.7)

Flag: `CDDC20{NiCe-2-MeeT-py2exe~:D}`

---

### RE-2

![RE-2]({{ site.baseurl }}/assets/img/CDDC20/RE-2.png)

![flag bitmap]({{ site.baseurl }}/assets/img/CDDC20/files/RE-2.png)

Use CFF Explorer -> resource editor -> bitmaps -> "FLAG"

Flag: `CDDC20{UR-di$$ector}`

---

### RE-3

![RE-3]({{ site.baseurl }}/assets/img/CDDC20/RE-3.png)

![strings]({{ site.baseurl }}/assets/img/CDDC20/files/RE-3-1.png)

.data section of the binary contained a weird string

![disassembly]({{ site.baseurl }}/assets/img/CDDC20/files/RE-3-2.png)

Disassembly shows the binary xref the weird string and adds each byte with 0x6, giving the flag

Flag: `CDDC20{T1ck-T0ck_T1ck-T0ck}`

---

## Warp Gate 4

---

### Visual Noise

![visual noise]({{ site.baseurl }}/assets/img/CDDC20/Visual_Noise.png)

XOR the 2 files and visualize the result to get the flag

Flag: `CDDC20{V1suAl_CrYPT0_iS_s0_53cuRE}`

---

### Recycling Bin

![recycling bin]({{ site.baseurl }}/assets/img/CDDC20/Recycling_bin.png)

Use binwalk to extract files within the img file, then rename test.zip with test.xlsx to obtain the flag

Flag: `CDDC20{cArv3_C4Rve_CaRV33eE}`

---

### How QueeR

![how queer]({{ site.baseurl }}/assets/img/CDDC20/How_QueeR.png)

Invert barcode.gif then use a maxicode decoder to obtain the flag

Flag: `CDDC20{Qu1Rky_quEeR_qUe57ion4bL3_c0d35s}`

---

### ilovedes

![ilovedes]({{ site.baseurl }}/assets/img/CDDC20/ilovedes.png)

Bruteforce with 8 character keys from rockyou.txt, or use online tool for decryption (http://des.online-domain-tools.com/)

Key was found to be "ilovedes"

Flag: `CDDC20{i_l0v3_5yMmetR1c_EnCryp7i0N}`

---

### What Time Is It? [1]

![time 1]({{ site.baseurl }}/assets/img/CDDC20/What_time_is_it.png)

Convert times to epoch timestamps, then convert to ascii to obtain flag

Flag: `CDDC20{_ItI_sN3_ver_Too_Lat_eT0_Ask_Wha_tT1_me1_tI5_!!}`

---

### Secret Code

![secret code]({{ site.baseurl }}/assets/img/CDDC20/Secret_code.png)

![rewrite]({{ site.baseurl }}/assets/img/CDDC20/files/SecretCode.png)

Rewrite asm jmp instruction at 0x79d `jne 0x7b0` to `je 0x7b0` to bypass the eax cmp, to step into the first sym.check and print flag immediately

Flag: `CDDC20{E4syR3v3rS1ng~}`

---

### Something's Going On

![something's going on]({{ site.baseurl }}/assets/img/CDDC20/Somethings_going_on.png)

Export secret.bin from the analyse.pcap file

Decrypt secret.bin with the RSA private key using online decryptor

Flag: `CDDC20{STOP_STRUTTING_AROUND}`

---

### Between 0&1

![between 0&1]({{ site.baseurl }}/assets/img/CDDC20/Between_0&1.png)

Use Volatility to extract information from the memory dump

```shell
> volatility -f dump imageinfo
... profile=WinXPSP2x86 ...

> volatility --profile=WinXPSP2x86 -f dump connscan
<Remote connections from external IPs>

> volatility --profile=WinXPSP2x86 -f dump consoles
<Remote shell connection dumping binary data>
```

Copy out binary data dumped, and convert to ASCII to obtain flag

```python
string = <binary data>
print("Flag: {}".format(''.join([chr(int(i,2)) for i in map(''.join, zip(*[iter([str(i) for i in string])]*8))])))
```

Flag: `CDDC20{Ev1dence_H1dden_Between_0&1}`

---

### Suspicious Service

![suspicious service]({{ site.baseurl }}/assets/img/CDDC20/Suspicious_service.png)

SuspiciousSvc file is a corrupted ELF binary, which can't be reversed by Ghidra

![idapro]({{ site.baseurl }}/assets/img/CDDC20/files/SuspiciousSvc.png)

When disassembled using IDApro, the stack is shown to be shifted by 0x104 for our STDIN

Via runtime debugging, we are able to control the base pointer using the last 4 bytes of the STDIN buffer

As such, we can buffer overflow the stack with random input till the last 4 bytes, then input the address to jmp to `cat flag`

Payload: `"A"*100 + p32(0x1343D00)`

Flag: `CDDC20{BufferrrrrrrrrOverflowwwwwwwwwwwwwwwwwwwww}`

---

### WYSIWYG

![wysiwyg]({{ site.baseurl }}/assets/img/CDDC20/WYSIWYG.png)

HACKER.3y3 is a UPX packed Windows executable

After unpacking the executable with `upx -d HACKER.3y3`, the strings of the executable shows that its a C++ Windows application which opens and draws lines on a canvas window

![canvas]({{ site.baseurl }}/assets/img/CDDC20/files/HACKER-1.png)

By opening the application, the window shows seemingly random lines drawn. After reversing the executable, there are actually lines drawn with a NULL brush

By changing the hex locations of the NULL brush (0x8) to a visible brush (0x7) in the executable, the flag will be drawn on the canvas

HEX Locations of NULL brush:
```
1189
11fd
1242
1287
12c2
12f3
134e
1395
```

![fixed canvas]({{ site.baseurl }}/assets/img/CDDC20/files/HACKER-2.png)

Flag: `CDDC20{HI-NULL^_^!}`
