var tapParser = require("tap-parser"),
    tapir = require("./index.js")

module.exports = streamTap

function streamTap() {
  var parser = tapParser(notify)

  parser.on("error", reportError)

  return parser

  function reportError() {
    tapir.notify("Error", "Node " + process.version + " Runtime Error Detected")
  }
}

function notify(result) {
  var status = result.fail.length ? "Fail" : "Pass",
      total = result.asserts.length,
      passed = result.pass.length

  var message = "Node " + process.version + ": passing " + passed + "/" + total

  tapir.notify(status, message)
}
