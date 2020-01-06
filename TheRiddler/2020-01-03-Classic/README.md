The Puzzle
----------

In the New York Times [Spelling Bee][sb] puzzle, we need to find words made from letters in a grid like this:

![SpellingBee][sbl]

You can repeat letters, but must always use the central one.  Words must be at least four letters long, and they are scored as 1 point for 4-letter ones, and `n` points for any `n`-letter word.  There is a 7-point bonus for words which use all seven of the letters in the grid.

[The puzzle][pu] is to find the grid with the highest score, using a [standard word list][wl].


My solution
-----------

My solution is pure brute-force.  The word list has `172,820` words, which we could choose to reduce by removing the ones with `s`, but I'll save that to the end.  There are `4,604,600` (`20 * (26 choose 6)`) possible grids, since order around the outside does not matter.
(Again, by skipping `s`, we could reduce this to `3,364,900`.)

Testing all those words against each combination is time consuming, but I just ran [some Node.js code][sp] overnight to generate a list of entries in a file that look like this:

```js
module.exports = [
  {letters: 'abcdefg', score: 285, hasPangram: false, totalWords: 73},
  {letters: 'abcdefh', score: 297, hasPangram: false, totalWords: 74},
  {letters: 'abcdefi', score: 319, hasPangram: false, totalWords: 74},
  {letters: 'abcdefj', score: 161, hasPangram: false, totalWords: 47},
  {letters: 'abcdefk', score: 255, hasPangram: true, totalWords: 66},
  // ...
  {letters: 'gaelmpx', score: 153, hasPangram: false, totalWords: 43},
  // ...
  {letters: 'zstvwxy', score: 0, hasPangram: false, totalWords: 0},
  {letters: 'zsuvwxy', score: 0, hasPangram: false, totalWords: 0},
  {letters: 'ztuvwxy', score: 0, hasPangram: false, totalWords: 0},
]
```

(Note that I needed to increase the default memory for Node, and I piped the result to a file.  The command looked like:

```shell
node --max-old-space-size=8192 scorePuzzles > puzzles.js
```
)

In these rows, the first letter is the central one, the remainder forms the outer ring.


This file serves as a node module holding all the results.  To find the maximal result, I just ran this output through the [following code][fb]:

```js
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
```

That generates the following result:

```js
{
  letters: 'raegint',
  score: 3898,
  hasPangram: true,
  totalWords: 537
}
```

And if we want to list the words, we could just reuse parts of the [the scoring code][sp] with this:

```js
readFile ('./wordlist.txt', 'utf8')
  .then (res => res .split ('\n'))
  .then (res => res .filter (Boolean))
  .then (res => res .filter (r => r .length > 3 && ! r .includes ('s')))
  .then (describe ('raegint' .split ('')))
  .then (desc => console .log (JSON.stringify(desc, null, 4)))
  .catch (console.warn)
  ```

  [fb]: ./findBest.js
  [pu]: https://fivethirtyeight.com/features/can-you-solve-the-vexing-vexillology/
  [sb]: https://www.nytimes.com/puzzles/spelling-bee
  [sbl]: https://fivethirtyeight.com/wp-content/uploads/2020/01/Screen-Shot-2019-12-24-at-5.46.55-PM.png?w=568
  [sp]: ./scorePuzzles.js
  [wl]: https://norvig.com/ngrams/enable1.txt