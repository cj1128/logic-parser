@{%
const moo = require("moo");

const lexer = moo.compile({
  unit:     /\d+/,
  space: {match: /\s+/, lineBreaks: true},
  "||": "||",
  "&&": "&&",
  "(": "(",
  ")": ")",
});
%}

@lexer lexer

expr -> expr _ "||" _ term {% d => ({type: "or", left: d[0], right: d[4]}) %}
  | term {% id %}

term -> term _ "&&" _ factor {% d => ({type: "and", left: d[0], right: d[4]}) %}
  | factor {% id %}

factor -> %unit {% d => d[0].text %}
  | "(" _ expr _ ")" {% d => d[2] %}

_ -> null | %space {% d => null %}
