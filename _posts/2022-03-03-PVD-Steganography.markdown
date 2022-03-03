---
layout: post
title:  "PVD Steganography"
author: Aaron Ti
date:   2022-03-03
category: Programming
abstract: Pixel Value Differencing based Steganography (Using LSB)
website: https://github.com/mcdulltii/PVD-Steganography
---

## Concept

### Basics of pixel-value differencing (PVD)

The PVD method uses grey-level images as the cover image and variable-sized secret message bit sequences are embedded into the cover image. Fewer secret message bit sequences are embedded into the smooth region compared with the edge region.

A cover image is partitioned into non-overlapping blocks of size `1 × 2` in raster scan order. The next steps can be referred from this published [paper](https://royalsocietypublishing.org/doi/10.1098/rsos.161066)).

### Application

Instead of grey-level images, a colour image steganographic scheme is proposed. By decomposing each colour pixel into its corresponding colour components, i.e. R, G and B, any small change to one of its components will not affect the overall colour when the pixel is blended in with its surrounding pixels.

In this proposed steganography scheme, bytes, or strings in this case are converted into bits, and then embedded onto the least significant bits (LSB) of pixel RGB components. By using the least significant bits, this bit flip is essentially `±1`.

After generating/importing a suitable cover image, the bitmap is partitioned into non-overlapping blocks of `3 x 3` in raster scan order.

Then, per byte of the string we want to embed, randomly choose non-repeating blocks from the previous partition. For each embedded byte, classify its bits to determine whether a smaller sized block is enough to embed them (Whether it is `2 x 2` or `3 x 3`).

These bits are then embedded by bit flipping the least significant bits of chosen colour components of the colour pixels within the partitioned blocks.

The above steps mentioned many random choices, which should not be easily replicated. In this project, I have chosen to log these choices in terms of concatenated bits. This thus makes the steganography system only extractable by those who know the logging system. This steganography scheme is symmetrical, so reversing the embedding steps will result back to our original string.

![Embedding and Extraction Example](https://raw.githubusercontent.com/mcdulltii/PVD-Steganography/main/rsrc/example.png)
