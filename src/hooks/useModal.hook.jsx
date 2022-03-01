import { useState } from 'react'

const useModal = (doResult) => {
  const [showModal, setShowModal] = useState(false)
  const [value, setValue] = useState(null)
  const openModal = (value) => {
    setValue(value)
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
  }
  const searchSelection = item => {
    doResult(item)
  }
  return {
    value,
    showModal,
    openModal,
    closeModal,
    searchSelection
  }
}

export default useModal
