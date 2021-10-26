# Logic Parser

A simple library to parse _logic expression_ to AST.

## Grammar

Formal definition:

```
# _ means arbitrary amount of whitespace
expr -> expr _ "||" _ term | term
term -> term _ "&&" _ factor | factor
factor -> unit | "(" _ expr _ ")"
```

`unit` is user defined token, it can be anything defined by a regexp.

Based on the grammar, we can know that

- `&&` operator has high priority than `||`
- both `&&` and `||` are left associative

Examples (suppose `unit=\d+`):

- `1`
- `1 && 2`
- `1 && 2 && 3`
- `1 && 2 || 3`
- `1 && (2 || 3)`
- `1 && (2 || 3 && 4 || 5)`

## API

```javascript
import LogicParser from '@cjting/logic-parser'

// @param unitRegexp: a regexp to define what unit is like
const parser = new LogicParser(/\d+/) //

// return AST if input is valid, throw error otherwise
parser.parse('1 && 2 || 3')

// `left` and `right` are either object or simple strings captured by `unitRegexp`
/*
{
  type: 'or',
  left: {
    type: 'and',
    left: '1',
    right: '2',
  },
  right: '3',
}
*/
```

## Dev

- Write grammar in `lib/logic.ne`
- `pnpm run gen` generates grammar file
- Modify `lib/logic.modified.js` to support passing of unit regexp
