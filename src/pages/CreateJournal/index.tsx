import { AxiosResponse } from 'axios'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useHistory } from 'react-router'
import { Header } from '../../components/Header'
import { useAuth } from '../../hooks/useAuth'
import { Journal } from '../../interfaces/journal.interface'
import http from '../../services/api'

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
    history.push(`/my-journals/${newJournal.id}`)
  }

  return (
    <main>
      <Header />
      <div>name</div>
      <form onSubmit={handleOnSubmitForm}>
        <input
          type="text"
          placeholder="Enter journal name"
          value={journalName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setJournalName(e.target.value)
          }}
        />
        <button type="submit">Save Journal</button>
      </form>
    </main>
  )
}
