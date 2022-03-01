import React from 'react'

const TableContentBox = ({name}) => (
    <th title='' className='header sortable sort-asc'>
        <div className=' ng-scope' >
            <span className='ng-binding sort-indicator'>{name}</span>
        </div>
    </th>
)

export default TableContentBox

