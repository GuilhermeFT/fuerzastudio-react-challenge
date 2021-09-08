import React from 'react'
import ReactDOM from 'react-dom'
import { AuthContextProvider } from './contexts/AuthContext'
import Routes from './Routes'
import { setupServer } from './services/mirage/server'

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
