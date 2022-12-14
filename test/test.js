const { expect } = require('chai')
const LogicParser = require('../lib/')

describe('Logic parsing', () => {
  const p = new LogicParser(/\d+/)

  it('only unit', () => {
    expect(p.parse('123')).to.deep.equal('123')
  })

  it('simple &&', () => {
    expect(p.parse('1 && 2')).to.deep.equal({
      type: 'and',
      left: '1',
      right: '2',
    })
  })

  it('simple ||', () => {
    expect(p.parse('1 || 2')).to.deep.equal({
      type: 'or',
      left: '1',
      right: '2',
    })
  })

  it('simple !', () => {
    expect(p.parse('!1')).to.deep.equal({
      type: 'not',
      op: '1',
    })
  })

  it('&& and || and !', () => {
    expect(p.parse('1 && 2 || !3')).to.deep.equal({
      type: 'or',
      left: {
        type: 'and',
        left: '1',
        right: '2',
      },
      right: {
        type: 'not',
        op: '3',
      },
    })
  })

  it('parens', () => {
    expect(p.parse('1 && (!2 || 3)')).to.deep.equal({
      type: 'and',
      left: '1',
      right: {
        type: 'or',
        left: {
          type: 'not',
          op: '2',
        },
        right: '3',
      },
    })
  })

  it('nested parens', () => {
    expect(p.parse('((1 && 2))')).to.deep.equal({
      type: 'and',
      left: '1',
      right: '2',
    })
  })

  it('complicated case', () => {
    expect(p.parse('1 && (2 || !3 && 4 || 5)')).to.deep.equal({
      type: 'and',
      left: '1',
      right: {
        type: 'or',
        left: {
          type: 'or',
          left: '2',
          right: {
            type: 'and',
            left: {
              type: 'not',
              op: '3',
            },
            right: '4',
          },
        },
        right: '5',
      },
    })
  })
})
