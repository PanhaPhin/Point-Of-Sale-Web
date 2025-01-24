import {unitsActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case unitsActionType.FETCH_UNITS:
            return action.payload;
        case unitsActionType.FETCH_UNIT:
            return [action.payload];
        case unitsActionType.ADD_UNIT:
            return [...state, action.payload];
        case unitsActionType.EDIT_UNIT:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case unitsActionType.DELETE_UNIT:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
