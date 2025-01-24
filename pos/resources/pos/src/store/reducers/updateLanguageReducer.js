import { languageActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case languageActionType.UPDATE_LANGUAGE:
            return action.payload;
        case languageActionType.UPDATED_LANGUAGE:
            return action.payload;
        default:
            return state;
    }
};
