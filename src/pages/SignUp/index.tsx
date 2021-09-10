import { ChangeEvent, FormEvent, useState } from 'react'
import { Redirect } from 'react-router'
import { toast } from 'react-toastify'
import logoImg from '../../assets/images/logo.svg'
import { Button } from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'

import styles from './styles.module.scss'

export function SignUp() {
  const { isAuthenticated, newAccount } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

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

    if (!(await newAccount(username, password, email))) {
      toast.error('Error on create account!')
    }
  }

  return !isAuthenticated ? (
    <main className={styles.container}>
      <img src={logoImg} alt="Nocturnal logo" />
      <h1>Sign up</h1>
      <a href="">Already have an account</a>

      <form className={styles.formContent} onSubmit={handleOnSubmitForm}>
        <div
          className={styles.inputContainer}
          onClick={() => document.getElementById('username')?.focus()}
        >
          <input
            className={styles.inputLabel}
            id="username"
            type="text"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <label htmlFor="username">Define a username</label>
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
          <label htmlFor="password">Set your password</label>
        </div>

        <div
          className={styles.inputContainer}
          onClick={() => document.getElementById('email')?.focus()}
        >
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <label htmlFor="email">Email (optional)</label>
        </div>
        <Button type="submit">Create account</Button>
      </form>
    </main>
  ) : (
    <Redirect to="/my-journals" />
  )
}
