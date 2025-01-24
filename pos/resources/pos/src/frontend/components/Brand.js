import React, { useEffect, useState } from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/swiper.scss';
import { Nav, Button } from 'react-bootstrap-v5';
import { connect } from 'react-redux';
import { fetchAllBrands } from '../../store/action/brandsAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const swiperParams = {
    slidesPerView: 'auto',
    observer: true,
};

const Brands = ( props ) => {
    const { fetchAllBrands, brands, setBrand } = props;
    const [ productBrandName, setProductBrandName ] = useState( 0 );

    useEffect( () => {
        fetchAllBrands();
    }, [] );

    //filter brand function
    const onSelectBrand = ( brand ) => {
        setBrand( brand );
        setProductBrandName( brand );
    };

    let brandsItem = brands && brands.map( ( brand, index ) => {
        return (
            <Nav.Item className='button-list__item' key={index}>
                <Button variant='light'
                    className={`custom-btn-size w-100 ${productBrandName === brand.id ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => onSelectBrand( brand.id )}>
                    {brand.attributes.name}
                </Button>
            </Nav.Item>
        )
    } );

    return (
        <Nav className='button-list d-flex flex-nowrap'>
            <Nav.Item className='button-list__item me-2'>
                <Button variant='light'
                    className={`text-nowrap custom-btn-size ${productBrandName === 0 ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => onSelectBrand( 0 )}>
                    {getFormattedMessage( 'pos-all.brands.label' )}
                </Button>
            </Nav.Item>
            <Swiper {...swiperParams}>
                {brandsItem}
            </Swiper>
        </Nav>
    )
};

const mapStateToProps = ( state ) => {
    const { brands } = state;
    return { brands }
};

export default connect( mapStateToProps, { fetchAllBrands } )( Brands );
