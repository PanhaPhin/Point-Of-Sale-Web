import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSort} from '@fortawesome/free-solid-svg-icons';

const setOrder = (filedName, sortObject) => {
    if (sortObject.orderBy === filedName) {
        if (sortObject.order === 'asc') {
            return {order: 'asc'}
        } else if (sortObject.order === 'desc') {
            return {order: 'desc'}
        }
        return {order: 'none'}
    }
    return {order: 'none'};
};

const renderSortIcon = () => {
    return (
        <span className='sort-arrow-group'>
              <FontAwesomeIcon icon={faSort}/>
        </span>
    );
};

export const sortConfig = (filedName, sortObject) => {
    const result = setOrder(filedName, sortObject);
    switch (result.order) {
        case 'asc':
            return renderSortIcon('asc');
        case 'desc':
            return renderSortIcon('desc');
        default:
            return renderSortIcon('none');
    }
};

export const renderSortIcons = renderSortIcon;
