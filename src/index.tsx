import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes'

import { AuthContextProvider } from './contexts/AuthContext'
import { setupServer } from './services/mirage/server'

import './styles/global.scss'

if (process.env.NODE_ENV === 'development') {
  setupServer()
}

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
