var test = require('tape')
var taper = require('..')

var passingTapeTest =
  "node -e "
  +"\""
  +"var test = require('tape');"
  +"test('passing test', function(t) {"
  +"t.plan(1);"
  +"t.ok(true)})"
  +"\""

var failingTapeTest =
  "node -e "
  +"\""
  +"var test = require('tape');"
  +"test('failing test', function(t) {"
  +"t.plan(1);"
  +"t.ok(false)})"
  +"\""

test("getTestScript", function(t) {
  t.plan(2)
  var testScript = taper.getTestScript({scripts:{test: "foo"}})
  t.equal(testScript, "foo")
  t.throws(function(){taper.getTestScript({fail: "whale"})})
})

test("execute: passing", function(t) {
  t.plan(1)
  taper.execute(passingTapeTest, function(result) {
    t.ok(result)
  })
})

test("execute: failing", function(t) {
  t.plan(1)
  taper.execute(failingTapeTest, function(result) {
    t.ok(result)
  })
})

test("parseResults", function(t) {
  t.plan(2)
  taper.execute(passingTapeTest, function(output) {
    taper.parseResults(output, 3, function(status) {
      t.equal(status, "Pass")
    })

  })
  taper.execute(failingTapeTest, function(output) {
    taper.parseResults(output, 3, function(status) {
      t.equal(status, "Fail")
    })
  })
})

test("notify", function(t) {
  t.plan(2)
  taper.execute(passingTapeTest, function(output) {
    taper.parseResults(output, 3, function(status, message) {
      var returned = taper.notify(status, message)
      t.equal(returned[0], "Pass")
    })
  })
  taper.execute(failingTapeTest, function(output) {
    taper.parseResults(output, 3, function(status, message) {
      var returned = taper.notify(status, message)
      t.equal(returned[0], "Fail")
    })
  })
})

test("watch", function(t) {
  t.plan(1)
  taper.watch("./test", {}, function(path) {
    t.equals(path, "test/test.js")
  })
})
/* testing libraries to learn them 
test("globbing", function(t) {
  t.plan(1)
  new Glob("{./*.js,test/*.js}", function(err, files) {
    t.equal(files.length, 3)
  })
})

test("notification", function(t) {
  var notifier = new Notification()
  notifier.notify({
    title: "Hello",
    message: "Welcome to Jamaica, have a nice day"
  })
  t.end()
})

test("watching", function(t) {
  var watcher = chokidar.watch("test/test.js")
  watcher.on('all', function(event, path) {
    t.equal(event, "add")
  })
  t.end()
})

test("Glob-to-chokidar", function(t) {
  t.plan(5)
  new Glob("test/*.js", function(err, files) {
    t.equal(1, files.length)
  })
  new Glob("test/*.js", function(err, files) {
    chokidar.watch(files).on("all", function(event, path) {
      t.equals(event, "add")
    })
  })
  new Glob("./test", function(err, files) {
    chokidar.watch(files)
      .on("add", function(path) {
        t.equals(path, "test/test.js")
      })
      .on("addDir", function(path) {
        t.equals(path, "./test")
      })
  })
  new Glob("test/*.js", function(err, files) {
    chokidar.watch(files)
      .on("add", function(path) {
        t.equals(path, "test/test.js")
      })
      .on("addDir", function(path) {
        t.equals(path, "./test")
      })
  })
})

*/
