import { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './styles.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  outline?: boolean
}
export function Button({ children, outline, ...rest }: ButtonProps) {
  return (
    <button
      className={`${styles.container} ${outline ? styles.outline : ''}`}
      {...rest}
    >
      {children}
    </button>
  )
}
