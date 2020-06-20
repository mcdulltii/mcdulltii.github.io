---
layout: post
title:  "Sudoku-solver"
author: Aaron Ti
date:   2020-06-18
category: Programming
abstract: Sudoku Solver in Rust. Uses a backtracing recursive algorithm to solve puzzles
website: https://github.com/mcdulltii/Sudoku-solver
---

## Usage

- Using `cargo run`

```shell
> cargo run
    .
    .
    .
Enter input mode: [1]File, [2]Stdin:
2
Enter initial Sudoku puzzle 9x9 matrix delimited by spaces and newlines:
8 0 0 0 0 0 0 0 0
0 0 3 6 0 0 0 0 0
0 7 0 0 9 0 2 0 0
0 5 0 0 0 7 0 0 0
0 0 0 0 4 5 7 0 0
0 0 0 1 0 0 0 3 0
0 0 1 0 0 0 0 6 8
0 0 8 5 0 0 0 1 0
0 9 0 0 0 0 4 0 0

<Answer outputted>
```

- Using Makefile `make` or `make compile`

```shell
> make
    .
    .
    .
Enter input mode: [1]File, [2]Stdin:
1
Enter file location:
src/sudoku

<Answer outputted>
```

## Makefile

- `make` or `make compile` to run the binary executable

- `make build` to only build the binary executable in ./target/ directory

## Dependency

- No dependencies   ¯\\_(ツ)_/¯

## References

- Wikipedia
  
  - Optimized Sudoku solving algorithms

- Backtracing algorithm

  - [Python Solution](https://youtu.be/eqUwSA0xI-s)
