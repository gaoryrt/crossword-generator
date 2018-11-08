import './views/Main.css'
import gen from './views/Main'
import { g } from 'gelerator'

const rtn = gen(document.querySelector('textarea').value.trim().split('\n'))
console.log(rtn)

putOnScreen(rtn.ownerMap)

function putOnScreen(ownerMap) {
  ownerMap.forEach((line, y) => {
    line.forEach((obj, x) => {
      document.body.appendChild(
        g({
          style: `transform:translate(${x}em,${y}em)`,
          class: 'letter'
        })(obj.letter)
      )
    })
  })
}