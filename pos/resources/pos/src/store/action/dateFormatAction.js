import {constants} from '../../constants';

export const setDateFormat = (format) => {
    return {type: constants.SET_DATE_FORMAT, payload: format};
};
