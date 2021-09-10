import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '../../hooks/useQuery'
import { Journal } from '../../interfaces/journal.interface'

import http from '../../services/api'

import styles from './styles.module.scss'

export function CreateJournal() {
  let updateIdQuery = useQuery().get('updateId')

  const history = useHistory()
  const { user, logout } = useAuth()
  const [journalName, setJournalName] = useState('')

  useEffect(() => {
    http.get(`/journals/${user.id}`).then((response: any) => {
      if (response) {
        const journal = (response.journals as Journal[]).filter(
          journal => journal.id === updateIdQuery
        )[0]

        setJournalName(journal.title)
      } else {
        updateIdQuery = null
      }
    })
  }, [])

  // Função responsável validar a a criação de um novo journal
  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    if (journalName.trim() === '') {
      toast.warning('journal name field is empty!')
      return null
    }

    if (!updateIdQuery) {
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
    } else {
      const response = await http.put(`/journals/${updateIdQuery}`, {
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
