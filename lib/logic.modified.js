function id(x) {
  return x[0]
}

const moo = require('moo')

module.exports = unitRegexp => {
  const lexer = moo.compile({
    unit: unitRegexp,
    space: { match: /\s+/, lineBreaks: true },
    '||': '||',
    '&&': '&&',
    '!': '!',
    '(': '(',
    ')': ')',
  })

  const grammar = {
    Lexer: lexer,
    ParserRules: [
      { name: 'main', symbols: ['_', 'expr', '_'], postprocess: d => d[1] },
      {
        name: 'expr',
        symbols: ['expr', '_', { literal: '||' }, '_', 'term'],
        postprocess: d => ({ type: 'or', left: d[0], right: d[4] }),
      },
      { name: 'expr', symbols: ['term'], postprocess: id },
      {
        name: 'term',
        symbols: ['term', '_', { literal: '&&' }, '_', 'not'],
        postprocess: d => ({ type: 'and', left: d[0], right: d[4] }),
      },
      { name: 'term', symbols: ['not'], postprocess: id },
      {
        name: 'not',
        symbols: [{ literal: '!' }, '_', 'not'],
        postprocess: d => ({ type: 'not', op: d[2] }),
      },
      { name: 'not', symbols: ['factor'], postprocess: id },
      {
        name: 'factor',
        symbols: [lexer.has('unit') ? { type: 'unit' } : unit],
        postprocess: d => d[0].text,
      },
      {
        name: 'factor',
        symbols: [{ literal: '(' }, '_', 'expr', '_', { literal: ')' }],
        postprocess: d => d[2],
      },
      { name: '_', symbols: [] },
      {
        name: '_',
        symbols: [lexer.has('space') ? { type: 'space' } : space],
        postprocess: d => null,
      },
    ],
    ParserStart: 'main',
  }

  return grammar
}
