import { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import styles from './styles.module.scss'

interface FooterProps {
  children?: ReactNode
}

export function Footer({ children }: FooterProps) {
  const { logout } = useAuth()
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        {children}
        <button className={styles.logout} type="button" onClick={logout}>
          Log Out
        </button>
      </div>
    </footer>
  )
}
