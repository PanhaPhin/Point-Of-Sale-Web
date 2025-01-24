import {apiBaseURL, authActionType, toastType} from '../../constants';
import apiConfig from '../../config/apiConfig';
import {addToast} from './toastAction';

export const onChangePassword = (passwordInputs) => async (dispatch) => {
    apiConfig.patch(apiBaseURL.CHANGE_PASSWORD, passwordInputs)
        .then((response) => {
            dispatch({type: authActionType.CHANGE_PASSWORD, payload: response.data});
            dispatch(addToast({text: response.data.message}));
        })
        .catch((response) => {
            dispatch(addToast(
                {text: response.response.data.message, type: toastType.ERROR}));
        });
};
