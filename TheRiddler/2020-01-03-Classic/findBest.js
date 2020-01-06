const puzzles = require('./puzzles')

console .log (
  puzzles
    .filter (({letters}) => !letters .includes ('s'))
    .filter (({hasPangram}) => hasPangram)
    .reduce (
      (best, curr) => curr.score > best.score ? curr : best,
      {score: -Infinity} 
    )
)