export default arr => {
  // increase the probability of having an answer
  // const sortedArr = arr
  const sortedArr = sortArr(arr)
  return draw([{ wordStr: sortedArr.pop(), xNum: 0, yNum: 0, isHorizon: true }], sortedArr.pop())

  function sortArr(arr) {
    return [...arr].sort((pre, nex) => pre.length - nex.length)
  }

  function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr
  }

  // positionObjArr:
  // {
  //   wordStr: 'prototype',
  //   xNum: 0,
  //   yNum: 0,
  //   isHorizon: true
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

  // letterMap:
  // {
  //   x: [{x: -1, y: -1}],
  //   y: [{x: -1, y:  0}, {x: 0, y: 0}],
  //   z: [{x:  0, y:  1}, {x: 1, y: 1}]
  // }
  function findPosition({ letterMap, wordStr }) {
    const matrixObj = letterMapToMatrix(letterMap)
    if (!wordStr) return []
    const available = []
    const len = wordStr.length
    for (let i = 0; i < len; i += 1) {
      const letter = wordStr[i]
      if (!letterMap[letter]) continue
      letterMap[letter].forEach(xyObj => {
        const xNum = xyObj.x
        const yNum = xyObj.y
        const isHorizon = matrixObj[yNum][xNum + 1] === undefined

        if (isHorizon) {
          // o[y][x - 1] must have no letter if o[y][x] is horizon
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

  // matrixObj:
  // {
  //   -1: [-1: 'x', 0: 'y'        ],
  //    0: [         0: 'y', 1: 'z'],
  //    1: [                 1: 'z']
  // }
  function letterMapToMatrix(letterMap) {
    const matrix = []
    Object.keys(letterMap).forEach(letter => {
      letterMap[letter].forEach(letterObj => {
        const y = letterObj.y
        const x = letterObj.x
        if (!matrix[y]) matrix[y] = {}
        matrix[y][x] = letter
      })
    })
    return matrix
  }

  function draw(positionObjArr, wordStr) {
    const letterMap = letterMapOfPositionObjArr(positionObjArr)
    if (!wordStr) return output(positionObjArr)
    const nextObjArr = findPosition({
      wordStr,
      letterMap: letterMap
    })
    if (nextObjArr.length) {
      const arr = shuffleArr(nextObjArr)
      const theWordStr = sortedArr.pop()
      for (let i = 0; i < nextObjArr.length; i += 1) {
        const nextObj = arr[i]
        const ans = draw(positionObjArr.concat(nextObj), theWordStr)
        if (ans) {
          positionObjArr.push(nextObj)
          sortedArr.push(theWordStr)
          return ans
        }
      }
      sortedArr.push(theWordStr)
      return false
    } else return false
  }

  function output(positionObjArr) {
    let translateX = 0
    let translateY = 0
    let maxX = 0
    let maxY = 0

    positionObjArr.forEach(positionObj => {
      const wordLen = positionObj.wordStr.length
      const isHorizon = positionObj.isHorizon
      const currentX = positionObj.xNum
      const currentY = positionObj.yNum
      const tailX = currentX + wordLen * (isHorizon ? 1 : 0)
      const tailY = currentY + wordLen * (isHorizon ? 0 : 1)
      if (tailX > maxX) maxX = tailX
      if (tailY > maxY) maxY = tailY
      if (currentX < translateX) translateX = currentX
      if (currentY < translateY) translateY = currentY
    })

    const order = arr.reduce((iter, val, idx) => {
      iter[val] = idx
      return iter
    }, {})

    const newPositionObjArr = positionObjArr.map(positionObj => {
      const rtn = positionObj
      rtn.xNum -= translateX
      rtn.yNum -= translateY
      return rtn
    }).sort((a, b) => order[a.wordStr] - order[b.wordStr])

    const height = maxY - translateY
    const width = maxX - translateX

    const ownerMap = new Array(height).fill(0).map(() => new Array(width))

    newPositionObjArr.forEach((positionObj, orderIdx) => {
      const letterArr = positionObj.wordStr.split('')
      const isHorizon = positionObj.isHorizon
      const startY = positionObj.yNum
      const startX = positionObj.xNum
      letterArr.forEach((letter, letterIdx) => {
        const x = startX + (isHorizon ? letterIdx : 0)
        const y = startY + (isHorizon ? 0 : letterIdx)
        const obj = {letter}
        const key = isHorizon ? 'h' : 'v'
        const target = ownerMap[y][x] || obj
        target[key] = orderIdx
        target[key + 'Idx'] = letterIdx
        if (!ownerMap[y][x]) ownerMap[y][x] = obj
      })
    })

    return {
      height,
      width,
      positionObjArr: newPositionObjArr,
      ownerMap
    }
  }
}
