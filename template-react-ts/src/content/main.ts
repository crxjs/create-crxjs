import { createElement, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './views/App.js'

console.log('[CRXJS] Hello world from content script!')

/**
 * Mount the React app to the DOM.
 */
function mountApp() {
  const container = document.createElement('div')
  container.id = 'crxjs-app'
  document.body.appendChild(container)
  createRoot(container).render(
    createElement(
      StrictMode,
      null,
      createElement(App, null),
    ),
  )
}

mountApp()
