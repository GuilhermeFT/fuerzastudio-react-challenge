import { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { Redirect, useHistory, useParams } from 'react-router'

import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { Loader } from '../../components/Loader'
import { Navbar } from '../../components/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { Entry } from '../../interfaces/entry.interface'
import { Journal } from '../../interfaces/journal.interface'
import http from '../../services/api'

import styles from './styles.module.scss'

type NoteContentParams = {
  journalId: string
  noteId: string
}

export function NoteContent() {
  const history = useHistory()
  const { user, logout } = useAuth()
  const { journalId, noteId } = useParams<NoteContentParams>()

  const [journal, setJournal] = useState<Journal>()
  const [entry, setEntry] = useState<Entry | null>()

  useEffect(() => {
    http.get(`/journals/${user.id}`).then((response: any) => {
      if (!response) {
        toast.error('error fetching journals')
        logout()
        return null
      }

      setJournal(
        response.journals.filter(
          (journal: Journal) => journal.id === journalId
        )[0] || null
      )
    })
  }, [])

  useEffect(() => {
    if (journal === null) {
      setEntry(null)
    }
    if (journal) {
      http.get(`/journals/entries/${journalId}`).then((response: any) => {
        if (!response) {
          toast.error('error fetching entry')
          return
        }

        setEntry(
          response.entries.filter((note: Entry) => note.id === noteId)[0] ||
            null
        )
      })
    }
  }, [journal])

  function handleOnClickEditNoteButton() {
    history.push(`/new/note/${journalId}?updateId=${entry?.id}`)
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <Navbar
          disableButton
          linkText="Back"
          linkToBackButton={`/my-journals/${journal?.id}`}
        />
        {journal === undefined || entry === undefined ? (
          <Loader />
        ) : journal && entry ? (
          <div className={styles.content}>
            <h1>{entry.title}</h1>

            <p>{entry.content}</p>
          </div>
        ) : (
          <Redirect to="/my-journals" />
        )}
      </main>
      <Footer>
        <Button outline type="button" onClick={handleOnClickEditNoteButton}>
          <FaEdit />
          Edit note
        </Button>
      </Footer>
    </>
  )
}
