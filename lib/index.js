const nearley = require('nearley')
const initGrammer = require('./logic.modified.js')

class LogicParser {
  constructor(unitRegexp) {
    this.grammar = initGrammer(unitRegexp)
  }

  parse(input) {
    const parser = new nearley.Parser(
      nearley.Grammar.fromCompiled(this.grammar)
    )
    return parser.feed(input).results[0]
  }
}

module.exports = LogicParser
