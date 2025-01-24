import apiConfig from '../../config/apiConfig';
import {apiBaseURL, adjustMentActionType, toastType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from './loadingAction';

export const getAdjustmentDetails = (adjustmentid, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    apiConfig.get(apiBaseURL.ADJUSTMENTS + '/' + adjustmentid)
        .then((response) => {
            dispatch({type: adjustMentActionType.ADJUSTMENT_DETAILS, payload: response.data.data})
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};