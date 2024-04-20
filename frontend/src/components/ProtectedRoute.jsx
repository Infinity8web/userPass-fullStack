import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null)

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false))
  }, [])

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN)
    try {
      const response = await api.post('/api/token/refresh/', {
        refresh: refreshToken,
      })
      if (response.status === 200) {
        const { access } = response.data
        localStorage.setItem(ACCESS_TOKEN, access)
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
    } catch (error) {
      console.log(error)
      setIsAuthorized(false)
    }
  }

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (!token) {
      setIsAuthorized(false)
      return
    }
    const decoded = jwtDecode(token)
    const tokenExpiration = decoded.exp
    const now = Date.now() / 1000

    if (tokenExpiration < now) {
      await refreshToken()
    } else {
      setIsAuthorized(true)
    }
  }

  if (isAuthorized === null) {
    return <div>loading...</div>
  }

  return isAuthorized ? children : <Navigate to='/login' />
}
export default ProtectedRoute