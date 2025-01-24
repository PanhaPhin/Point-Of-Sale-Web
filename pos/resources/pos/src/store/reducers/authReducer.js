import {authActionType, toastType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case authActionType.LOGIN_USER:
            return action.payload;
        case authActionType.ADMIN_RESET_PASSWORD:
            return action.payload;
        case authActionType.ADMIN_FORGOT_PASSWORD:
            return action.payload
        case toastType.ERROR:
            return {...state, errorMessage : action.payload}
        default:
            return state;
    }
};
