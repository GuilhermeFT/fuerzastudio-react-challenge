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
  const { user, logout } = useAuth() // Hook de autenticação

  const { journalId, noteId } = useParams<NoteContentParams>() // Coleta os parametros da rota da aplicação

  const [journal, setJournal] = useState<Journal>()
  const [entry, setEntry] = useState<Entry | null>()

  // Responsável por buscar os dados do journal
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

  // Responsável por buscar as entries dentro da Journal requisitada acima
  // So executa se journal o journal no ID especificado existir
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

  // Função do botão de Edição da Entry renderizada em tela
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
        {/* Enquanto journal ou entry estiverem indefinidas, exibiremos o Loader */}
        {journal === undefined || entry === undefined ? (
          <Loader />
        ) : journal && entry ? (
          // Caso tenha o journal e a entry existente, exibimos o conteúdo da entry em tela
          <div className={styles.content}>
            <h1>{entry.title}</h1>

            <p>{entry.content}</p>
          </div>
        ) : (
          // Caso contrário, voltamos o usuário para lista de Journal
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
