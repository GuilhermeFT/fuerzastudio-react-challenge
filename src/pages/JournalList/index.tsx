import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { useAuth } from '../../hooks/useAuth'
import { Journal } from '../../interfaces/journal.interface'
import http from '../../services/api'
import { FaPlus } from 'react-icons/fa'

import meditateImg from '../../assets/images/meditate.svg'

import styles from './styles.module.scss'
import { Loader } from '../../components/Loader'
import { Footer } from '../../components/Footer'

export function JournalList() {
  const history = useHistory()
  const { user, logout } = useAuth()
  const [journals, setJournals] = useState<Journal[]>()

  useEffect(() => {
    http.get(`/journals/${user.id}`).then((response: any) => {
      if (!response) {
        toast.error('error fetching journals')
        logout()
        return null
      }

      setJournals(response.journals as Journal[])
    })
  }, [])

  function handleOnAddJournalButtonClick() {
    history.push('/new/journal')
  }

  return (
    <>
      <Header>
        {(journals?.length || 0) > 0 && (
          <Button outline onClick={handleOnAddJournalButtonClick}>
            <FaPlus /> Add Journal
          </Button>
        )}
      </Header>

      <main className={styles.container}>
        {journals === undefined ? (
          <Loader />
        ) : journals?.length !== 0 ? (
          <>
            <h1>Your Journals</h1>
            <ul className={styles.list}>
              {journals?.map(journal => (
                <Link to={`/my-journals/${journal.id}`} key={journal.id}>
                  <li>
                    <div />
                    <div>{journal.title}</div>
                  </li>
                </Link>
              ))}
            </ul>
          </>
        ) : (
          <div className={styles.emptyList}>
            <img src={meditateImg} alt="" />
            <Link to="/new/journal">Create a journal</Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
