const {promisify} = require ('util')
const readFile = promisify (require ('fs') .readFile)
const {sum, remove, tap} = require ('ramda')

const testWord = (letters) => (word) => 
  word 
    .split ('')
    .every (letter => letters .includes (letter))
  && word .includes (letters [0])

const findWords = (letters) => (words) =>
  words .filter (testWord (letters))

const isPangram = (letters) => (word) =>
  letters .every (letter => word .includes (letter))

const hasPangram = (letters) => (words) =>
  words .some (isPangram (letters))

const wordScore = (letters) => (word) => 
  (word.length == 4 ? 1 : word.length) +
  (isPangram (letters) (word) ? 7 : 0)

const score = (letters) => (words) =>
  sum (words .map (wordScore (letters)))

const describe = (combo) => (words, matches = findWords (combo) (words)) =>
  ({combo, score: score (combo) (matches), words: matches})

const collect = (combos) => (words) =>
  combos .forEach ((combo) => {
    const desc = describe (combo) (words)
    console.log (`  {letters: '${combo.join('')}', score: ${desc.score}, hasPangram: ${hasPangram (combo) (desc.words)}, totalWords: ${desc.words.length}},`)
  })
    
const combinations = (n, tokens) => 
  (n < 1 || n > tokens.length)
    ? []
  : n == 1
    ? tokens
  : tokens .flatMap ((t, i) => combinations (n - 1, tokens .slice (i + 1)) .map (comb => [t, ...comb]))

const puzzles = (alphabet) => alphabet .flatMap (
  (letter, idx) => combinations (6, remove (idx, 1, alphabet))
    .map (combo => [letter, ...combo])
)

const alphabet = 'abcdefghijklmnopqrstuvwxyz' .split ('')

readFile ('./wordlist.txt', 'utf8')
  .then (res => res .split ('\n'))
  .then (res => res .filter (Boolean)) // remove empty lines
  .then (tap ((words) => console .log ('module.exports = [')))
  .then (res => res .filter (r => r .length > 3 && ! r .includes ('s')))
  .then (collect (puzzles (alphabet)))
  .then (tap (() => console .log (']')))
  .catch (console.warn)