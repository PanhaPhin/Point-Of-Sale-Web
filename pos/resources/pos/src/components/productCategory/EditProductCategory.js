import React from 'react';
import {connect} from 'react-redux';
import ProductCategoryFrom from './ProductCategoryForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const EditProductCategory = (props) => {
    const {handleClose, show, productCategory} = props;

    return (
        <>
            {productCategory &&
            <ProductCategoryFrom handleClose={handleClose} show={show} singleProductCategory={productCategory}
                                 title={getFormattedMessage('product-category.edit.title')}/>
            }
        </>
    )
};

export default connect(null)(EditProductCategory);

