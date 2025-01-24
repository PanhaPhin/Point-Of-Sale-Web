import apiConfig from '../../config/apiConfig';
import {authActionType, Tokens, toastType, apiBaseURL} from '../../constants';
import {fetchPermissions} from './permissionAction';
import {addToast} from './toastAction';
import {fetchFrontSetting} from './frontSettingAction';
import {setLanguage} from './changeLanguageAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import {fetchConfig} from "./configAction";

export const loginAction = (user, navigate, setLoading) => async (dispatch) => {
    await apiConfig.post('login', user)
        .then((response) => {
            localStorage.setItem(Tokens.ADMIN, response.data.data.token);
            localStorage.setItem(Tokens.GET_PERMISSIONS, response.data.data.permissions);
            localStorage.setItem(Tokens.USER, response.data.data.user.email);
            localStorage.setItem(Tokens.IMAGE, response.data.data.user.image_url);
            localStorage.setItem(Tokens.FIRST_NAME, response.data.data.user.first_name);
            localStorage.setItem(Tokens.LANGUAGE, response.data.data.user.language);
            localStorage.setItem(Tokens.LAST_NAME, response.data.data.user.last_name);
            localStorage.setItem('loginUserArray', JSON.stringify(response.data.data.user));
            dispatch({type: authActionType.LOGIN_USER, payload: response.data.data});
            dispatch(setLanguage(response.data.data.user.language));
            localStorage.setItem(Tokens.UPDATED_LANGUAGE, response.data.data.user.language);
            dispatch(fetchPermissions());
            dispatch(fetchFrontSetting());
            dispatch(fetchConfig())
            navigate('/app/dashboard');
            dispatch(addToast({text: getFormattedMessage('login.success.message')}));
            if(response.data.data.user.language) {
                window.location.reload()
            }
        })
        .catch(({response}) => {
            dispatch(addToast({text: response.data.message, type: toastType.ERROR}));
            setLoading(false);
        });
};

export const logoutAction = (token, navigate) => async (dispatch) => {
    await apiConfig.post('logout', token)
        .then(() => {
            localStorage.removeItem(Tokens.ADMIN);
            localStorage.removeItem(Tokens.USER);
            localStorage.removeItem(Tokens.IMAGE);
            localStorage.removeItem(Tokens.FIRST_NAME);
            localStorage.removeItem(Tokens.LAST_NAME);
            localStorage.removeItem('loginUserArray');
            localStorage.removeItem(Tokens.UPDATED_EMAIL);
            localStorage.removeItem(Tokens.UPDATED_FIRST_NAME);
            localStorage.removeItem(Tokens.UPDATED_LAST_NAME);
            localStorage.removeItem(Tokens.USER_IMAGE_URL);
            navigate('/login');
            dispatch(addToast({text: getFormattedMessage('logout.success.message')}));
        })
        .catch(({response}) => {
            dispatch(addToast({text: response.data.message, type: toastType.ERROR}));
        });
};

export const forgotPassword = (user) => async (dispatch) => {
    await apiConfig.post(apiBaseURL.ADMIN_FORGOT_PASSWORD, user).then((response) => {
        dispatch({type: authActionType.ADMIN_FORGOT_PASSWORD, payload: response.data.message});
        dispatch(addToast({text: getFormattedMessage('forgot-password-form.success.reset-link.label')}));
    }).catch(({response}) => {
        dispatch({type: toastType.ERROR, payload: response.data.message});
        dispatch(
            addToast({text: response.data.message, type: toastType.ERROR}));
    });
};

export const resetPassword = (user, navigate) => async (dispatch) => {
    await apiConfig.post(apiBaseURL.ADMIN_RESET_PASSWORD, user).then((response) => {
        dispatch({type: authActionType.ADMIN_RESET_PASSWORD, payload: user});
        dispatch(addToast(
            {text: getFormattedMessage('reset-password.success.update.message')}));
        navigate('/login');
    }).catch(({response}) => {
        dispatch(
            addToast({text: response.data.message, type: toastType.ERROR}))
    });
};

