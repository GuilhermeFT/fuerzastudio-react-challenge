import { ChangeEvent, FormEvent, useState } from 'react'
import { Redirect } from 'react-router'

import { useAuth } from '../../hooks/useAuth'

import logoImg from '../../assets/images/logo.svg'

import styles from './styles.module.scss'
import { Button } from '../../components/Button'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export function SignIn() {
  const { isAuthenticated, authenticate } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Função responsável validar a autenticação após a submissão do formulário
  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    if (username.trim() === '' || password.trim() === '') {
      if (username.trim() === '') {
        toast.warning('username field is empty!')
      }

      if (password.trim() === '') {
        toast.warning('password field is empty!')
      }
      return null
    }

    if (!(await authenticate(username, password))) {
      toast.error('User not found!')
    }
  }

  return !isAuthenticated ? (
    <main className={styles.container}>
      <img src={logoImg} alt="Nocturnal logo" />
      <h1>Sign in</h1>
      <Link to="/signup">Sign up</Link>

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
        <a href="">Forgot password?</a>

        <Button type="submit">Log In</Button>
      </form>
    </main>
  ) : (
    <Redirect to="/my-journals" />
  )
}
