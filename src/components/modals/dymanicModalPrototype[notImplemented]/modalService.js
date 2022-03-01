//modalService.js will render the modal to the DOM using renderModal function which will get the actual modal from ModalInstance.
import React from 'react'
import ReactDOM from 'react-dom'
import ModalInstance from './modalInstance'

export default class ModalService {
    renderModal(modalName, params) {
      ReactDOM.render(<ModalInstance modalName={modalName} params={params} />
      , document.createElement('span'));
    }
  }