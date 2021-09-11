import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

// um Hook que returna o useContext referentes a autenticação
export function useAuth() {
  return useContext(AuthContext)
}
