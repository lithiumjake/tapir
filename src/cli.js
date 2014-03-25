#!/usr/bin/env node
var tapir = require("./index.js"),
    stream = require("./stream.js")

if(process.stdin.isTTY) {
  tapir.run()
} else {
  process.stdin.pipe(process.stdout)
  process.stdin.pipe(stream())
}
