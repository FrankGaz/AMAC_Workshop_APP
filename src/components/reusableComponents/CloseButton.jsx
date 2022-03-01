import React from 'react'

const CloseButton = ({ closeModal }) => {
    const closeModalClick = event => {
        event.preventDefault()
        closeModal()
    }
    return (
        <a type="button"
            href="#/"
            onClick={(e) => closeModalClick(e)}
            className="close btn-close-modal"
            data-dismiss="modal" aria-hidden="true"
        >&times;</a>
    )
}
export default CloseButton  