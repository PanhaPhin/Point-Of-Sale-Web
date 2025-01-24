import {holdListActionType} from '../../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case holdListActionType.FETCH_HOLD:
            return action.payload;

        // case holdListActionType.EDIT_SALE:
        //     return state.map(item => item.id === +action.payload.id ? action.payload : item);
        // case holdListActionType.DELETE_SALE:
        //     return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
