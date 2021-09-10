import { FaAngleLeft, FaPlus } from 'react-icons/fa'
import { Link, useHistory } from 'react-router-dom'
import { Button } from '../Button'
import styles from './styles.module.scss'

interface NavbarProps {
  linkToAddButton?: string
  linkToBackButton: string
  linkText: string
  disableButton?: boolean
}

export function Navbar({
  linkToBackButton,
  linkText,
  linkToAddButton,
  disableButton = false
}: NavbarProps) {
  const history = useHistory()
  function handleOnAddNoteButtonClick() {
    history.push(linkToAddButton || '')
  }

  return (
    <nav className={styles.container}>
      <Link to={linkToBackButton}>
        <FaAngleLeft />
        {linkText}
      </Link>
      {!disableButton && (
        <Button outline onClick={handleOnAddNoteButtonClick}>
          <FaPlus />
          Add note
        </Button>
      )}
    </nav>
  )
}