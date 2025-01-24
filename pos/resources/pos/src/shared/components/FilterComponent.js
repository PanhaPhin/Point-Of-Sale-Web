import React, {useState} from 'react';
import {placeholderText} from '../sharedMethod';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const FilterComponent = (props) => {
    const {handleSearch} = props;
    const [typingTimeout, setTypingTimeout] = useState(0);

    const sendToParent = (searchText) => {
        handleSearch(searchText);
    };

    const onChangeName = (event) => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(setTimeout(() => sendToParent(event.target.value), 500));
    };
    // justify-content-md-end
    return (
        <div className='d-flex position-relative col-12 col-xxl-4 col-md-3 col-lg-4 mb-lg-0 mb-md-0 mb-3 searchBox'>
            <div className='position-relative d-flex width-320'>
                <input className='form-control ps-8' type='search' id='search'
                       placeholder={placeholderText('react-data-table.searchbar.placeholder')} aria-label='Search'
                       onChange={(e) => onChangeName(e)}/>
                <span
                    className='position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3'>
               <FontAwesomeIcon icon={faSearch}/>
            </span>
            </div>
        </div>
    )
};

export default FilterComponent;
