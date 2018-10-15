import {g} from 'gelerator'
import './views/Main.css'

const rawWordArr = [
  'booth',
  'distracted',
  'redemption',
  'plain',
  'collapse',
  'borough',
  'promotion',
  'meatball',
  'vintage',
  'wand',
]

function sortArr(arr) { return arr.sort((i, j) => i.length - j.length) }

const sortedArr = sortArr(rawWordArr)

const allWordsObj = {}

function putIn({wordsObj, wordStr, xNum, yNum, isHorizon}) {
  const len = wordStr.length
  for (let i = 0; i < len; i += 1) {
    const letter = wordStr[i]
    if (!wordsObj[letter]) wordsObj[letter] = []
    wordsObj[letter].push({
      x: xNum + (isHorizon ? i : 0),
      y: yNum + (isHorizon ? 0 : i)
    })
  }
}

putIn({
  wordsObj: allWordsObj,
  wordStr: rawWordArr.pop(),
  xNum: 0,
  yNum: 0,
  isHorizon: true
})

function findPosition({matrixObj, wordsObj, wordStr}) {
  const available = []
  const len = wordStr.length
  for (let i = 0; i < len; i += 1) {
    const letter = wordStr[i]
    if (!wordsObj[letter]) continue
    wordsObj[letter].forEach(xyObj => {
      const xNum = xyObj.x
      const yNum = xyObj.y
      const isHorizon = matrixObj[yNum][xNum + 1] === undefined
      
      if (isHorizon) {
        // 横的话，左一不该有东西
        if (matrixObj[yNum][xNum - i - 1] !== undefined) return
        if (matrixObj[yNum][xNum - i + len] !== undefined) return
        for (let j = 0; j < len; j += 1) {
          if (i === j) continue
          if (matrixObj[yNum - 1] && matrixObj[yNum - 1][xNum - i + j] !== undefined) return
          if (matrixObj[yNum][xNum - i + j] !== undefined) return
          if (matrixObj[yNum + 1] && matrixObj[yNum + 1][xNum - i + j] !== undefined) return
        }
      } else {
        if (matrixObj[yNum - i - 1] && matrixObj[yNum - i - 1][xNum] !== undefined) return
        if (matrixObj[yNum - i + len] && matrixObj[yNum - i + len][xNum] !== undefined) return
        for (let j = 0; j < len; j += 1) {
          if (i === j || matrixObj[yNum - i + j] === undefined) continue
          if (matrixObj[yNum - i + j][xNum - 1] !== undefined) return
          if (matrixObj[yNum - i + j][xNum] !== undefined) return
          if (matrixObj[yNum - i + j][xNum + 1] !== undefined) return
        }
      }
      
      available.push({
        wordStr,
        xNum: xyObj.x - (isHorizon ? i : 0),
        yNum: xyObj.y - (isHorizon ? 0 : i),
        isHorizon
      })
    })
  }
  return available
}

function wordsObjToMatrix(wordsObj) {
  const matrix = []
  Object.keys(wordsObj).forEach(letter => {
    wordsObj[letter].forEach(letterObj => {
      const y = letterObj.y
      const x = letterObj.x
      if (!matrix[y]) matrix[y] = {}
      matrix[y][x] = letter
    })
  })
  return matrix
}

for (let i = 0; i < 9; i += 1) {
  const nextObjArr = findPosition({
    wordsObj: allWordsObj,
    wordStr: sortedArr.pop(),
    matrixObj: wordsObjToMatrix(allWordsObj)
  })

  if (!nextObjArr.length) location.reload()

  const idx = Math.floor(nextObjArr.length * Math.random())
  const nextObj = nextObjArr[idx]
  
  putIn({
    wordsObj: allWordsObj,
    wordStr: nextObj.wordStr,
    xNum: nextObj.xNum,
    yNum: nextObj.yNum,
    isHorizon: nextObj.isHorizon
  })
}

const matrixObj = wordsObjToMatrix(allWordsObj)
Object.keys(matrixObj).forEach(y => {
  Object.keys(matrixObj[y]).forEach(x => {
    document.body.appendChild(g({
      style: `transform:translate(${x}em,${y}em)`,
      class: 'letter'
    })(matrixObj[y][x]))
  })
})

// wordsObjToMatrix(allWordsObj).forEach(line => {
//   let l = ''
//   for (let i = -50; i < 50; i += 1) {
//     l += line[i] ? line[i] : ' '
//     l += ' '
//   }
//   console.log(l)
// })

