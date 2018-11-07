import './views/Main.css'
import gen from './views/Main'
import { g } from 'gelerator'

const rtn = gen(document.querySelector('textarea').value.trim().split('\n'))
console.log(rtn)

putOnScreen(rtn.matrixObj)

function putOnScreen(matrixObj) {
  Object.keys(matrixObj).forEach(y => {
    Object.keys(matrixObj[y]).forEach(x => {
      document.body.appendChild(
        g({
          style: `transform:translate(${x}em,${y}em)`,
          class: 'letter'
        })(matrixObj[y][x])
      )
    })
  })
}