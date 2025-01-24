import apiConfig from '../../../config/apiConfig';
import { apiBaseURL, toastType } from '../../../constants';
import { addToast } from './../toastAction'
import { getFormattedMessage } from '../../../shared/sharedMethod';
import { setSavingButton } from "./../saveButtonAction";
import { fetchAllCustomer } from "../customerAction";

export const addCustomer = ( supplier, hide ) => async ( dispatch ) => {
    dispatch( setSavingButton( true ) )
    await apiConfig.post( apiBaseURL.CUSTOMERS, supplier )
        .then( ( response ) => {
            dispatch( fetchAllCustomer() )
            dispatch( addToast( { text: getFormattedMessage( 'customer.success.create.message' ) } ) );
            dispatch( setSavingButton( false ) )
            dispatch( hide( false ) )
        } )
        .catch( ( { response } ) => {
            dispatch( setSavingButton( false ) )
            dispatch( addToast(
                { text: response.data.message, type: toastType.ERROR } ) );
        } );
};
