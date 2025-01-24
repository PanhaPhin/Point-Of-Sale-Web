import {languagesActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case languagesActionType.FETCH_LANGUAGE_DATA:
            return [action.payload];
        case languagesActionType.EDIT_LANGUAGE_DATA:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        default:
            return state;
    }
};
