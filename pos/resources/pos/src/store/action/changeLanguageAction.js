import {constants} from '../../constants';

export const setLanguage = (language) => {
    return {type: constants.SET_LANGUAGE, payload: language};
};
