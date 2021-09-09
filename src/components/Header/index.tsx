import { ReactNode } from 'react'
import logoImg from '../../assets/images/logo.svg'

import styles from './styles.module.scss'

interface HeaderProps {
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src={logoImg} alt="Nocturnal logo" />
        {children || null}
      </div>
    </header>
  )
}
