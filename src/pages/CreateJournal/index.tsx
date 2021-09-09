import { AxiosResponse } from 'axios'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useHistory } from 'react-router'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { useAuth } from '../../hooks/useAuth'
import { Journal } from '../../interfaces/journal.interface'
import http from '../../services/api'

import styles from './styles.module.scss'

export function CreateJournal() {
  const history = useHistory()
  const { user, addNewJournal } = useAuth()
  const [journalName, setJournalName] = useState('')

  // Função responsável validar a a criação de um novo journal
  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    const response: AxiosResponse<any> | { journal: Journal } = await http.post(
      '/journals',
      {
        userId: user.id,
        title: journalName
      }
    )

    if (!response) {
      return null
    }

    const newJournal = (response as { journal: Journal }).journal
    addNewJournal(newJournal.id || '')
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
            placeholder="Journal name"
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
