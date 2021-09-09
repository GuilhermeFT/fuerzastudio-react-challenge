import { useEffect } from 'react'
import { Redirect, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import http from '../../services/api'

type NoteListParams = {
  journalId: string
}

export function NoteList() {
  const { user } = useAuth()
  const { journalId } = useParams<NoteListParams>()

  useEffect(() => {
    http.get(`/journals/entries/${journalId}`).then(response => {
      console.log(response)
    })
  }, [])

  return user.journalIds?.find(id => id === journalId) ? (
    <div>
      NoteList <br /> {journalId}
      <Link to="/my-journals">Journal</Link>
    </div>
  ) : (
    <Redirect to="/my-journals" />
  )
}
