import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CloseButton from '../reusableComponents/CloseButton'

const ConfirmDeleteModal = ({ closeModal, showDeleteModal, itemValue, action }) => {
	// translation API from reactI18next 
	const { t } = useTranslation()

	// Flag that controls whether the modal is shown.
	const showHideClassName = showDeleteModal ? "rc-modal display-block modal-open modal in" : "modal fade in display-none";
	// Inicident selected for adding or updating
	const [item, setItem] = useState({})

	//ComponentShouldUpdate
	useEffect(() => {
		setItem(itemValue)
		document.addEventListener('keydown', handleEscapePress)
		return () => {
			document.removeEventListener('keydown', handleEscapePress)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemValue])

	const handleEscapePress = e => {
		if (e.keyCode === 27) {
			closeModal()
		}
	}

	return <div id="deleteModal" data-test-id="confirmDeleteModal" className={showHideClassName} draggable-modal="true">
		<div className="modal-dialog">
			<div className="modal-content">
				<div className="modal-header">
					<CloseButton closeModal={closeModal} />
					<span className="sr-only">{t('close')}</span> {/*</a>*/}
					<h3 className="smaller lighter blue no-margin">
						{t('delete')}
          <span> {item && item.name}</span>
					</h3>
				</div>

				<div className="modal-body">
					<div className="errors">
						<br />
					</div>
					<p className="delete-msg-modal">{t('delete_msg')} <strong data-test-id="confirmDeleteItem"> {item && item.name}</strong>?</p> <p>{t('delete_informative_msg')}</p>
				</div>

				<div className="modal-footer">
					<button
						type="button"
						onClick={closeModal}
						className="btn btn-sm btn-default"
						data-dismiss="modal">
						<i className="ace-icon fa fa-times"></i>{t('close')}
					</button>
					<button
						data-test-id="confirmDeleteButton"
						type="button"
						onClick={() => action(item)}
						className="btn btn-sm btn-danger">
						<i className="ace-icon fa fa-check"></i>{t('delete')}
					</button>
				</div>

			</div>
		</div>
	</div>
}

export default ConfirmDeleteModal
