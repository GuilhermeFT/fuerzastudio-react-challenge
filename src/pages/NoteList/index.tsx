import { useEffect } from 'react'
import { Redirect, useParams } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import http from '../../services/api'

type NoteListParams = {
  journalId: string
}

export function NoteList() {
  const { user } = useAuth()
  const { journalId } = useParams<NoteListParams>()

  useEffect(() => {
    http.get(`/journals/${journalId}`).then(response => {
      console.log(response, 'OPOA', journalId)
    })
  }, [])

  return user.journalIds?.find(id => id === journalId) ? (
    <div>
      NoteList <br /> {journalId}
    </div>
  ) : (
    <Redirect to="/my-journals" />
  )
}
