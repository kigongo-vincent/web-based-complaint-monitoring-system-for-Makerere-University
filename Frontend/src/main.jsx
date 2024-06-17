import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'


import { Provider } from 'react-redux'

import { store } from './model/store.js'

import { MemoryRouter } from 'react-router-dom'

import './index.css'

import { AnimatePresence } from 'framer-motion'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AnimatePresence mode='popLayout'>

    <Provider store={store}>
      
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
    </AnimatePresence>
  </React.StrictMode>,
)
