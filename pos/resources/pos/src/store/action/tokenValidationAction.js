import apiConfig from '../../config/apiConfig';
import { apiBaseURL, tokenValidationActionType } from '../../constants';

export const tokenValidation = (token) => async (dispatch) => {
    apiConfig.post(apiBaseURL.VALIDATE_AUTH_TOKEN)
        .then((response) => {
            dispatch({ type: tokenValidationActionType.FETCH_VALIDATION, payload: response.data });
        })
        .catch(({ response }) => {
            // console.log(response)
        }
        );
}
