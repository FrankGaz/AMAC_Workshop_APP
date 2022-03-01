import { useState } from 'react'

const useDeleteModal = (doDelete) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemValue, setItemValue] = useState(null)
  const action = item => {
    doDelete(item)
    setShowDeleteModal(false)
  }
  const openModal = (item) => {
    setItemValue(item)
    setShowDeleteModal(true)
  }
  const closeModal = () => {
    setShowDeleteModal(false)
  }
  return {
    itemValue,
    action,
    closeModal,
    openModal,
    showDeleteModal
  }
}

export default useDeleteModal
