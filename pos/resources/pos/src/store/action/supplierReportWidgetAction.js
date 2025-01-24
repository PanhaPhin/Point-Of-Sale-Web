import apiConfig from "../../config/apiConfigWthFormData";
import { apiBaseURL, supplierReportActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";

export const fetchSupplierReportWidget = ( id ) => async ( dispatch ) => {
    apiConfig.get( apiBaseURL.SUPPLIER_REPORT_WIDGET_DATA + '/' + id )
        .then( ( response ) => {
            dispatch( { type: supplierReportActionType.FETCH_SUPPLIER_WIDGET_DATA, payload: response.data.data } );
        } )
        .catch( ( { response } ) => {
            dispatch( addToast(
                { text: response.data.message, type: toastType.ERROR } ) );
        } );
};
