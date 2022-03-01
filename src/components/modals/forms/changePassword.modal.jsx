import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CloseButton from '../../reusableComponents/CloseButton'
import FieldInputPassword from '../../reusableComponents/fieldInputPassword'
import useIsValid from '../../../hooks/useIsValid.hook'
import logic from '../../../logic/logic'
import ErrorMessage from '../../reusableComponents/errormessage'

const ChangePasswordModal = ({ closeModal, showModal, networkValue, action, errorMessage, hidePassword }) => {
    // translation hook from reactI18next 
    const { t } = useTranslation()


    // Flag that controls whether the modal is shown.
    const showHideClassName = showModal ? "rc-modal display-block modal-open modal" : "modal fade in display-none";
    // Constant that is used to declare the class that hides error icons in the input
    const collapseElementClass = 'collapse'
    const showElementClass = ''

    // Component state

    // Cosntant to stablish "off" autocomplete field
    const autocompleteField = 'off'

    // Inicident selected for adding or updati
    const [newPassword, setNewPassword] = useState({})
    // sets loading icon
    const [loading, setLoading] = useState(false)
    // state that controls required input error icon
    const [showNewPasswordsNotMatchingError, setShowNewPasswordsNotMatchingError] = useState(collapseElementClass)
    const [showCapsLockWarning, setShowCapsLockWarning] = useState(collapseElementClass)
    const [errorMessageState, setErrorMessageState] = useState('')
    useEffect(() => {
        setLoading(false)
        // Adds event listener OnMount that closes the modal on Esc key press
        document.addEventListener('keydown', handleEscapePress)

        // On UnMount it removes the event listener
        return () => {
            document.removeEventListener('keydown', handleEscapePress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [networkValue, errorMessage, showModal])

    // Closes the modal on Esc key press
    const handleEscapePress = e => {
        if (e.keyCode === 27) {
            handleCloseModal()
        }
    }

    // Handles the input change on the passwords
    const handleUnitInputChange = (value, event) => {
        const inputValue = value
        const name = event.target.name
        setNewPassword(prevState => {
            return {
                ...prevState,
                [name]: inputValue
            }
        })
    }
	/*
		Handles modal save/update actions
	*/
    const handleSave = () => {
        setShowNewPasswordsNotMatchingError(collapseElementClass)
        setLoading(true)
        if (newPassword.newPassword !== newPassword.checkNewPassword) {
            setShowNewPasswordsNotMatchingError(showElementClass)
            return setLoading(false)
        }
        if (!activateActionButton()) {
            return setLoading(false)
        }
        setErrorMessageState('')
        handleUpdatePasswordClick(newPassword)

    }

    // Because the modal is shown or hidden using CSS, we set the values to default when closed
    const handleCloseModal = () => {
        setShowNewPasswordsNotMatchingError(collapseElementClass)
        setLoading(false)
        return closeModal()
    }

    const { handleIsValid, activateActionButton } = useIsValid()

    const handleKeyPress = event => {
        const capsLockCheck = event.getModifierState('CapsLock')
        if(capsLockCheck){
            setShowCapsLockWarning(showElementClass)
        }else {
            setShowCapsLockWarning(collapseElementClass)
        }

    }

    const handleUpdatePasswordClick = value => {
        logic.updatePassword(value).then(res=> {
            if(res.status === 'error'){
                setErrorMessageState(res.errorMessage)
                setLoading(false)
                action({
                    status: 'error'})
            }else {
                closeModal()
                action('success')
            }
        })
    }


    return (
        <div data-test-id="addEditNetworkModal" id="fillModal" className={showHideClassName} draggable-modal="true">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <CloseButton closeModal={handleCloseModal} />
                        <h3 className="smaller lighter blue no-margin">
                            <span data-test-id="addEditNetworkTitle">
                                {t('capitalize', { text: t('change_password_action') })}
                            </span>

                        </h3>
                    </div>

                    <div className="modal-body">
                        <form name="forms.fillModalForm" noValidate>
                            <div className="row">
                                <FieldInputPassword
                                    input={''}
                                    name={'currentPassword'}
                                    maxLength={76}
                                    isRequired={true}
                                    isValid={handleIsValid}
                                    columnSize={4}
                                    hasActivator={false}
                                    activator={false}
                                    doModalClick={null}
                                    doInputCheck={handleUnitInputChange}
                                    keyPress={handleKeyPress}
                                    autoComplete={'new-password'}
                                />
                                <FieldInputPassword
                                    input={''}
                                    name={'newPassword'}
                                    maxLength={76}
                                    isRequired={true}
                                    isValid={handleIsValid}
                                    columnSize={4}
                                    hasActivator={false}
                                    activator={false}
                                    doModalClick={null}
                                    doInputCheck={handleUnitInputChange}
                                    keyPress={handleKeyPress}
                                />
                                <FieldInputPassword
                                    input={''}
                                    name={'checkNewPassword'}
                                    maxLength={76}
                                    isRequired={true}
                                    isValid={handleIsValid}
                                    columnSize={4}
                                    hasActivator={false}
                                    activator={false}
                                    doModalClick={null}
                                    doInputCheck={handleUnitInputChange}
                                    keyPress={handleKeyPress}
                                />
                            </div>
                        </form>
                        <p className={`help-block form-error ${showNewPasswordsNotMatchingError}`} ><i className="fas fa-exclamation-triangle"></i> {t('field_invalid_pass_repeat')}</p>
                        <p className={`help-block form-error ${showCapsLockWarning}`}><i className="fas fa-exclamation-triangle"></i> {t('capsLocked')}</p>
                        <ErrorMessage message={errorMessageState}/>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="btn btn-sm btn-default"
                            data-dismiss="modal">
                            <i className="ace-icon fa fa-times"></i>
                            {t('close')}
                        </button>
                        <button
                            data-test-id="addEditNetworkButton"
                            onClick={handleSave}
                            type="button"
                            className={activateActionButton() ? "btn btn-sm btn-success" : "btn btn-sm btn-success disabled"}
                            disabled={loading}>
                            <i className={loading ? 'ace-icon fa fa-spinner fa-spin' : 'ace-icon fa fa-plus'}></i>
                            {t('update_password_action')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordModal