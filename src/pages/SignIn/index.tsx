import { ChangeEvent, FormEvent, useState } from 'react'
import { Redirect } from 'react-router'
import logoImg from '../../assets/images/logo.svg'
import { useAuth } from '../../hooks/useAuth'

export function SignIn() {
  const { isAuthenticated, authenticate } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Função responsável validar a autenticação após a submissão do formulário
  function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    authenticate(username, password)
  }

  return !isAuthenticated ? (
    <main>
      <img src={logoImg} alt="Nocturnal logo" />
      <h1>Sign in</h1>
      <a href="">Sign up</a>

      <form onSubmit={handleOnSubmitForm}>
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
        <input
          type="text"
          placeholder="Your password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <a href="">Forgot password?</a>

        <button type="submit">Log In</button>
      </form>
    </main>
  ) : (
    <Redirect to="/my-journals" />
  )
}
