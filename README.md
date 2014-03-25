# Tapir

[![Build Status](https://travis-ci.org/lithiumjake/tapir.png?branch=master)](https://travis-ci.org/lithiumjake/tapir)

simple tape test runner with desktop notification

## installation
```
npm install -g tapir
```
to run tapir from the command line

## usage
```
tapir
```

Tapir looks for the test script in package.json and runs it.
 
Tapir watches all javascript files in the current directory, and all subdirectories, ignoring node_modules, bower_components. and bundle.js.
When a javascript file is changed or added, it re-runs the test script.

Tapir uses node-notifier to provide desktop notification.  Taper will indicate passing tests, failing tests, and runtime errors.
I guess it works out of the box with OSX using Growl.  Linux requires notify-send to be installed.
Windows requires Growl for Windows (whatever that is).

#### alternative usage

Alternatively, you can pipe to Tapir and it will notify you of test results.

Example:

`tape test/*.test.js | tapir`


## license

MIT
