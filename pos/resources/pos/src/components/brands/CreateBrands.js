import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import {Button} from 'react-bootstrap-v5';
import {addBrand} from '../../store/action/brandsAction';
import BrandsFrom from './BrandsFrom';
import {Filters} from '../../constants';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreateBrands = () => {
    const Dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    const addBrandData = (formValue) => {
        Dispatch(addBrand(formValue, Filters.OBJ));
    };

    return (
        <div className='text-end w-sm-auto w-100'>
            <Button variant='primary mb-lg-0 mb-md-0 mb-4' onClick={handleClose}>
                {getFormattedMessage('brand.create.title')}
            </Button>
            <BrandsFrom addBrandData={addBrandData} handleClose={handleClose} show={show}
                        title={getFormattedMessage('brand.create.title')}/>
        </div>

    )
};

export default CreateBrands;
