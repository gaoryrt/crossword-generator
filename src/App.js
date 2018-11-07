import { g } from 'gelerator'
import './views/Main.css'

const rawWordArr = [
  'redemption',
  'distracted',
  'promotion',
  'meatball',
  'collapse',
  'vintage',
  'borough',
  'plain',
  'booth',
  'wand'
]

function sortArr(arr) {
  return arr.sort((i, j) => i.length - j.length)
}

const sortedArr = sortArr(rawWordArr)

const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}

// function putIn({wordsObj, wordStr, xNum, yNum, isHorizon}) {
//   const rtn = cloneDeep(wordsObj)
//   for (let i = 0, len = wordStr.length; i < len; i += 1) {
//     const letter = wordStr[i]
//     if (!rtn[letter]) rtn[letter] = []
//     rtn[letter].push({
//       x: xNum + (isHorizon ? i : 0),
//       y: yNum + (isHorizon ? 0 : i)
//     })
//   }
//   return rtn
// }

function letterMapOfPositionObjArr(positionObjArr) {
  const rtn = {}
  positionObjArr.forEach(positionObj => {
    for (let i = 0, len = positionObj.wordStr.length; i < len; i += 1) {
      const letter = positionObj.wordStr[i]
      if (!rtn[letter]) rtn[letter] = []
      rtn[letter].push({
        x: positionObj.xNum + (positionObj.isHorizon ? i : 0),
        y: positionObj.yNum + (positionObj.isHorizon ? 0 : i)
      })
    }
  })
  return rtn
}

function findPosition({ matrixObj, wordsObj, wordStr }) {
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

function putOnScreen(wordsObj) {
  let c = 0
  const matrixObj = wordsObjToMatrix(wordsObj)
  Object.keys(matrixObj).forEach(y => {
    Object.keys(matrixObj[y]).forEach(x => {
      document.body.appendChild(
        g({
          style: `transform:translate(${x}em,${y}em)`,
          class: 'letter'
        })(matrixObj[y][x])
      )
      c += 1
    })
  })
  console.log(c)
  return c
}

const draw = (positionObjArr, wordStr) => {
  const letterMap = letterMapOfPositionObjArr(positionObjArr)
  if (!wordStr) return putOnScreen(letterMap)
  const nextObjArr = findPosition({
    wordStr,
    wordsObj: letterMap,
    matrixObj: wordsObjToMatrix(letterMap)
  })
  if (nextObjArr.length) {
    const arr = shuffle(nextObjArr)
    const theWordStr = sortedArr.pop()
    for (let i = 0; i < nextObjArr.length; i += 1) {
      const nextObj = arr[i]
      const ans = draw(positionObjArr.concat(nextObj), theWordStr)
      if (ans) {
        positionObjArr.push(nextObj)
        sortedArr.push(theWordStr)
        return ans
      } else {
        console.log('尝试往已有状态', positionObjArr, '中放入单词', theWordStr, '时失败')
        const lastPositionObjArr = positionObjArr.slice(0, -1)
        const lastWordStr = positionObjArr[positionObjArr.length - 1].wordStr
        sortedArr.push(wordStr)
        sortedArr.push(theWordStr)
        return draw(lastPositionObjArr, lastWordStr)
      }
    }
  } else return false
}

draw([{ wordStr: sortedArr.pop(), xNum: 0, yNum: 0, isHorizon: true }], sortedArr.pop())