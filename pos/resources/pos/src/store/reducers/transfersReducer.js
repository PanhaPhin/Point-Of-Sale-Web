import {transferActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case transferActionType.FETCH_TRANSFERS:
            return action.payload;
        case transferActionType.FETCH_TRANSFER:
            return action.payload;
        case transferActionType.ADD_TRANSFER:
            return action.payload;
        case transferActionType.EDIT_TRANSFER:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case transferActionType.DELETE_TRANSFER:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
