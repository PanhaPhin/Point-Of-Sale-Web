import React, {useEffect, useState} from 'react';
import Swiper from 'react-id-swiper';
import {Nav, Button} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {fetchAllProductCategories} from '../../store/action/productCategoryAction';
import {fetchBrandClickable} from '../../store/action/pos/posAllProductAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const swiperParams = {
    slidesPerView: 'auto',
    observer: true,
};

const Category = (props) => {
    const {fetchAllProductCategories, productCategories, fetchBrandClickable, brandId, setCategory, selectedOption} = props;
    const [productCategoryName, setProductCategoryName] = useState(0);
    const [proId, setProId] = useState(0);

    useEffect(() => {
        fetchAllProductCategories();
    }, []);

    useEffect(() => {
        if(selectedOption) {
            fetchBrandClickable(brandId, proId, selectedOption.value && selectedOption.value);
        }
    }, [selectedOption]);

    //filter category function
    const onSelectCategory = (productCategory) => {
        setCategory(productCategory);
        setProductCategoryName(productCategory);
    };

    const categoryItem = productCategories && productCategories.map((productCategory, index) => {
        return (
            <Nav.Item key={index} className='button-list__item'>
                <Button variant='light'
                    className={`custom-btn-size w-100 ${productCategoryName === productCategory.id ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => {
                        onSelectCategory(productCategory.id)
                        setProId(productCategory.id)
                    }}>
                    {productCategory.attributes.name}
                </Button>
            </Nav.Item>
        )
    });

    return (
        <Nav className='button-list mb-2 d-flex flex-nowrap'>
            <Nav.Item className='button-list__item me-2'>
                <Button variant='light'
                    className={`custom-btn-size ${productCategoryName === 0 ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => onSelectCategory(0)}>
                    {getFormattedMessage('pos-all.categories.label')}
                </Button>
            </Nav.Item>
            <Swiper {...swiperParams}>
                {categoryItem}
            </Swiper>
        </Nav>
    )
};
const mapStateToProps = (state) => {
    const {productCategories} = state;
    return {productCategories}
};

export default connect(mapStateToProps, {fetchAllProductCategories, fetchBrandClickable})(Category);
