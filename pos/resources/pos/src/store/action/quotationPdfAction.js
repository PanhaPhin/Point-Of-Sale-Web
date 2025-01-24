import {setLoading} from './loadingAction';
import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType} from '../../constants';
import {addToast} from './toastAction';

export const quotationPdfAction = (quotationId, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    apiConfig.get(apiBaseURL.QUOTATION_PDF + '/' + quotationId)
        .then((response) => {
            window.open(response.data.data.quotation_pdf_url, '_blank');
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};