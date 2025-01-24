import apiConfig from '../../../config/apiConfig';
import {apiBaseURL, posProductActionType, toastType} from '../../../constants';
import {addToast} from '../toastAction';

export const posFetchProduct = (productId) => async (dispatch) => {
    apiConfig.get(apiBaseURL.PRODUCTS + '/' + productId)
        .then((response) => {
            dispatch({type: posProductActionType.FETCH_PRODUCT, payload: response.data.data})
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const posSearchNameProduct = (productName) => async (dispatch) => {
    apiConfig.get(`products?filter[name]=${productName}`)
        .then((response) => {
            dispatch({type: posProductActionType.POS_SEARCH_NAME_PRODUCT, payload: response.data.data})
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const posSearchCodeProduct = (productCode) => async (dispatch) => {
    apiConfig.get(`products?filter[code]=${productCode}`)
        .then((response) => {
            dispatch({type: posProductActionType.POS_SEARCH_CODE_PRODUCT, payload: response.data.data})
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
