import { useEffect, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { Header } from '../../components/Header'
import { Loader } from '../../components/Loader'
import { Navbar } from '../../components/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { Entry } from '../../interfaces/entry.interface'
import { Journal } from '../../interfaces/journal.interface'
import http from '../../services/api'

import meditateImg from '../../assets/images/meditate.svg'

import styles from './styles.module.scss'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/Footer'
import { Button } from '../../components/Button'
import { FaEdit } from 'react-icons/fa'

type NoteListParams = {
  journalId: string
}

export function NoteList() {
  const history = useHistory()
  const { user, logout } = useAuth()
  const { journalId } = useParams<NoteListParams>()

  const [journal, setJournal] = useState<Journal>()
  const [entries, setEntries] = useState<Entry[]>()

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
    http.get(`/journals/entries/${journalId}`).then((response: any) => {
      if (!response) {
        toast.error('error fetching entries')
        return null
      }

      setEntries(response.entries as Entry[])
    })
  }, [])

  function handleOnClickEditJournalButton() {
    history.push(`/new/journal/${journalId}?updateId=${journalId}`)
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        {journal === undefined ? (
          <Loader />
        ) : journal !== null ? (
          entries?.length !== 0 ? (
            <>
              <Navbar
                linkText={journal.title}
                linkToBackButton="/my-journals"
                linkToAddButton={`/new/note/${journalId}`}
              />
              <ul className={styles.list}>
                {entries?.map(entry => (
                  <Link
                    key={entry.id}
                    to={`/my-journals/${journalId}/${entry.id}`}
                  >
                    <li>{entry.title}</li>
                  </Link>
                ))}
              </ul>
            </>
          ) : (
            <div className={styles.emptyList}>
              <img src={meditateImg} alt="" />
              <Link to={`/new/note/${journalId}`}>Create a note</Link>
            </div>
          )
        ) : (
          <Redirect to="/my-journals" />
        )}
      </main>

      <Footer>
        <Button outline type="button" onClick={handleOnClickEditJournalButton}>
          <FaEdit />
          Edit journal
        </Button>
      </Footer>
    </>
  )
}
