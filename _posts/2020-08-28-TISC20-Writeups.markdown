---
layout: post
title:  "TISC20 Writeup"
author: Aaron Ti
date:   2020-08-28
category: CTF Writeups
abstract: TISC20 Writeups for Stages 1-3
---

## STAGE 1

We are given a task to inspect files being sent and received, which in this case, is a zip file.

The zip file given is password locked, where hints are given for the password.

Initially, I used capital letters to brute force the password, but it gave no results. As such, the password is a 6 character hexadecimal string, consisting of the characters `1234567890abcdef`. Though there are tools like john and fcrackzip, I found them too slow to brute force, thus made a python script.

Brute-force script:

```python
import itertools
import string
from zipfile import ZipFile
tries = string.digits + 'abcdef'
for combo in itertools.permutations(list(tries), 6):
    try:
        ZipFile('b3.zip').extractall(pwd=''.join(combo))
        print('pwd: '+''.join(combo))
        print(open('temp.mess','rb').read())
    except:
        continue
```

![Cracking ZIP]({{ site.baseurl }}/assets/img/TISC20/crackzip.png)

Password: `d93165`

By printing the output, I was able to determine which password was the actual one, since there were several false positives.

The output text finally obtained is encoded several times. Using Cyberchef to automatically detect the file signatures at every point, I was able to find out that the text file is encoded using gzip, bzip2, zlib, and xz compression methods, and hex and base64 encoding methods.

As the output text is encoded so many times, it was better to creaate a script to detect the compression and encoding methods, then decompress and decode them automatically to obtain the final flag.

```python
import gzip
import zipfile
import bz2
import lzma
import zlib
import base64

fname = 'temp.mess'
fsig = {
	b'\x1f\x8b': 'gzip',
	b'BZ': 'bzip',
	b'x\x9c': 'zlib',
	b'\xfd7': 'xz',
}

def matchsig(filename):
	with open(filename, 'rb') as f:
		data = f.read().strip()
	file_header = data[:2]
	if file_header in fsig:
		return fsig[file_header]
	elif isHex(data):
		return 'hex'
	elif isBase64(data):
		return 'base64'
	return 'None'

def d_gzip(filename):
	return gzip.open(filename, "rb").read()

def d_bzip(filename):
	return bz2.open(filename, "rb").read()

def d_zlib(filename):
	return zlib.decompress(open(filename, 'rb').read())

def d_lzma(filename):
	return lzma.open(filename, 'rb').read()

def isBase64(s):
	try:
		return base64.b64encode(base64.b64decode(s)) == s
	except Exception:
		return False

def isHex(s):
	s = s.decode('ascii').strip()
	try:
		int(s, 16)
		return True
	except ValueError:
		return False

def decode_base64(filename):
	with open(filename, 'r') as f:
		data = f.read().strip()
	return base64.b64decode(data.encode('ascii'))

def decode_hex(filename):
	return bytearray.fromhex(open(filename, 'r').read().strip())

def write_data(filename, data):
	open(filename, 'wb').write(data)

def main():
	file = fname
	count = 0
	done = False
	while not done:
		sig = matchsig(file)
		if sig != 'None':
			count += 1
			name = "file_{}".format(count)
			if sig == 'gzip':
				data = d_gzip(file)
			elif sig == 'bzip':
				data = d_bzip(file)
			elif sig == 'base64':
				data = decode_base64(file)
			elif sig == 'zlib':
				data = d_zlib(file)
			elif sig == 'hex':
				data = decode_hex(file)
			elif sig == 'xz':
				data = d_lzma(file)
			write_data(name, data)
			file = name
			continue
		done = True
	with open(file, 'r') as f:
		data = f.read().strip()

	print(data)

if __name__ == '__main__':
    main()
```

![JSON output]({{ site.baseurl }}/assets/img/TISC20/stage1-json.png)

![Results]({{ site.baseurl }}/assets/img/TISC20/stage1-results.png)

Flag: `TISC20{q1_b4c693882381b9c4754b9db2efecce0f}`

---

## Stage 2

We are given a ZIP file containing a folder filled with encoded files, the malware responsible for it, and a Dockerfile.

Within a docker instance, running the malware showed outgoing DNS queries to a domain on Wireshark.

![DNS Queries]({{ site.baseurl }}/assets/img/TISC20/dns.png)

The domain is generated on runtime within the binary, where to obtain the data, we can route the domain back to localhost. (Local IP is 172.17.0.1)

![Hosts File]({{ site.baseurl }}/assets/img/TISC20/hosts.png)

Listening on port 80 gives us the POST data, which is the concatenation of multiple string data, consisting of EncIV and EncKey which is used in the Crypto AES Encryption method within the binary found later.

![NC Traceback]({{ site.baseurl }}/assets/img/TISC20/trace.png)

![Wireshark Data]({{ site.baseurl }}/assets/img/TISC20/wireshark.png)

The given malware is an ELF binary, which is further UPX packed as noticed by the strings.

```shell
> upx -d anorocware
```

Disassembling the ELF binary in IDA, since the binary is not stripped, it is clear that it is made in Golang.

I used the golang_loader_assist IDA plugin, which renames golang functions for easier decompiling.

Looking through the exports, there were functions named main_*, which were the functions that are called when run.

![Main Functions]({{ site.baseurl }}/assets/img/TISC20/funcs.png)

After decompiling using HexRays, the “main_QbznvaAnzrTrarengvbaNytbevguz” function retrieves the IP address (ifconfig.co) and timezone (worldtimeapi), then concatenates with the other local values and post the data to the runtime-generated domain above. 

The “main_visit_func1” uses a crypto AES cipher, which uses the EncKey and EncIV to encrypt the files recursively retrieved by os_Getwd and walking the directories.

![EncDec Function]({{ site.baseurl }}/assets/img/TISC20/encryptdecrypt.png)

![Encoded String]({{ site.baseurl }}/assets/img/TISC20/encodedstring.png)

In the “main_main” function, the public key is decoded, then the “main_EncryptDecrypt” function is called to decode the stored strings and generate EncKey and EncIV. Then, “main_QbznvaAnzrTrarengvbaNytbevguz” is called to retrieve and send the POST data. Afterwards, “main_visit” function is called to encrypt and walk the local files and directories using the EncKey and EncIV, then save the warning messages and the encrypted key details.

Using gdb and gef, I created breakpoints on any calls to pthread_create, and started stepping the binary from its entrypoint.

I found its file matching string: 

```
36:*.xspf=00;36:=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus
```

![File Matching]({{ site.baseurl }}/assets/img/TISC20/matchfile.png)

Throughout the binary, it creates new threads with multiple Golang panic() checks.

![Panic]({{ site.baseurl }}/assets/img/TISC20/panic.png)

Perhaps some Golang panic() check. Showed the user and directory the binary is compiled from.

Upon debugging, a byte array is decoded, giving us a string with “TeleSec” and “TeleKom”

![Tele Strings]({{ site.baseurl }}/assets/img/TISC20/companies.png)

The certificate was also decoded on runtime as shown below.

```
-----BEGIN CERTIFICATE-----\nMIIFQTCCAymgAwIBAgITBmyf0pY1hp8KD+WGePhbJruKNzANBgkqhkiG9w0BAQwF\nADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6\nb24gUm9vdCBDQSAyMB4XDTE1MDUyNjAwMDAwMFoXDTQwMDUyNjAwMDAwMFowOTEL\nMAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv\nb3QgQ0EgMjCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK2Wny2cSkxK\ngXlRmeyKy2tgURO8TW0G/LAIjd0ZEGrHJgw12MBvIITplLGbhQPDW9tK6Mj4kHbZ\nW0/jTOgGNk3Mmqw9DJArktQGGWCsN0R5hYGCrVo34A3MnaZMUnbqQ523BNFQ9lXg\n1dKmSYXpN+nKfq5clU1Imj+uIFptiJXZNLhSGkOQsL9sBbm2eLfq0OQ6PBJTYv9K\n8nu+NQWpEjTj82R0Yiw9AElaKP4yRLuH3WUnAnE72kr3H9rN9yFVkE8P7K6C4Z9r\n2UXTu/Bfh+08LDmG2j/e7HJV63mjrdvdfLC6HM783k81ds8P+HgfajZRRidhW+me\nz/CiVX18JYpvL7TFz4QuK/0NURBs+18bvBt+xa47mAExkv8LV/SasrlX6avvDXbR\n8O70zoan4G7ptGmh32n2M8ZpLpcTnqWHsFcQgTfJU7O7f/aS0ZzQGPSSbtqDT6Zj\nmUyl+17vIWR6IF9sZIUVyzfpYgwLKhbcAS4y2j5L9Z469hdAlO+ekQiG+r5jqFoz\n7Mt0Q5X5bGlSNscpb/xVA1wf+5+9R+vnSUeVC06JIglJ4PVhHvG/LopyboBZ/1c6\n+XUyo05f7O0oYtlNc/LMgRdg7c3r3NunysV+Ar3yVAhU/bQtCSwXVEqY0VThUWcI\n0u1ufm8/0i2BWSlmy5A5lREedCf+3euvAgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMB\nAf8wDgYDVR0PAQH/BAQDAgGGMB0GA1UdDgQWBBSwDPBMMPQFWAJI/TPlUq9LhONm\nUjANBgkqhkiG9w0BAQwFAAOCAgEAqqiAjw54o+Ci1M3m9Zh6O+oAA7CXDpO8Wqj2\nLIxyh6mx/H9z/WNxeKWHWc8w4Q0QshNabYL1auaAn6AFC2jkR2vHat+2/XcycuUY\n+gn0oJMsXdKMdYV2ZZAMA3m3MSNjrXiDCYZohMr/+c8mmpJ5581LxedhpxfL86kS\nk5Nrp+gvU5LEYFiwzAJRGFuFjWJZY7attN6a+yb3ACfAXVU3dJnJUH/jWS5E4ywl\n7uxMMne0nxrpS10gxdr9HIcWxkPo1LsmmkVwXqkLN1PiRnsn/eBG8om3zEK2yygm\nbtmlyTrIQRNg91CMFa6ybRoVGld45pIq2WWQgj9sAq+uEjonljYE1x2igGOpm/Hl\nurR8FLBOybEfdF849lHqm/osohHUqS0nGkWxr7JOcQ3AWEbWaQbLU8uz/mtBzUF+\nfUwPfHJ5elnNXkoOrJupmHN5fLT0zLm4BwyydFy4x2+IoZCn9Kr5v2c69BoVYh63\nn749sSmvZ6ES8lgQGVMDMBu4Gon2nL2XA46jCfMdiyHxtN/kHNGfZQIG6lzWE7OE\n76KlXIx3KadowGuuQNKotOrN8I1LOJwZmhsoVLiJkO/KdYE+HvJkJMcYr07/R54H\n9jVlpNMKVv/1F2Rs76giJUmTtt8AF9pYfl3uxRuw0dFfIRDH+fO6AgonB8Xx1sfT\n4PsJYGw=\n-----END CERTIFICATE-----\n"
```

![Certificate]({{ site.baseurl }}/assets/img/TISC20/cert.png)

After decoding the certificate, it looks irrelevant to finding the public key.

![Certificate Info]({{ site.baseurl }}/assets/img/TISC20/certinfo.png)

To prevent the threads from detecting GDB and killing the entire process, I used the following commands.

```shell
> set target-async 1
> set non-stop on
```

After stepping through the binary from its entrypoint till it has 5-6 threads running, I manually stepped through the threads until a decoded string appears.

![Base64 Encoded]({{ site.baseurl }}/assets/img/TISC20/base64string.png)

```
LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJRUlEQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0JBMEFNSUlFQ0FLQ0JBRUFtOTliMnB2dHJWaVcrak4vM05GZgp3OGczNmRRUjZpSnIrY3lSZStrOFhGenVIVU80TE4zdGs3NnRGUzhEYmFDY1lGaXVmOEdzdWdjUm1RREVyUFpmCnFna3ZYWnB1ZmZmVGZqVEIramUvV2k0M2J3THF0dzBXNGNYb1BXMzN1R1ZhV1pYMG9MektDL0F4Zzdrd0l0bUcKeG5uMzIxVEFqRVpnVGJMK09hTmtjSHpmUTdVendhRXA5VVB0VDhwR1lvTkpIbFgzZmtGcTJpVnk3N3VJNGdSSwpNZjh1alRma0lISGpRN0JFemdFZ2s4a3F4R2FTUGxJTlFzNjVQNHR2T3BpaHFwd1VWcEFqUExOQlR0OUh6MUYvCmZSK2FEc0pRUktaTk1yV1JMdU1ZaU8yTXg5Y1pCbnd6TDlLdUZSdkhlbE83QldheVU5ZjBYT3BnL3p5YkVRT0wKdXgram1zVXNUc1Fiaks5Y0I2N01hMjFEK1hKSHlLZ0t1UDl1MTRtVkNaZ0NCazlseWJTMWJ4ZHZGRFFQZ2t5YwpNM3o5dnV1Y0NVMUV1MkQwbGhGbUozRlFmWmtBWSsrWEhVcGl3dWk5Tk8zQTlVRzdhbXlYYk9TY2xGMlg5a1JxCjBDd21xT3RCUkJFV0lTZTVyZHpjL0FUT1AzUHFEakd3eVNYeFdaRENIOHJyZ256V3B2MkxyaVlRVG5mMmNFMEcKL2lJOFJ3allvR0xXemVMVlJyMWhoWjhZNXM0Ui9zUjQ5N1dlbmtSY3BPTE9rRFZnZTdNdXNUT1doNGVOaTRnbwpQbGRzaVlUcVRuZEExd1Y2N3IwOXVqcHA4VnZwZEx1bys0aCs3cC9wZnBYTXN4OGRBTG9tNHNma1ljSkhoT2JrCnh0NUNwTkNrVlhoNXRzR2hlRmI3djg1R2lORnkxN3p1YWxNZGEzMkJpblBlRWJGcnFLd0QyWjRSNVFnUXVCOHUKSXdqcVNUZ05vOVV2dmNoNmxXQ2JqOWUrODB1Z1Y0bzdqSENkLzU2Rmt1dmhDcWlJTmRaRFVVNFpCMzdoZGVsZgplRTlOYnhEaktHOFY3YUNkd3FKSkRZR2l6LzNqbXVDZkIvazVGa29IU0FOZ2JMRTBBNVNtazNUOHR1djhTeitmCnY0cnJQeG1wbjhYMlNtMUZveitVMEJXelArVkxtcExubnlYa3JPSHluOGxKRmJuL1U1TldHUkxuK2V2MkNTa3cKQUkvVGZIQUxxVHZqcWxHUXhUVGFZN1pua241aStEMUx6dEs4Y3BTWlhkRFZvUmgrL3ZNSUVpTnVrOCsrL3M2YQpITmQ3d3VGa1kvWjhqakoxakgvY3NGMzdtR1lBVXhwMzJuUms1d1JwL2M2ZVdaUE0rekdpYmZFbm1GVzV5VUVVClliWDRoenpHcjVRNmYvc3lzdXpoYXlsV2kzWEN2SXJINkxCakZOdTNVSjBWSXpjSk4wa3hhQUJhWFk4SlVEWVgKdFhVTGlwdlVPcWt0dE9xSlN4T1hXZzcyU1dLTEt2L1F2ZkRSVlhlZFVrMDY2azdSTDFva3BiTW53WWxmWWc3SgptcFpaUjJDTk53Yk1rUW0yVG1yQS9NWnVkdnF0c1g5UHBrZ0pJK1pXalV3VnRHUlVUZERNeFpXeDRIM25lSml5CjhtOHVkazQyUk4wajNuMHdWWHNXdDZRbXk3YlFzSFlYSUhVZ2tCWFl6ZHkvdStOb2RLQWpoZFZwaUpiekluY3oKU2RvbFhpbmlLd05VTFc4VmpqUzlLVFNSd2lkcWVPa2twTmVJcWlSbldUM1RUTUFNemI1ajBqRUdGN0wzRE9NUAo2UUlCQXc9PQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0K
```

The string is base64 encoded, which when decoded will give us a public key.

```
-----BEGIN PUBLIC KEY-----
MIIEIDANBgkqhkiG9w0BAQEFAAOCBA0AMIIECAKCBAEAm99b2pvtrViW+jN/3NFf
w8g36dQR6iJr+cyRe+k8XFzuHUO4LN3tk76tFS8DbaCcYFiuf8GsugcRmQDErPZf
qgkvXZpufffTfjTB+je/Wi43bwLqtw0W4cXoPW33uGVaWZX0oLzKC/Axg7kwItmG
xnn321TAjEZgTbL+OaNkcHzfQ7UzwaEp9UPtT8pGYoNJHlX3fkFq2iVy77uI4gRK
Mf8ujTfkIHHjQ7BEzgEgk8kqxGaSPlINQs65P4tvOpihqpwUVpAjPLNBTt9Hz1F/
fR+aDsJQRKZNMrWRLuMYiO2Mx9cZBnwzL9KuFRvHelO7BWayU9f0XOpg/zybEQOL
ux+jmsUsTsQbjK9cB67Ma21D+XJHyKgKuP9u14mVCZgCBk9lybS1bxdvFDQPgkyc
M3z9vuucCU1Eu2D0lhFmJ3FQfZkAY++XHUpiwui9NO3A9UG7amyXbOSclF2X9kRq
0CwmqOtBRBEWISe5rdzc/ATOP3PqDjGwySXxWZDCH8rrgnzWpv2LriYQTnf2cE0G
/iI8RwjYoGLWzeLVRr1hhZ8Y5s4R/sR497WenkRcpOLOkDVge7MusTOWh4eNi4go
PldsiYTqTndA1wV67r09ujpp8VvpdLuo+4h+7p/pfpXMsx8dALom4sfkYcJHhObk
xt5CpNCkVXh5tsGheFb7v85GiNFy17zualMda32BinPeEbFrqKwD2Z4R5QgQuB8u
IwjqSTgNo9Uvvch6lWCbj9e+80ugV4o7jHCd/56FkuvhCqiINdZDUU4ZB37hdelf
eE9NbxDjKG8V7aCdwqJJDYGiz/3jmuCfB/k5FkoHSANgbLE0A5Smk3T8tuv8Sz+f
v4rrPxmpn8X2Sm1Foz+U0BWzP+VLmpLnnyXkrOHyn8lJFbn/U5NWGRLn+ev2CSkw
AI/TfHALqTvjqlGQxTTaY7Znkn5i+D1LztK8cpSZXdDVoRh+/vMIEiNuk8++/s6a
HNd7wuFkY/Z8jjJ1jH/csF37mGYAUxp32nRk5wRp/c6eWZPM+zGibfEnmFW5yUEU
YbX4hzzGr5Q6f/sysuzhaylWi3XCvIrH6LBjFNu3UJ0VIzcJN0kxaABaXY8JUDYX
tXULipvUOqkttOqJSxOXWg72SWKLKv/QvfDRVXedUk066k7RL1okpbMnwYlfYg7J
mpZZR2CNNwbMkQm2TmrA/MZudvqtsX9PpkgJI+ZWjUwVtGRUTdDMxZWx4H3neJiy
8m8udk42RN0j3n0wVXsWt6Qmy7bQsHYXIHUgkBXYzdy/u+NodKAjhdVpiJbzIncz
SdolXiniKwNULW8VjjS9KTSRwidqeOkkpNeIqiRnWT3TTMAMzb5j0jEGF7L3DOMP
6QIBAw==
-----END PUBLIC KEY-----
```

Using python to sha256 hash the base64 encoded string, we are able to obtain the flag.

NOTE: When encoding from the public key instead of the base64 string, ensure the new lines are LF instead of CRLF.

```python
import hashlib;
import base64;

m=hashlib.sha256()
m.update(base64.b64encode(open('pem.txt','rb').read()))

print('TISC20{'+m.hexdigest()+'}')"
```

Flag: `TISC20{8eaf2d08d5715eec34be9ac4bf612e418e64da133ce8caba72b90faacd43ceee}`

---

## Stage 3 (ANALYSIS)

```go
crypto_aes_NewCipher((__int64)main_EncKey);
io_ioutil_ReadFile(a1, (__int64)a2, v20, __PAIR128__(v21, *((unsigned __int64 *)&a7 + 1)), a7);
for ( i = 0LL; i < 16; ++i )
{
  v23 = main_EncIV;
  a2 = &main_EncIVCur;
  *((_BYTE *)&main_EncIVCur + i) = main_EncIV[i];
}
path_filepath_Base(a1, (__int64)a2, (__int64)v23, *((__int64 *)&a7 + 1));
main_EncIVCur = *v38;
path_filepath_Base(a1, (__int64)a2, v25, *((__int64 *)&a7 + 1));
crypto_cipher_NewCTR(a1, (__int64)a2, v26, (__int64)v38, v27);
runtime_concatstring2(a1, (char)a2, v28, (unsigned __int64)aAnoroc, v29, v30, 0, a7);
result = io_ioutil_WriteFile(a1, (__int64)a2, v31, (__int64)v38, v32);
```

The above code is generated using HexRays.

The crypto algorithm uses the Golang AES NewCipher from “crypto/aes”, to return a cipher block using the generated EncKey that was posted to the domain mentioned before.

A file matching the extensions mentioned before will be walked and read using ReadFile.

The main_EncIV char array is supposedly converted to a hex array EncIVCur.

Using the same filepath that the file was read from, it is concatenated with “.anoroc”, and writes the encrypted text from NewCTR using EncIVCur into the new file path.

The pseudocode is as follows:

```go
package main

import (
  "crypto/aes"
  "crypto/cipher"
  "io/ioutil"
  "path/filepath"
)

func main() {
  // Read file data
  file_contents, _ := ioutil.ReadFile(filename)
  
  // From POST data
  EncKey = []byte{...}
  EncIV = "..."
  EncIVCur = []byte{...}

  for (i=0; i<16; i++) {
    *EncIVCur + i = EncIV[i]
  }

  // Cipher block size
  BlockSize := 16
  
  // Create new cipher block
  block, err := aes.NewCipher(EncKey)

  // Retrieve filename without directory path
  path := filepath.Base(filename)

  // Generate cipher
  ciphertext := make([]byte, BlockSize + len(file_contents))

  // Create stream to encrypt block
  stream := cipher.NewCTR(block, EncIV)

  // Encrypt file data
  stream.XORKeyStream(ciphertext[BlockSize:], file_contents)

  // Concat filename with extension
  path = path + ".reversed"

  // Write to new file
  ioutil.WriteFile(path, ciphertext, 644)
}
```

Although the encryption algorithm is close, and the EncKey and EncIV can be obtained from the POST data, I did not have enough time to debug on the encrypted files.

Also, since the Golang NewCTR stream encryption algorithm is the same as its decryption algorithm, to reverse the already encrypted files given was to just create the original function.

Apart from the encryption algorithms, POST data handling, file walks and decoding of stored hex arrays, there were still 2 threads that I had no clue of its purpose. One thread that included the usage of a certificate as mentioned before, which was either decoded or retrieved from the net, including one called “ctroot.crl”. Another thread which created several subdirectories and saved .anoroc files with hashes as their filenames might have been responsible for generating the C&C domain mentioned before.
