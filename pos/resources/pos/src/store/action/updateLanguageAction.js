import apiConfig from '../../config/apiConfig';
import { apiBaseURL, toastType, languageActionType, Tokens } from '../../constants';
import { addToast } from './toastAction';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { setLoading } from "./loadingAction";

export const fetchSelectedLanguageData = (languageId) => async (dispatch) => {
    apiConfig.get(apiBaseURL.LANGUAGES + '/translation/' + languageId)
        .then((response) => {
            dispatch({ type: languageActionType.UPDATED_LANGUAGE, payload: response.data.data })
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        })
        .catch(({ response }) => {
            dispatch(addToast(
                { text: response?.data?.message, type: toastType.ERROR }));
        });
}

export const updateLanguage = (language, language_id) => async (dispatch) => {
    apiConfig.post(apiBaseURL.CHANGE_LANGUAGE, language)
        .then((response) => {
            localStorage.setItem(Tokens.UPDATED_LANGUAGE, response.data.data)
            // dispatch({ type: languageActionType.UPDATE_LANGUAGE, payload: response.data.data });
            dispatch(addToast({ text: getFormattedMessage('change-language.update.success.message') }));
            dispatch(fetchSelectedLanguageData(language_id))
        })
        .catch(({ response }) => {
            dispatch(addToast(
                { text: response.data.message, type: toastType.ERROR }));
            dispatch(setLoading(false));
        });
};
