import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, topCustomersActionType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from "./loadingAction";

export const fetchTopCustomers = () => async (dispatch) => {
    dispatch(setLoading(true));

    apiConfig.get(apiBaseURL.TOP_CUSTOMERS)
        .then((response) => {
            dispatch({type: topCustomersActionType.TOP_CUSTOMERS, payload: response.data.data})
            dispatch(setLoading(false));
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
            dispatch(setLoading(false));
        });
}
