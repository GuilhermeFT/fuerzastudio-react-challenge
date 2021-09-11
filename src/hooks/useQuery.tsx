import { useLocation } from 'react-router'

// Um hook que retorna parametros da URL em formato de queryString
export function useQuery() {
  return new URLSearchParams(useLocation().search)
}
