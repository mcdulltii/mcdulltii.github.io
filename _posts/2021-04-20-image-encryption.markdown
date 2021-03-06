---
layout: post
title:  "Image Encryption"
author: Aaron Ti
date:   2021-04-20
category: Programming
abstract: 5 image encryption methods based on chaotic maps
---

## Sitemap

##### [q-deformed logistic map](#ie-1)
##### [Chaotic logistic map](#ie-2)
##### [Cross-coupled chaotic map](#ie-3)
##### [Combined chaotic map](#ie-4)
##### [Chaotic standard and logistic map](#ie-5)

## Chaotic Maps

In the design of an encryption-decryption chaotic system, the key space for which valid keys are to be chosen should be precisely specified and avoid non-chaotic regions. In such a case, within the chaotic regime, the sensitivity to the parameters will guarantee that two orbits starting from the same initial point but with slightly different parameters will exponentially diverge.

Disclaimer: All 5 algorithms implemented have been amended to fit RGB images. Decryption methods are reflective of the encryption methods.

#### <a name="ie-1"></a>Image encryption using q-deformed logistic map

In [this paper](https://www.sciencedirect.com/science/article/pii/S0020025520311336), the proposed encryption method is applied to 8-bit images in which a q-deformed logistic (chaotic) map is used based on the characteristics of sensitivity to the initial conditions and pseudo-randomness. Using a q-deformation of the map, we increase the size of the key space instead of using a high-dimensional chaotic map. It is worth mentioning that a low-dimensional chaotic map has several advantages, including easy implementation and parallel processes in the generation of chaotic sequences. The additional parameter, q, increases the level of security through the key space. By contrast, the topological entropy of the chaotic q-deformed logistic system can be computed with a fixed accuracy, which means that we can select the parametric region that best suits our purposes.

![Proposed Cryptosystem](https://ars.els-cdn.com/content/image/1-s2.0-S0020025520311336-gr4_lrg.jpg)

<script src="{{ site.baseurl }}/assets/js/imageencryption/1.js"></script>

#### <a name="ie-2"></a>Image encryption using chaotic logistic map

As chaotic maps have many fundamental properties such as ergodicity, mixing property and sensitivity to initial condition/system parameter and which can be considered analogous to some cryptographic properties of ideal ciphers such as confusion, diffusion, balance and avalanche property etc. In this communication, a new image encryption scheme is proposed based on chaotic logistic maps in order to meet the requirements of the secure image transfer. In the [proposed encryption process](https://www.sciencedirect.com/science/article/pii/S026288560600103X), eight different types of operations are used to encrypt the pixels of an image and which operation will be used for a particular pixel is decided by the outcome of the second logistic map. Thus, the second chaotic map further increases the confusion in the relationship between the encrypted and its original image. To make the cipher more robust against any attack, after each encryption of a block of sixteen pixels, the secret key is modified.

<table style="width:100%;"><thead class="valign-top"><tr class="rowsep-1"><th scope="col">Group no.</th><th scope="col">Intervals of <em>Y</em> values</th><th scope="col">Operations for encryption/decryption</th></tr></thead><tbody><tr><td>1</td><td>0.10–0.13, 0.34–0.37, 0.58–0.62</td><td>NOT operation, i.e. invert the bits of all three RGB bytes</td></tr><tr><td>2</td><td>0.13–0.16, 0.37–0.40, 0.62–0.66</td><td><em>R</em>⊕<em>K</em><sub>4</sub>, <em>G</em>⊕<em>K</em><sub>5</sub> and <em>B</em>⊕<em>K</em><sub>6</sub></td></tr><tr><td class="valign-top" rowspan="4">3</td><td class="valign-top" rowspan="4">0.16–0.19, 0.40–0.43, 0.66–0.70</td><td>Encryption</td></tr><tr><td>((<em>R</em>)<sub>10</sub>+(<em>K</em><sub>4</sub>)<sub>10</sub>+(<em>K</em><sub>5</sub>)<sub>10</sub>) mod&nbsp;256, ((<em>G</em>)<sub>10</sub>+(<em>K</em><sub>5</sub>)<sub>10</sub>+(<em>K</em><sub>6</sub>)<sub>10</sub>) mod&nbsp;256, ((<em>B</em>)<sub>10</sub>+(<em>K</em><sub>6</sub>)<sub>10</sub>+(<em>K</em><sub>4</sub>)<sub>10</sub>) mod&nbsp;256</td></tr><tr><td>Decryption</td></tr><tr><td>((<em>R</em>)<sub>10</sub>+256−(<em>K</em><sub>4</sub>)<sub>10</sub>−(<em>K</em><sub>5</sub>)<sub>10</sub>), ((<em>G</em>)<sub>10</sub>+256−(<em>K</em><sub>5</sub>)<sub>10</sub>−(<em>K</em><sub>6</sub>)<sub>10</sub>), ((<em>B</em>)<sub>10</sub>+256−(<em>K</em><sub>6</sub>)<sub>10</sub>−(<em>K</em><sub>4</sub>)<sub>10</sub>)</td></tr><tr><td class="valign-top" rowspan="4">4</td><td class="valign-top" rowspan="4">0.19–0.22, 0.43–0.46, 0.70–0.74</td><td>Encryption</td></tr><tr><td><em>NOT</em>(<em>R</em>⊕<em>K</em><sub>4</sub>), <em>NOT</em>(<em>G</em>⊕<em>K</em><sub>5</sub>), <em>NOT</em>(<em>B</em>⊕<em>K</em><sub>6</sub>)</td></tr><tr><td>Decryption</td></tr><tr><td>(<em>NOT</em>(<em>R</em>))⊕<em>K</em><sub>4</sub>, (<em>NOT</em>(<em>G</em>))⊕<em>K</em><sub>5</sub>, (<em>NOT</em>(<em>B</em>))⊕<em>K</em><sub>6</sub></td></tr><tr><td class="valign-top">5</td><td class="valign-top">0.22–0.25, 0.46–0.49, 0.74–0.78</td><td>Similar to Group 2 except that <em>K</em><sub>7</sub>, <em>K</em><sub>8</sub> and <em>K</em><sub>9</sub> are used in lieu of <em>K</em><sub>4</sub>, <em>K</em><sub>5</sub> and <em>K</em><sub>6</sub>, respectively.</td></tr><tr><td class="valign-top">6</td><td class="valign-top">0.25–0.28, 0.49–0.52, 0.78–0.82</td><td>Similar to Group 3 except that <em>K</em><sub>7</sub>, <em>K</em><sub>8</sub> and <em>K</em><sub>9</sub> are used in lieu of <em>K</em><sub>4</sub>, <em>K</em><sub>5</sub> and <em>K</em><sub>6</sub>, respectively.</td></tr><tr><td class="valign-top">7</td><td class="valign-top">0.28–0.31, 0.52–0.55, 0.82–0.86</td><td>Similar to Group 4 except that <em>K</em><sub>7</sub>, <em>K</em><sub>8</sub> and <em>K</em><sub>9</sub> are used in lieu of <em>K</em><sub>4</sub>, <em>K</em><sub>5</sub> and <em>K</em><sub>6</sub>, respectively.</td></tr><tr><td class="valign-top">8</td><td class="valign-top">0.31–0.34, 0.55–0.58, 0.86–0.90</td><td>No operations are made on <em>R</em>,<em>G</em> and <em>B</em> bytes</td></tr></tbody></table>

<script src="{{ site.baseurl }}/assets/js/imageencryption/2.js"></script>

#### <a name="ie-3"></a>Multiple grayscale image encryption using cross-coupled chaotic maps

[This paper](https://www.sciencedirect.com/science/article/pii/S2214212619308270) proposes a newly developed multiple grayscale image encryption scheme using cross-coupling of two Piece-wise Linear Chaotic Maps (PWLCM). In this scheme, cross-coupled PWLCM systems are used to perform both the permutation and diffusion operation. The sorted iterated sequences of cross-coupled PWLCM systems are used to perform the row-column diffusion operation, whereas their corresponding indexed sequences are used to execute the row-column permutation operation. The cross-coupled chaotic map improves the discrete dynamics of chaos and avoids the weakness of using a single chaotic map for permutation-diffusion operation. The use of a cross-coupled chaotic map increases the difficulty of cryptanalysis of the cipher image because the cipher output is generated by the mixing of different chaotic orbits. In addition to this, the cross-coupling of a single type of chaotic map (PWLCM system) increases the software and hardware efficiency of the algorithm. As well as, the use of the PWLCM system increases the encryption speed of the algorithm. The proposed technique also uses the Secure Hash Algorithm SHA-256 to resist the algorithm against the known-plaintext attack and the chosen-plaintext attack.

The two important features for selecting any chaotic map in image encryption are “simplicity” and “ergodicity”. PWLCM is the map that offers simplicity and wider range of ergodicity. 

![Generate initial values](https://ars.els-cdn.com/content/image/1-s2.0-S2214212619308270-gr16_lrg.jpg)

![Cross-coupling of 2 PWLCM systems](https://ars.els-cdn.com/content/image/1-s2.0-S2214212619308270-gr17_lrg.jpg)

![Proposed Cryptosystem](https://ars.els-cdn.com/content/image/1-s2.0-S2214212619308270-gr4_lrg.jpg)

<script src="{{ site.baseurl }}/assets/js/imageencryption/3.js"></script>

#### <a name="ie-4"></a>Colour byte scrambling technique for efficient image encryption based on combined chaotic map

In [this paper](https://ieeexplore.ieee.org/document/7754851), an image encryption scheme based on colour byte scrambling technique is proposed by using Logistic map and Ikeda map. The proposed scheme is using Logistic map for generating permutation sequence to shuffle the colour bytes (confusion) and Ikeda map is used for generating masking sequence to change the value of the colour bytes (diffusion) of the 24-bit colour image. The traditional scrambling techniques confusion and diffusion are applied continuously on the test image which leads to producing the cipher image which has good confusion and diffusion properties. In this scheme, the Logistic map is one dimensional which is simple and efficient and used for the generation of permutation sequences for achieving confusion. The two-dimensional Ikeda map is used for the generation of masking sequences for achieving diffusion.

![Proposed Cryptosystem](https://ieeexplore.ieee.org/mediastore_new/IEEE/content/media/7731602/7754737/7754851/7754851-fig-5-source-large.gif)

<script src="{{ site.baseurl }}/assets/js/imageencryption/4.js"></script>

#### <a name="ie-5"></a>Modified substitution–diffusion image cipher using chaotic standard and logistic maps

In [this paper](https://www.sciencedirect.com/science/article/pii/S100757040900598X), we propose a new loss-less symmetric image cipher based on the widely used substitution–diffusion architecture which utilizes the chaotic 2D standard map and 1D logistic map. It is specifically designed for the coloured images, which are 3D arrays of data streams. The initial condition, system parameter of the chaotic standard map and number of iterations together constitute the secret key of the algorithm. The proposed algorithm comprises of four rounds: two for the substitution and two for the diffusion. The first round of substitution/confusion is achieved with the help of intermediate XORing keys calculated from the secret key. Then two rounds of diffusion namely the horizontal and vertical diffusions are completed by mixing the properties of horizontally and vertically adjacent pixels, respectively. In the fourth round, a robust substitution/confusion is accomplished by generating an intermediate chaotic key stream (CKS) image in a novel manner with the help of chaotic standard and logistic maps.

Modifications are made to make it more robust against two more cryptanalytic attacks. (Structural flaws such as known plain text attacks)

![Original Cryptosystem](https://ars.els-cdn.com/content/image/1-s2.0-S100757040900598X-gr1.jpg)

![Equivalent Cryptosystem](https://ars.els-cdn.com/content/image/1-s2.0-S100757040900598X-gr2.jpg)

![Modified Cryptosystem](https://ars.els-cdn.com/content/image/1-s2.0-S100757040900598X-gr3.jpg)

<script src="{{ site.baseurl }}/assets/js/imageencryption/5.js"></script>
