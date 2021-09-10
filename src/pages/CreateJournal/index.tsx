import { ChangeEvent, FormEvent, useState } from 'react'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { useAuth } from '../../hooks/useAuth'

import http from '../../services/api'

import styles from './styles.module.scss'

export function CreateJournal() {
  const history = useHistory()
  const { user, logout } = useAuth()
  const [journalName, setJournalName] = useState('')

  // Função responsável validar a a criação de um novo journal
  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    if (journalName.trim() === '') {
      toast.warning('journal name field is empty!')
      return null
    }
    const response = await http.post('/journals', {
      userId: user.id,
      title: journalName
    })

    if (!response) {
      toast.error('Error on create journal!')
      logout()

      return null
    }

    history.push('/my-journals')
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div>
          <div />
          <div>{journalName}</div>
        </div>
        <form onSubmit={handleOnSubmitForm}>
          <input
            type="text"
            placeholder="insert journal name"
            value={journalName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setJournalName(e.target.value)
            }}
          />
          <Button type="submit">Save Journal</Button>
        </form>
      </main>
    </>
  )
}
