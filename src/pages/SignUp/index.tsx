import { Redirect } from 'react-router'
import logoImg from '../../assets/images/logo.svg'
import { useAuth } from '../../hooks/useAuth'

export function SignUp() {
  const { isAuthenticated } = useAuth()

  return !isAuthenticated ? (
    <main>
      <img src={logoImg} alt="Nocturnal logo" />
      <h1>Sign up</h1>
      <a href="">Already have an account</a>

      <form>
        <input type="text" placeholder="Define a username" />
        <input type="password" placeholder="Set your password" />
        <input type="text" placeholder="Email (optional)" />

        <button type="submit">Create account</button>
      </form>
    </main>
  ) : (
    <Redirect to="/my-journals" />
  )
}
