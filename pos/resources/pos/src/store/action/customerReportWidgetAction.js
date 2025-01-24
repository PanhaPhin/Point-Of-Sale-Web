import apiConfig from "../../config/apiConfigWthFormData";
import { apiBaseURL, customerReportActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";

export const fetchCustomerReportWidget = ( id ) => async ( dispatch ) => {
    apiConfig.get( apiBaseURL.CUSTOMER_REPORT_WIDGET_DATA + '/' + id )
        .then( ( response ) => {
            dispatch( { type: customerReportActionType.FETCH_CUSTOMER_WIDGET_DATA, payload: response.data.data } );
        } )
        .catch( ( { response } ) => {
            dispatch( addToast(
                { text: response.data.message, type: toastType.ERROR } ) );
        } );
};
