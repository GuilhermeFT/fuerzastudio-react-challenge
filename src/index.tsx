import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes'

import { AuthContextProvider } from './contexts/AuthContext'
import { setupServer } from './services/mirage/server'
import { ToastContainer } from 'react-toastify'

/* Importação dos estilos globais da aplicação */
import './styles/global.scss'
import 'react-toastify/dist/ReactToastify.css'

if (process.env.NODE_ENV === 'development') {
  setupServer()
}

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      {/* Responsável pelas Rotas de Navegação da aplicação */}
      <Routes />

      {/* Responsável pelo Toast (Janela de Notificações da aplicação) */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
      />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
