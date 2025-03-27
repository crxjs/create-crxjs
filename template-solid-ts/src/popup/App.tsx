import crxLogo from '@/assets/crx.svg'
import solidLogo from '@/assets/solid.svg'
import viteLogo from '@/assets/vite.svg'
import { createSignal } from 'solid-js'
import './App.css'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
        <a href="https://crxjs.dev/vite-plugin" target="_blank">
          <img src={crxLogo} class="logo crx" alt="crx logo" />
        </a>
      </div>
      <h1>Vite + Solid + CRXJS</h1>
      <div class="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is
          {' '}
          {count()}
        </button>
        <p>
          Edit
          {' '}
          <code>src/popup/App.tsx</code>
          {' '}
          and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite, Solid and CRXJS logos to learn more
      </p>
    </>
  )
}

export default App
