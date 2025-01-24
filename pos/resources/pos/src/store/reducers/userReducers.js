import {userActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case userActionType.FETCH_USERS:
            return action.payload;
        case userActionType.FETCH_USER:
            return [action.payload];
        case userActionType.ADD_USER:
            return action.payload;
        case userActionType.EDIT_USER:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case userActionType.DELETE_USER:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
