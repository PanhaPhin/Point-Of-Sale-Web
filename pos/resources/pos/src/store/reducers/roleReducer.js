import {rolesActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case rolesActionType.FETCH_ROLES:
            return action.payload;
        case rolesActionType.FETCH_ROLE:
            return [action.payload];
        case rolesActionType.ADD_ROLES:
            return action.payload;
        case rolesActionType.EDIT_ROLES:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case rolesActionType.DELETE_ROLES:
            return state.filter(item => item.id !== action.payload);
        case rolesActionType.FETCH_ALL_ROLES:
            return action.payload;
        default:
            return state;
    }
};
