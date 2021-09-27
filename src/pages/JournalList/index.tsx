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

export function JournalList() {
  const history = useHistory()

  const { user, logout } = useAuth() // Hook de autenticação

  const [journals, setJournals] = useState<Journal[]>()

  // Buscamos os journals do usuário para exibir em tela
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

  // Função do botão de Adição de Journal no Header da aplicação que só é exibido quando há pelo menos 1 journal listado
  function handleOnAddJournalButtonClick() {
    history.push('/new/journal')
  }

  return (
    <>
      <Header>
        {/* Verifica se há pelo menos 1 journal para rendereizar o botão de Adição de Journal no Header */}
        {(journals?.length || 0) > 0 && (
          <Button outline onClick={handleOnAddJournalButtonClick}>
            <FaPlus /> Add Journal
          </Button>
        )}
      </Header>

      <main className={styles.container}>
        {/* Exibe um Loader enquanto os dados do journal é buscado */}
        {journals === undefined ? (
          <Loader />
        ) : journals?.length !== 0 ? (
          // Caso tenha algum dado, renderizamos a listagem de Journals em tela
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
          // Caso não tenha dados, renderizamos um convite a criar um journal para o usuário
          <div className={styles.emptyList}>
            <img src={meditateImg} alt="" />
            <Link to="/new/journal">Create a journal</Link>
          </div>
        )}
      </main>
    </>
  )
}
