 import React from 'react';
import {Link} from 'react-router-dom';
import {getFormattedMessage} from '../../shared/sharedMethod';

const HeaderTitle = (props) => {
    const {title, to, editLink} = props;
    return (
    <div className='d-md-flex align-items-center justify-content-between mb-5'>
        {title ? <h1 className='mb-0'>{title}</h1> : ''}
        <div className='text-end mt-4 mt-md-0'>
            {editLink ? <Link to={editLink}
                              className='btn btn-outline-primary me-2'>{getFormattedMessage('globally.edit-btn')}</Link> : null}
            {to ? <Link to={to}
                        className='btn btn-outline-primary'>{getFormattedMessage('globally.back-btn')}</Link> : null}
        </div>
    </div>
    )
};

export default HeaderTitle;
