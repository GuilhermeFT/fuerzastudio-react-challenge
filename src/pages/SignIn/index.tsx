import { ChangeEvent, FormEvent, useState } from 'react'
import { Redirect } from 'react-router'

import { useAuth } from '../../hooks/useAuth'

import logoImg from '../../assets/images/logo.svg'

import styles from './styles.module.scss'
import { Button } from '../../components/Button'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export function SignIn() {
  const { isAuthenticated, authenticate } = useAuth() // Hook de autenticação

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Função responsável validar a autenticação após a submissão do formulário
  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    // Verifica se há informações nos inputs de username e password válidas
    if (username.trim() === '' || password.trim() === '') {
      if (username.trim() === '') {
        toast.warning('username field is empty!')
      }

      if (password.trim() === '') {
        toast.warning('password field is empty!')
      }
      return null
    }

    // Caso esteja tudo certo com os inputs, passamos os dados para a função autenticate do nosso AuthContext
    if (!(await authenticate(username, password))) {
      toast.error('User not found!')
    }
  }

  // Renderiza esta tela somente se o usuário não estiver authenticado. Caso contrário, o redirecionamos para listagem de Journals
  return !isAuthenticated ? (
    <main className={styles.container}>
      <Link to="/">
        <img src={logoImg} alt="Nocturnal logo" />
      </Link>
      <h1>Sign in</h1>
      <Link className={styles.signup} to="/signup">
        Sign up
      </Link>

      <form className={styles.formContent} onSubmit={handleOnSubmitForm}>
        <div
          className={styles.inputContainer}
          onClick={() => document.getElementById('username')?.focus()}
        >
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <label className={styles.inputLabel} htmlFor="username">
            Your username
          </label>
        </div>

        <div
          className={styles.inputContainer}
          onClick={() => document.getElementById('password')?.focus()}
        >
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <label className={styles.inputLabel} htmlFor="password">
            Your password
          </label>
        </div>

        <Button type="submit">Log In</Button>
      </form>
    </main>
  ) : (
    <Redirect to="/my-journals" />
  )
}
