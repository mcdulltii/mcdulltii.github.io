---
layout: post
title:  "Linux Reflective Loading"
author: Aaron Ti
date:   2021-04-19
category: Exploits
abstract: Embedding obfuscated & complete ELF binaries within ELF binaries, thereby deobfuscated and reflective loaded on runtime 
---

## Thought Process

Reflective DLL injection has always been a popular obfuscation implementation in Windows binaries, but it's not very well known in Linux binaries. 

WRT [What is reflective DLL injection](https://www.andreafortuna.org/2017/12/08/what-is-reflective-dll-injection-and-how-can-be-detected/):

```text
DLL (Dynamic-link library) are the Microsoft’s implementation of the shared library concept and provide a mechanism for shared code and data, allowing a developer of shared code/data to upgrade functionality without requiring applications to be re-linked or re-compiled.

DLLs may be explicitly loaded at run-time, a process referred to simply as run-time dynamic linking by Microsoft, and its code is usually shared among all the processes that use the same DLL.

When you need to load a DLL in Windows, you need to call LoadLibrary, that takes the file path of a DLL and loads it in to memory.

This method can also used to perform a DLL injection, that inserts code in the context of another process by causing the other process to load and execute code.

The code is inserted in the form of a DLL, since DLLs are meant to be loaded at run time.
Running code in the context of another process provides adversaries many benefits, such as access to the process’s memory and permissions.

It also allows adversaries to mask their actions under a legitimate process.
```

In linux, one can replace .DLL with .so files, and implement them in the same way. However, both of these implementations are trivial, by having shared functions within the process memory and referencing its functions in the original process.

During the time of my implementation, this idea is used in a reversing challenge I authored in CTFSGCTF 2021. 

<script src="{{ site.baseurl }}/assets/js/circuitbreaker.js"></script>

The idea behind my implementation of ELF reflection adapts that of Windows, by embedding a complete ELF binary. This is further explained below.

## Implementation

As said above, instead of having a shared library of functions for the main binary process to reference to, this implementation emulates a loader and reflects process execution (similar to execve) of the main process to a new process that has been deobfuscated on runtime.

Looking at the C documentations for execve and its variants, they all reference files in memory. The only close implementation is [Mettle's libreflect](https://github.com/rapid7/mettle/tree/master/libreflect), which still reference files in memory.

My implementation can be split up to 2 parts, the embedding of the obfuscated binary, and the reflective loading of the decoded embedded binary.

### Embedding and Obfuscating / vice versa.

The function below is used as a filler, such that after the binary has been compiled, the ELF header will not need to be amended when these 12 bytes each of `puts("");` are replaced with the obfuscated bytes of the embedded binary. (The filler can be replaced with any other valid functions)

```c
// Placeholder function to hold embedded exe
void placeholder(void) {
    puts("");
    // ...
    puts("");
    return;
}
```

After the bytes have been replaced by the embedded binary (encoded using srand values here), the main binary reads itself and locates the offset to the placeholder function above. As every function has the normal function headers of `push rbp, ...`, the embedded binary static location is easy to locate. After offsetting the location, the values are deobfuscated during runtime.

```c
ptr = mmap(NULL, buf.st_size, PROT_READ | PROT_WRITE, MAP_PRIVATE, fd, 0);

// Find offset to embedded exe
for (int i=0; i<buf.st_size; i++) {
    // Values are pre-calculated from encoded binary
    if ((int)ptr[i] != 0xf5) continue;
    if ((int)ptr[i+1] != 0x51) continue;
    offset = i;
}

// Jump mmap pointer to offset
emb = ptr + offset;

srand(0x7f); // Deterministic srand
// Decode embedded exe
for (int i=0; i<exelength; i++) {
    emb[i] ^= rand()%222; // Randomize by rand() call
}
```

In hindsight, modulo 222 should be replaced with another number, such that the resultant obfuscated bytes will be valid opcodes which will trick any static disassembly.

### Reflective Loading

By following DLL injections, a fake file can be created on runtime, which is executed afterwards. However, this fake file can be easily spotted when debugged. As such, I had to use another method.

```c
// Fake filename
char binary[] = "tree";

// Write to file
FILE *fp;
fp = fopen(binary, "wb");
// ptr is the decoded embedded binary
for (int i=0; i<exelength; i++)
    fputc(ptr[i], fp);
fclose(fp);

// chmod file permissions
char mode[] = "0755";
int i = strtol(mode, 0, 8);
chmod(binary, i);

// Fake file attributes
struct stat buf;
stat("/bin/bash", &buf);
struct utimbuf times;
times.actime = buf.st_atime;
times.modtime = buf.st_mtime;
utime(binary, &times);

// Run file
execv(binary, argv);
```

Instead of a fake file, a mmap-ed region in memory can be used. The reflected `data` below that is "execv"-ed is filled in by the file descriptor from the open syscall. Any stack setups and reflective jumps have also been settled.

```c
// https://github.com/rapid7/mettle/blob/master/libreflect/examples/memfd_exec.c
int main(int argc, char **argv)
{
	// ...
	if(argc < 2) {
		printf("exec.bin [input file]\n");
		exit(EXIT_FAILURE);
	}

	// Load input ELF executable into memory
	fd = open(argv[1], O_RDONLY);
	fstat(fd, &statbuf);

	data = mmap(NULL, statbuf.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
	close(fd);

	reflect_mfd_execv(data, argv + 1);
	return 0;
}
```

By combining the two, the embedded portion of the binary is decoded on runtime (using the same way it is encoded) and stored in memory, which is then mapped to an ELF struct. After setting up the new stack with the original std arguments, the main binary can jump with the new stack into the embedded binary's entrypoint.

```c
// Map mmap region to elf struct
map_elf(emb, &exe);

if (exe.interp) {
	// Load input ELF executable into memory
	fd = open(exe.interp, O_RDONLY);
	fstat(fd, &buf);

	ptr = mmap(NULL, buf.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
	close(fd);

	map_elf(ptr, &interp);
} else {
	interp = exe;
}

// copy and modify our initial argv and env to reuse
size_t *new_stack = (size_t *)argv - 1;
stack_setup(new_stack, argc - 1, argv + 1, env, NULL,
		exe.ehdr, interp.ehdr);

// Jump to embedded exe
jump_with_stack(interp.entry_point, new_stack);
```

## Summary

The implementation can be summarised as shown below.

![Reflective Loading]({{ site.baseurl }}/assets/img/ReflectiveLoading.png)

## After-thoughts

The implementation of this fully standalone, embedded, reflective loading binary was initially for a reverse engineering challenge, which is not really suited for. The encoding and decoding method I have chosen is painfully obvious when debugging, since the same operations are carried out for a huge memory array. The mmap-ed region can just be traced and dumped right after the decoding operations have finished. Since the binary reflective loads a complete binary, the dumped binary can be analysed on its own.

However, by changing some aspects on this proof of concept, this poses many possibilities for more difficult obfuscation methods in the future.
