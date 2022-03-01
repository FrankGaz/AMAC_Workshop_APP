import { useState } from 'react'

const useConfirmActionMessage = () => {
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('success')
  const sayMessage = (type, message) => {
    setMessage(message)
    setType(type)
    setShowMessage(true)
  }
  const closeMessage = () => {
    setShowMessage(false)
  }
  return {
    message,
    type,
    sayMessage,
    showMessage,
    closeMessage
  }
}

export default useConfirmActionMessage
