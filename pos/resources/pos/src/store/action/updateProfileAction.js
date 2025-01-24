import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, profileActionType, Tokens} from '../../constants';
import {addToast} from './toastAction'
import {getFormattedMessage} from '../../shared/sharedMethod';

export const fetchProfile = () => async (dispatch) => {
    apiConfig.get(apiBaseURL.EDIT_PROFILE)
        .then((response) => {
            dispatch({type: profileActionType.FETCH_PROFILE, payload: response.data.data})
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const updateProfile = (profile, navigate) => async (dispatch) => {
    apiConfig.post(apiBaseURL.UPDATE_PROFILE, profile)
        .then((response) => {
            dispatch({type: profileActionType.UPDATE_PROFILE, payload: response.data.data});
            localStorage.setItem(Tokens.USER_IMAGE_URL, response.data.data.attributes.image)
            localStorage.setItem(Tokens.UPDATED_EMAIL, response.data.data.attributes.email)
            localStorage.setItem(Tokens.UPDATED_FIRST_NAME, response.data.data.attributes.first_name)
            localStorage.setItem(Tokens.UPDATED_LAST_NAME, response.data.data.attributes.last_name)
            dispatch(addToast({text: getFormattedMessage('update-profile.success.update.message')}));
            navigate('/dashboard')
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
