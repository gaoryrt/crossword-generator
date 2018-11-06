import {g} from 'gelerator'
import {cloneDeep} from 'lodash'
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

function sortArr(arr) { return arr.sort((i, j) => i.length - j.length)}

const sortedArr = sortArr(rawWordArr)

const allWordsObj = {}

const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}

function putIn({wordsObj, wordStr, xNum, yNum, isHorizon}) {
  const rtn = cloneDeep(wordsObj)
  for (let i = 0, len = wordStr.length; i < len; i += 1) {
    const letter = wordStr[i]
    if (!rtn[letter]) rtn[letter] = []
    rtn[letter].push({
      x: xNum + (isHorizon ? i : 0),
      y: yNum + (isHorizon ? 0 : i)
    })
  }
  return rtn
}

function findPosition({matrixObj, wordsObj, wordStr}) {
  if (!wordStr) return []
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

function output(wordsObj) {
  let c = 0
  const matrixObj = wordsObjToMatrix(wordsObj)
  Object.keys(matrixObj).forEach(y => {
    Object.keys(matrixObj[y]).forEach(x => {
      document.body.appendChild(g({
        style: `transform:translate(${x}em,${y}em)`,
        class: 'letter'
      })(matrixObj[y][x]))
      c += 1
    })
  })
  console.log(c)
}

const ansArr = []

const draw = (lastWordsObj, putInObj) => {
  ansArr.push(putInObj)
  const tempWordsObj = putIn({
    wordsObj: lastWordsObj,
    wordStr: putInObj.wordStr,
    xNum: putInObj.xNum,
    yNum: putInObj.yNum,
    isHorizon: putInObj.isHorizon
  })

  const nextWord = sortedArr.pop()

  const nextObjArr = findPosition({
    wordsObj: tempWordsObj,
    wordStr: nextWord,
    matrixObj: wordsObjToMatrix(tempWordsObj)
  })

  if (!nextWord) output(tempWordsObj)
  else if (nextObjArr.length) {
    const arr = shuffle(nextObjArr)
    for (let i = 0; i < nextObjArr.length; i += 1) {
      const nextObj = arr[i]
      const ans = draw(tempWordsObj, nextObj)
      if (!ans) return ans
      else {
        console.log(ansArr)
        return output(tempWordsObj)
      }
    }
  } else {
    return 1
  }
}

// 开始
draw(allWordsObj, {
  wordStr: rawWordArr.pop(),
  xNum: 0,
  yNum: 0,
  isHorizon: true
})

