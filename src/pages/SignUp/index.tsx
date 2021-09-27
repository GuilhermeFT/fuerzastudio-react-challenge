import { ChangeEvent, FormEvent, useState } from 'react'
import { Redirect, useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import logoImg from '../../assets/images/logo.svg'
import { Button } from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'

import styles from './styles.module.scss'

export function SignUp() {
  const history = useHistory()
  const { isAuthenticated, newAccount } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

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

    // Caso esteja tudo certo com os inputs, passamos os dados para a função newAccount do nosso AuthContext
    if (!(await newAccount(username, password, email))) {
      toast.error('Error on create account. Try other username!')
    } else {
      toast.success('account created successfully!')
      history.push('/') // Volta para a listagem após concluir a requisição
    }
  }

  // Renderiza esta tela somente se o usuário não estiver authenticado. Caso contrário, o redirecionamos para listagem de Journals
  return !isAuthenticated ? (
    <main className={styles.container}>
      <Link to="/">
        <img src={logoImg} alt="Nocturnal logo" />
      </Link>
      <h1>Sign up</h1>
      <Link className={styles.signin} to="/">
        Already have an account
      </Link>

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
