

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ModalInput from '../../reusableComponents/modalInput'
import ModalInputNumber from '../../reusableComponents/modalInputNumber'
import CloseButton from '../../reusableComponents/CloseButton'
import ModalInputTextArea from '../../reusableComponents/modalInputTextArea'
import _  from 'lodash'


export const PHONE_KIND_FIELDS = [
	{
		"id": 8,
		"name": "Principal de la empresa"
	},
	{
		"id": 3,
		"name": "Fijo Personal"
	},
	{
		"id": 5,
		"name": "Skype"
	},
	{
		"id": 7,
		"name": "Fijo Empresa"
	},
	{
		"id": 10,
		"name": "Ext. Fijo Empresa"
	},
	{
		"id": 9,
		"name": "Ext. Movil Empresa"
	},
	{
		"id": 6,
		"name": "Movil Empresa"
	},
	{
		"id": 4,
		"name": "Fax"
	},
	{
		"id": 1,
		"name": "Movil Personal"
	}
]

const UnityPhoneNumbersModal = ({ initialValues, closeModal, showModal, phoneNumberValue, action, errorMessage }) => {
	// translation API from reactI18next 
	const { t } = useTranslation()

	// Flag that controls whether the modal is shown.
	const showHideClassName = showModal ? "rc-modal display-block modal-open modal in" :
		"modal fade in display-none"
	// Constant that is used to declare the class that hides error icons in the input
	const collapseElementClass = 'collapse'


	// sets loading icon
	const [loading, setLoading] = useState(false)

	// state that controls required input error icon 
	const [showRequiredError, setShowRequiredError] = useState(collapseElementClass)
	// state that controls max length error icon
	const [showMaxLengthError, setShowMaxLengthError] = useState(collapseElementClass)
	// state that regulates whether the input has already been used.
	const [showAlreadyUsedError, setShowAlreadyUsedError] = useState(collapseElementClass)

	// Component state
	// Inicident selected for adding or updating
	const initial = {}
	const [newPhoneNumber, setNewPhoneNumber] = useState({})

	useEffect(() => {
		// set initial values for data
		for (const item of initialValues) {
			initial[item] = ""
		}
		setLoading(false)
		if (errorMessage === "ya ha sido usado") {
			return setShowAlreadyUsedError("")
		}
		setShowAlreadyUsedError(collapseElementClass)
		setNewPhoneNumber({ ...initial, ...phoneNumberValue })
		activateActionButton()

		// Adds event listener OnMount that closes the modal on Esc key press
		document.addEventListener('keydown', handleEscapePress)
		// On UnMount it removes the event listener
		return () => {
			document.removeEventListener('keydown', handleEscapePress)
		}
	}, [phoneNumberValue, errorMessage, showModal])

	// Closes the modal on Esc key press
	const handleEscapePress = e => {
		if (e.keyCode === 27) {
			return handleCloseModal()
		}
	}

	const handlePhoneNumberInputChange = ({ name, input }) => {
		/*
			Start Verification of the input to see which error icon is shown if necessary 
		*/
		// if (!input.length) {
		// 	setShowRequiredError("")
		// }
		// if (input.length && input.length < 75) {
		// 	setShowRequiredError(collapseElementClass)
		// 	setShowMaxLengthError(collapseElementClass)
		// }
		// if (input.length >= 76) {
		// 	setShowMaxLengthError('')
		// }
		//------End of verification------//

		/*
		Handles the state change
		*/
		setNewPhoneNumber({
			...newPhoneNumber,
			[name]: input
		})
	}
	/*
		Handles modal save/update actions
	*/
	const handleSave = () => {
		setLoading(true)
		if (!showMaxLengthError || !showRequiredError) {
			setLoading(false)
			return
		}
		action(newPhoneNumber)
		setShowAlreadyUsedError(collapseElementClass)
	}

	// Because the modal is shown or hidden using CSS, we set the values to default when closed
	const handleCloseModal = () => {
		setShowRequiredError(collapseElementClass)
		setShowMaxLengthError(collapseElementClass)
		setShowAlreadyUsedError(collapseElementClass)
		setLoading(false)
		return closeModal()
	}

	const activateActionButton = () => {
		let valid = true
		if (!newPhoneNumber || _.isEmpty(newPhoneNumber)) return false
		if (!newPhoneNumber.number) return false

		return valid
	}

	const handleSelectInputChange = (phoneKindId) => {
		setNewPhoneNumber({
			...newPhoneNumber,
			phone_kind_id: phoneKindId
		})
	}

	return <div id="fillModal" className={showHideClassName} draggable-modal="true">
		<div className="modal-dialog">
			<div className="modal-content">

				<div className="modal-header">
					<CloseButton closeModal={handleCloseModal} />
					<h3 className="smaller lighter blue no-margin">
						<span>
							{phoneNumberValue && phoneNumberValue.id ?
								t('update') + ' ' + t('frecuency') :
								t('add') + ' ' + t('frecuency')}
						</span>
					</h3>
				</div>

				{/* Handles the inputs of the modal.*/}
				<div className="modal-body">
					<div>
						<div className="row">
							<ModalInputNumber
								input={phoneNumberValue && phoneNumberValue.country_code}
								name="country_code"
								maxLength={76}
								isRequired={false}
								inputChange={handlePhoneNumberInputChange}
								isAlreadyUsedError={showAlreadyUsedError}
								columnSize={6}
							/>
							<ModalInput
								input={phoneNumberValue && phoneNumberValue.number}
								name="number"
								maxLength={76}
								isRequired={false}
								doInputChange={handlePhoneNumberInputChange}
								isAlreadyUsedError={collapseElementClass}
								columnSize={6}
							/>
						</div>

						<div className="row">
							<OptionSelect
								initialValue={phoneNumberValue && phoneNumberValue.phone_kind && phoneNumberValue.phone_kind.id}
								options={PHONE_KIND_FIELDS}
								selectedOption={handleSelectInputChange}
								optionTypeName="phone_kinds"
							></OptionSelect>

							<ModalInputTextArea
								input={phoneNumberValue && phoneNumberValue.observations}
								name="observations"
								maxLength={200}
								isRequired={false}
								doInputChange={handlePhoneNumberInputChange}
								columnSize={8}
								doInputCheck={()=>{}}
							/>
							{/* 	<div className="col-md-8 form-group has-feedback animate-input" ng-className="{'has-error': inputError(forms.fillPhonesModalForm.phone_observations, fillPhonesModalData.item.observations, fillPhonesModalData.errors.observations), 'has-success': inputSuccess(forms.fillPhonesModalForm.phone_observations, fillPhonesModalData.item.observations, fillPhonesModalData.errors.observations)}">
								<label ng-show="!isUndNull(fillPhonesModalData.item.observations)" className="control-label show-hide" for="phone_observations"> 'observations' | translate </label>
								<span className="block input-icon input-icon-right">
									<textarea name="phone_observations" id="phone_observations" className="form-control" placeholder="{{'observations' | translate}}" ng-model="fillPhonesModalData.item.observations" ng-change="fillPhonesModalData.errors.observations = undefined" rows="4"></textarea>
									<input-error-icons input="forms.fillPhonesModalForm.phone_observations" model="fillPhonesModalData.item.observations" errors="fillPhonesModalData.errors.observations"></input-error-icons>
								</span>
								<input-api-errors errors="fillPhonesModalData.errors.observations"></input-api-errors>
							</div> */}
						</div>
					</div>
				</div>
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
				{phoneNumberValue && phoneNumberValue.id ? (
					<button
						onClick={handleSave}
						disabled={loading}
						type="button"
						className={activateActionButton() ? "btn btn-sm btn-primary" : "btn btn-sm btn-success disabled"}>
						<i className={loading ? 'ace-icon fa fa-spinner fa-spin' : 'ace-icon fa fa-check'}></i>
						{t('update')}
					</button>
				) : (
						<button onClick={handleSave}
							type="button"
							className={activateActionButton() ? "btn btn-sm btn-success" : "btn btn-sm btn-primary disabled"}
							disabled={loading}>
							<i className={loading ? 'ace-icon fa fa-spinner fa-spin' : 'ace-icon fa fa-plus'}></i>
							{t('add_new')}
						</button>
					)}
			</div>

		</div>
	</div>

}


const OptionSelect = ({ options, selectedOption, optionTypeName, initialValue }) => {
	// translation API from reactI18next 
	const { t } = useTranslation()

	const handleOptionSelectChange = event => {

		const option = event.target.value
		selectedOption(option)
	}

	return (
		<div className="col-md-4 form-group has-feedback animate-input" >
			<label className="control-label show-hide" htmlFor={optionTypeName}>{t(optionTypeName)}</label>
			<span className="block input-icon input-icon-right">
				<select onChange={handleOptionSelectChange} name={optionTypeName} id={optionTypeName} className="form-control">
					<option >{t('choose')} </option>
					{options ? options.map((option, index) => {
						return <option defaultValue={option.id === initialValue} key={index} value={option.id}> {t(option && option.name)} </option>
					}) : null}
				</select>

			</span>

		</div>
	)
}

export default UnityPhoneNumbersModal
