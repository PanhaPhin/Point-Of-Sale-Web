import {constants} from '../../constants';

export const setTotalRecord = (totalRecord) => {
    return { type: constants.SET_TOTAL_RECORD, payload: totalRecord };
};

export const removeFromTotalRecord = (totalRecord) => {
    return { type: constants.UPDATE_TOTAL_RECORD_AFTER_DELETE, payload: totalRecord };
};

export const addInToTotalRecord = (totalRecord) => {
    return { type: constants.UPDATE_TOTAL_RECORD_AFTER_ADD, payload: totalRecord };
};
