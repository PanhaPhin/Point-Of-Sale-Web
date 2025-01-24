import React from 'react';
import {connect} from 'react-redux';
import {fetchBrand} from '../../store/action/brandsAction';
import BrandsFrom from './BrandsFrom';
import {getFormattedMessage} from '../../shared/sharedMethod';

const EditBrands = (props) => {
    const {handleClose, show, brand} = props;

    return (
        <>
            {brand && <BrandsFrom handleClose={handleClose} show={show} singleBrand={brand}
                                  title={getFormattedMessage('brand.edit.title')}/>}
        </>
    )
};

export default connect(null, {fetchBrand})(EditBrands);

