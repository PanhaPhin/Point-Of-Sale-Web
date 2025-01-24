import React from 'react';
import CurrencyForm from './CurrencyForm';
import { getFormattedMessage } from '../../shared/sharedMethod';

const EditCurrency = ( props ) => {
    const { handleClose, show, currency } = props;

    return (
        currency ?
            <CurrencyForm handleClose={handleClose} show={show} singleCurrency={currency}
                title={getFormattedMessage( 'currency.edit.title' )} />
            : null
    )
};

export default EditCurrency;

