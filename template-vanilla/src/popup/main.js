import crxLogo from '@/assets/crx.svg'
import jsLogo from '@/assets/js.svg'
import viteLogo from '@/assets/vite.svg'
import { setupCounter } from './counter.js'
import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${jsLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <a href="https://crxjs.dev/vite-plugin" target="_blank">
      <img src="${crxLogo}" class="logo crx" alt="CRXJS logo" />
    </a>
    <h1>Hello CRXJS!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the CRXJS logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
