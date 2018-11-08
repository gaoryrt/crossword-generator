# CWG
> crossword-generator

[![NPM](https://nodei.co/npm/cwg.png?compact=true)](https://nodei.co/npm/cwg/)

## install
```sh
yarn add cwg
```

## use
> `yarn dev`
```js
import CWG from 'cwg'
const words = [
  'do',
  'not'
]

const result = CWG(words)
console.log(result)
```

## parameters
```js
// console.log(result)
//   * d *
//   n o t
{
  height: 2,            // height of the matrix
  width: 3,             // width of the matrix
  positionObjArr: [     // position of each input word, as input's order
    {
      wordStr: 'do',    // string of word
      xNum: 1,          // begin position x
      yNum: 0,          // begin position y
      isHorizon: false  // horizontal or vertical
    },
    {
      wordStr: 'not',
      xNum: 0,
      yNum: 1,
      isHorizon: true
    }
  ],
  ownerMap: [           // matrix of the crossword
    [
      empty,
      {
        letter: 'd',    // letter of this position
        vertical: 0     // which word this letter belongs to. in this case, it's 0th: 'do'
      },
      empty
    ],
    [
      { letter: "n", horizontal: 1 },
      { letter: "o", vertical: 0, horizontal: 1 }, // this letter belongs to both words
      { letter: "t", horizontal: 1 }
    ]
  ]
}
```


## todo
[ ] handle no-result words
[ ] do not sort the input array at the beginning