import React from "react";
import ExportationsListSearchBox from './exportations_list_header_box.cmp';
import ReloadItems from '../reusableComponents/reloadItems'

const ExportationsListHeader = ({ doRequestSearch, doAddNew, doReload, doExport }) => {

  return (
    <div className="row">
      <ReloadItems doReload={doReload} />
      <ExportationsListSearchBox
        doRequestSearch={doRequestSearch} />
      <div className='col-md-2'>
        {/* <ExportButton doExport={() => doExport({})} />
        <AddButton label={"add_service"} doAddNew={() => doAddNew({})} /> */}
      </div>
    </div>
  )
}

export default ExportationsListHeader;