var Notification = require("node-notifier"),
    chokidar = require("chokidar"),
    exec = require('child_process').exec,
    pj = require("../package.json")

exports.getTestScript = getTestScript
exports.execute = execute
exports.notify = notify
exports.parseResults = parseResults
exports.watch = watch
exports.run = run

function getTestScript(pj) {
  if(pj && pj.scripts && pj.scripts.test) {
    return pj.scripts.test
  } else {
    throw new Error('no "test" script found in package.json')
  }
}

function execute(command, callback){
  exec(command, function(err, stdout){
    if(err) {
      console.log(stdout)
      return callback(stdout)
    }
    console.log(stdout)
    callback(stdout)
  })
}

function parseResults(output, resultindex, callback) {
  resultindex = resultindex || 3
  var lines = output.split("\n")
  var resultline = lines[lines.length-resultindex]
  var status, message

  //3 senarios: pass/fail/error
  if(/\# ok/.test(resultline)) {
    var passline = lines[lines.length-(resultindex+2)]
    var passnum = passline.match(/\d+$/)[0]
    status = "Pass"
    message = "Node " + process.version + ": passing " + passnum + "/" + passnum
  } else if(/\# fail/.test(resultline)){
    var failnum = resultline.match(/\d+$/)[0]
    var testsline = lines[lines.length-(resultindex+2)]
    var testsnum = testsline.match(/\d+$/)[0]
    status = "Fail"
    message = "Node " + process.version + ": passing "  + Number(testsnum-failnum) + "/" + testsnum
  } else {
    status = "Error"
    message = "Node " + process.version + ": Runtime Error Detected"
  }
  callback(status, message)
}

function notify(title, message) {
  var notifier = new Notification()
  notifier.notify({
    title: title,
    message: message
  })
  return[title,message]
}

function watch(dirs, options, callback) {
  dirs = dirs || '.'
  options =  options || {ignoreInitial: true, ignored: /node_modules|bower_components|bundle/, persistent: true}
  callback = callback || function(path) {return path}
  chokidar.watch(dirs, options)
  .on('add', function(path) {
    if(/\.js$/.test(path)){
      callback(path)
    }
  })
  .on('change', function(path) {
    if(/\.js$/.test(path)){
      callback(path)
    }
  })
}

function run() {
  var testScript = getTestScript(pj)
  //run tests once on startup
  execute(testScript, function(result) {
    parseResults(result, 3, function(status, message) {
      notify(status, message)
    })
  })
  //start watching, run tests on add/change of js files
  watch(null, null, function() {
    execute(testScript, function(result) {
     parseResults(result, 3, function(status, message) {
       notify(status, message)
     })
    })
  })
}
