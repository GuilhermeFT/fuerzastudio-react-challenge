import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'

import logoImg from '../../assets/images/logo.svg'

import styles from './styles.module.scss'

export function HomePage() {
  return (
    <main className={styles.container}>
      <img src={logoImg} alt="Nocturnal logo" />
      <h1>Create notes and manage your journals</h1>

      <Link to="/login">Sign in</Link>

      <Link to="/signup">
        <Button>Start now</Button>
      </Link>
    </main>
  )
}
