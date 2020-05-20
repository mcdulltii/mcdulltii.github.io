---
layout: post
title:  "Blockchain-Vis"
author: Aaron Ti
date:   2020-05-06
category: Programming
abstract: P5JS Visualization for Golang Blockchain. Features Proof of Work, P2P Connection and Automatic Peer Discovery, and Web Visualization of Block Network
website: https://github.com/mcdulltii/blockchain-vis
---

## Features
1. Proof of Work
2. Asynchronous Peer-to-Peer Communcation & Discovery
3. P5JS Web Visualization of Blockchain Network

## Dependencies
```go
import (
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"encoding/gob"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"math"
	"math/big"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/davecgh/go-spew/spew"
	"github.com/gorilla/mux"
	"github.com/spf13/pflag"
)
```

## Usage:
<i>Note: Though the program is scalable, to showcase the functions of the program, currently 2 docker peers are created for p2p.</i>

- -h, --host string   binding host (default (Outbound Host IP))
- -p, --port int      binding port (default 4444)
- -w, --webport int   web server port (default 8000)

---
1. <strong>Docker</strong>
```shell
make    # To build docker containers
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Using two terminals, exec "make run*" to access bash on built docker images
- Terminal 1
```shell
admin$ make run1
# Access bash on blockchain-vis_run1_1 with exposed ports 4444 and 8000
run1$ ./blockchain-vis
```
- Terminal 2
```shell
admin$ make run2
# Access bash on blockchain-vis_run2_1 with exposed ports 4444 and 8000
run2$ ./blockchain-vis (ip of run1):4444
```
---
2. <strong>Build local binary</strong>
```shell
make local
```
---

## P5JS Web Visualizations
<i>Note: Limited to work only on localhost</i>

Default port: <b>8000</b>

Access web server through http://localhost:(port)/web/

## Adding to Blockchain
- cURL
```shell
curl -d '{"Data":"(transaction_data)"}' http://(ip):(port)/
```
- Web Server
  - Hover on nodes to show node properties
  - Posts using textbox input  <i>(localhost only)</i>
  - Reloads if POST response is invalid
