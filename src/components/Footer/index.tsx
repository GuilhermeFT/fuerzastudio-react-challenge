import { ReactNode } from 'react'

import styles from './styles.module.scss'

interface FooterProps {
  children?: ReactNode
}

export function Footer({ children }: FooterProps) {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>{children}</div>
    </footer>
  )
}
