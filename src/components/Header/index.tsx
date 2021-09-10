import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/images/logo.svg'
import { useAuth } from '../../hooks/useAuth'

import styles from './styles.module.scss'

interface HeaderProps {
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  const { isAuthenticated } = useAuth()
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        {!isAuthenticated ? (
          <Link to="/">
            <img src={logoImg} alt="Nocturnal logo" />
          </Link>
        ) : (
          <Link to="/my-journals">
            <img src={logoImg} alt="Nocturnal logo" />
          </Link>
        )}
        {children || null}
      </div>
    </header>
  )
}
