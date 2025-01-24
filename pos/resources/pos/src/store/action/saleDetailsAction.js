import {setLoading} from './loadingAction';
import apiConfig from '../../config/apiConfig';
import {apiBaseURL, saleActionType, toastType} from '../../constants';
import {addToast} from './toastAction';

export const saleDetailsAction = (saleId, singleSale, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    apiConfig.get(apiBaseURL.SALE_DETAILS + '/' + saleId, singleSale)
        .then((response) => {
            dispatch({type: saleActionType.SALE_DETAILS, payload: response.data.data})
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
