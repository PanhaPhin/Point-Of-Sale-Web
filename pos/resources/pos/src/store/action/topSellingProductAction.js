import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, topSellingActionType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from "./loadingAction";

export const topSellingProduct = () => async (dispatch) => {
    dispatch(setLoading(true));

    apiConfig.get(apiBaseURL.TOP_SELLING_PRODUCTS)
        .then((response) => {
            dispatch({type: topSellingActionType.TOP_SELLING, payload: response.data.data})
            dispatch(setLoading(false));
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
            dispatch(setLoading(false));
        });
}
