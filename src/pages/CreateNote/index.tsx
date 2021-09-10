import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { Loader } from '../../components/Loader'
import { Navbar } from '../../components/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '../../hooks/useQuery'
import { Entry } from '../../interfaces/entry.interface'
import { Journal } from '../../interfaces/journal.interface'
import http from '../../services/api'

import styles from './styles.module.scss'

type CreateNoteParams = {
  journalId: string
}

export function CreateNote() {
  let updateIdQuery = useQuery().get('updateId')

  const history = useHistory()
  const { user, logout } = useAuth()
  const { journalId } = useParams<CreateNoteParams>()

  const [noteName, setNoteName] = useState('')
  const [content, setContent] = useState('')

  const [journal, setJournal] = useState<Journal>()

  useEffect(() => {
    http.get(`/journals/${user.id}`).then((response: any) => {
      if (!response) {
        toast.error('error fetching journals on create note!')
        logout()
        return null
      }

      if (updateIdQuery) {
        http.get(`/journals/entries/${journalId}`).then((response: any) => {
          if (response) {
            const entry = (response.entries as Entry[]).filter(
              entry => entry.id === updateIdQuery
            )[0]

            setNoteName(entry.title)
            setContent(entry.content)
          } else {
            updateIdQuery = null
          }
        })
      }

      setJournal(
        response.journals.filter(
          (journal: Journal) => journal.id === journalId
        )[0] || null
      )
    })
  }, [])

  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()
    if (noteName.trim() === '' || content.trim() === '') {
      if (noteName.trim() === '') {
        toast.warning('Name field is empty!')
      }

      if (content.trim() === '') {
        toast.warning('Content field is empty!')
      }
      return null
    }

    if (!updateIdQuery) {
      const response: any = await http.post(`/journals/entry/${journalId}`, {
        title: noteName,
        content: content
      })

      if (!response) {
        toast.error('error creating note!')
        return null
      }

      history.push(`/my-journals/${journalId}`)
    } else {
      const response: any = await http.put(`/journals/entry/${updateIdQuery}`, {
        title: noteName,
        content: content
      })

      if (!response) {
        toast.error('error updating note!')
        return null
      }

      history.push(`/my-journals/${journalId}/${updateIdQuery}`)
    }
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        {journal === undefined ? (
          <Loader />
        ) : journal !== null ? (
          <>
            <Navbar
              disableButton
              linkToBackButton={`/my-journals/${journal.id}`}
              linkText={journal.title}
            />
            <form onSubmit={handleOnSubmitForm}>
              <input
                type="text"
                placeholder="Enter note name"
                value={noteName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setNoteName(e.target.value)
                }}
              />
              <textarea
                placeholder="Write your note"
                value={content}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setContent(e.target.value)
                }}
              />
              <Button type="submit">Save note</Button>
            </form>
          </>
        ) : (
          <Redirect to="/my-journals" />
        )}
      </main>
    </>
  )
}
