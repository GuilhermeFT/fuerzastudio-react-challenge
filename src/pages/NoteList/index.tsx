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

  const { user, logout } = useAuth() // Hook de autenticação

  const { journalId } = useParams<NoteListParams>() // Coleta os parametros da Rota da aplicação

  const [journal, setJournal] = useState<Journal>()
  const [entries, setEntries] = useState<Entry[]>()

  // Coleta os dados da Journal do ID passado por parametro na rota
  useEffect(() => {
    http.get(`/journals/${user.id}`).then((response: any) => {
      if (!response) {
        toast.error('error fetching journals')
        logout()
        return null
      }

      /* Caso exista, selecionamos o journal com o ID igual ao que está sendo passado pela Rota da aplicação colatada pelo useParams */
      setJournal(
        response.journals.filter(
          (journal: Journal) => journal.id === journalId
        )[0] || null
      )
    })
  }, [])

  // Coleta as entries existentes no journal requisitado
  useEffect(() => {
    http.get(`/journals/entries/${journalId}`).then((response: any) => {
      if (!response) {
        toast.error('error fetching entries')
        return null
      }

      setEntries(response.entries as Entry[])
    })
  }, [])

  // Responsável pelo botão de edição no rodapé da aplicação
  function handleOnClickEditJournalButton() {
    history.push(`/new/journal/${journalId}?updateId=${journalId}`)
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        {/* Exibe um Loader enquanto os dados do journal é buscado */}
        {journal === undefined ? (
          <Loader />
        ) : journal !== null ? (
          entries?.length !== 0 ? (
            // Caso exista o journal e tenha entries cadastrados nele, exibimos a lista de Entries
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
                    <li>
                      <div>{entry.title}</div>
                    </li>
                  </Link>
                ))}
              </ul>
            </>
          ) : (
            // Se não tiver alguma entry, exibimos o convite a criar um Novo
            <div className={styles.emptyList}>
              <img src={meditateImg} alt="" />
              <Link to={`/new/note/${journalId}`}>Create a note</Link>
            </div>
          )
        ) : (
          // Se o journal não existir, voltamos o usuário para a listagem de Journal
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
