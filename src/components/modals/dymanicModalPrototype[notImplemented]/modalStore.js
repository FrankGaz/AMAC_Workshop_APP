//modalStore.js will be in charge of all general modal logic, currently including only hiding the modal and removing from the DOM.
export default class ModalStore {
    showModal = true;
    params = {};

    constructor(props) {
        props.params.showModal = this.showModal;
        props.params.onHide = this.handleClose.bind(this);
        this.params = props.params;
    }

    /*
    * Handle modal closing
    *
    * @param    callback    callback function on closing event
    */
    handleClose = callback => {
        this.params.showModal = false;
        if (callback) callback();
    }
}
