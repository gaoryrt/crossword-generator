// import CWG from '../dist/crossword-generator.min'
import CWG from './App'
import { g } from 'gelerator'
import './demo.css'

const $ = s => document.getElementById(s)

const words = [
  'shout-out',
  'enormous',
  'mail',
  'domestic',
  'postbox',
  'spicy'
]

const answers = [
  '大声说出',
  '庞大的',
  '邮件/邮递',
  '国内的/家务的',
  '邮箱',
  '加香料的/香辣的'
]

const result = CWG(words)

const ctnr = g({
  class: 'ctnr',
  style: `height:${30*result.height+4}px;width:${30*result.width+4}px`
})()
const hint = g('hint')()
document.body.appendChild(ctnr)
document.body.appendChild(hint)

result.ownerMap.forEach((line, y) => {
  line.forEach((obj, x) => {
    ctnr.appendChild(g({
      id: x + '' + y,
      'data-letter': obj.letter,
      'data-v': obj.vertical === undefined ? '' : obj.vertical,
      'data-h': obj.horizontal === undefined ? '' : obj.horizontal,
      'data-x': x,
      'data-y': y,
      maxlength: 1,
      autocomplete: 'off',
      placeholder: obj.letter,
      style: `left:${30*x}px;top:${30*y}px`
    }, 'input')())
  })
})

let doinVertically = null
ctnr.addEventListener('focus', e => {
  const el = e.target
  const h = el.dataset.h
  const v = el.dataset.v
  hint.innerHTML = (h ? 'horizontal：' + answers[h] : '') + (v ? '<br>vertical：' + answers[v] : '<br>')
}, true)

ctnr.addEventListener('input', e => {
  const el = e.target
  const thisId = + el.id
  const right = $(thisId + 10)
  const down = $((thisId > 8 ? '' : '0') + (thisId + 1))
  if (e.data === null) return
  if (!right && !down) {
    doinVertically = null
  } else if (right && right.value === '' && (!down || down.value)) {
    doinVertically = false
  } else if (down && down.value === '' && (!right || right.value)) {
    doinVertically = true
  }
  if (doinVertically === null) return el.blur()
  if (doinVertically) down.focus()
  else right.focus()
})