// import CWG from '../dist/crossword-generator.min'
import CWG from './App'
import { g } from 'gelerator'

const words = [
  'shout-out',
  'enormous',
  'mail',
  'domestic',
  'postbox',
  'spicy'
]

const result = CWG(words)
console.log(result)

result.ownerMap.forEach((line, y) => {
  line.forEach((obj, x) => {
    document.body.appendChild(
      g({
        style: `transform:translate(${x}em,${y}em);position:absolute`
      }, 'code')(obj.letter)
    )
  })
})
