import {tokenValidationActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case tokenValidationActionType.FETCH_VALIDATION:
            return action.payload;
        default:
            return state;
    }
};
