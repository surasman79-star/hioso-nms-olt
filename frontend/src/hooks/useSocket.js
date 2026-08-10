import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuthStore } from '../store/authStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const { token } = useAuthStore()

  useEffect(() => {
    if (!token) return

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    newSocket.on('connect', () => {
      console.log('Socket connected')
    })

    setSocket(newSocket)
    return () => { newSocket.close() }
  }, [token])

  return socket
}