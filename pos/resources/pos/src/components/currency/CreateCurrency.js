import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap-v5';
import {Filters} from '../../constants';
import {addCurrency} from '../../store/action/currencyAction';
import CurrencyForm from './CurrencyForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreateCurrency = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const {addCurrency} = props;

    const addCurrencyData = (formValue) => {
        addCurrency(formValue, Filters.OBJ);
    };

    return (
        <div className='text-end w-sm-auto w-100'>
            <Button variant='primary mb-lg-0 mb-md-0 mb-4' onClick={handleClose}>
                {getFormattedMessage('currency.create.title')}
            </Button>
            <CurrencyForm addCurrencyData={addCurrencyData} handleClose={handleClose} show={show}
                          title={getFormattedMessage('currency.create.title')}/>
        </div>
    )
};

export default connect(null, {addCurrency})(CreateCurrency);
