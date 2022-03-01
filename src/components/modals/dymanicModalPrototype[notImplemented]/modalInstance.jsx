//modalInstance.jsx will create the React modal according to the template requested by ModalService.
import React from 'react'
import ModalStore from './modalStore'


export default class ModalInstance extends React.Component {
    constructor(props) {
      super(props);
      this.store = new ModalStore(props);
    }
  
    render() {
      const modalName = this.props.modalName;
      const Modal = window[`Modal${modalName}`];
      return <Modal {...this.store.params} />;
    }
  };
