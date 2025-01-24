import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, smsApiActionType} from '../../constants';
import { getFormattedMessage } from '../../shared/sharedMethod';
import {addToast} from './toastAction'



export const fetchSmsApiSetting = () => async (dispatch) => {
    await apiConfig.get(apiBaseURL.SMS_SETTING)
        .then((response) => {
            dispatch({type: smsApiActionType.FETCH_SMS_SETTINGS, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};


export const updateSmsApiSetting = (smsData) => async (dispatch) => {
    await apiConfig.post(apiBaseURL.SMS_SETTING , smsData)
        .then((response) => {
            dispatch({type: smsApiActionType.EDIT_SMS_SETTING, payload: response.data.data});
            dispatch(addToast({text: getFormattedMessage('sms.api.update.success.message'), type: toastType.ADD_TOAST}))
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};