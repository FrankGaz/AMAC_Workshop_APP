import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logic from '../../logic/logic';
import useIsValid from "../../hooks/useIsValid.hook";
import FieldInputSelect from '../../components/reusableComponents/fieldInputSelect';
import FieldInputDate from '../../components/reusableComponents/fieldInputDate'
import defaults from '../reusableComponents/defaults'
import _ from "lodash";

const ExportationsListSearchBox = ({ doRequestSearch }) => {
  // translation API from reactI18next 
  const { t } = useTranslation()

  // state values
  const [newServiceSearchData, setNewServiceSearchData] = useState({})

  // cwm
  useEffect(() => {
    logic.configureQueryParameters({})
  }, [])

  const handleSearchInputChange = (event, e) => {
    let value = null
    let name = null
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name
      value = event.target.value
    } else {
      name = e.target.name
      value = e.target.value
    }

    if (name !== '') {
      setNewServiceSearchData({
        ...newServiceSearchData,
        [name]: value
      })
    }

  }

  const handleFinished = e => {
    const {
      target: {
          name,
          value
      }
    } = e
    setNewServiceSearchData({
        ...newServiceSearchData,
        [name]: value && value.id
    })

  }

  const handleMethod = e => {
    const {
      target: {
          name,
          value
      }
    } = e
    setNewServiceSearchData({
        ...newServiceSearchData,
        [name]: value && value.id
    })
  }


  // Function that handles the search box
  const handleSearchClick = event => {
    doRequestSearch(newServiceSearchData)
  }

  const handleClearSearch = event => {
    logic.configureQueryParameters({})
    setNewServiceSearchData({})
    doRequestSearch(null)
  }

  const { handleIsValid } = useIsValid()


  return (
    <div >

      
        <div className="col-md-9 widget-search">
          <div className="widget-box collapsed">

            <div className="row widget-header" style={{ paddingTop: '10px' }}>
              <div className="col-md-3 no-padding-left">
                <FieldInputSelect
                  name="finished"
                  initialInput={(newServiceSearchData && newServiceSearchData.finished) || ''}
                  columnWidth={12}
                  withLabel={false}
                  items={defaults.trueFalseList}
                  doChange={handleFinished}
                />
              </div>
              <div className="col-md-3 no-padding-left">
                <FieldInputSelect
                  name="name_of_method"
                  initialInput={(newServiceSearchData && newServiceSearchData.name_of_method) || ''}
                  columnWidth={12}
                  items={defaults.jobMethod}
                  withLabel={false}
                  doChange={handleMethod}
                />
              </div>
              <div className="col-md-2 no-padding-right no-padding-left">
                <button
                  onClick={(e) => handleSearchClick(e)}
                  className="btn btn-purple btn-sm block full"
                  alt={t('search')} title={t('search')}>
                  <i className="fa fa-search"></i>
                </button>
              </div>
              <div className="col-md-2 no-padding-right no-padding-left mgn-left15">
                <button
                  onClick={(e) => handleClearSearch(e)}
                  className="btn btn-default btn-sm block full"
                  alt={t('clear_search')}
                  title={t('clear_search')}>
                  <i className="fa fa-eraser"></i>
                </button>
              </div>
            </div>

            {/* add widget-body CSS class to be able to see the animation */}
            <div className='widget-body'>
              <div className="row">
                <div className="col-gray-bg">
                  <div className='col-md-6 widget-search widget-container-col ui-sortable'>
                    <FieldInputDate
                      input={(newServiceSearchData && newServiceSearchData.from) || ''}
                      name={'from'}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={12}
                      doInputCheck={handleSearchInputChange}
                      withLabel={false} />
                  </div>
                  <div className='col-md-6 widget-search widget-container-col ui-sortable'>
                    <FieldInputDate
                      input={(newServiceSearchData && newServiceSearchData.to) || ''}
                      name={'to'}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={12}
                      doInputCheck={e => handleSearchInputChange(undefined, e)}
                      withLabel={false}
                    />
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>



            </div >
          </div >
        </div >
     
    </div >
  )
}

export default ExportationsListSearchBox;