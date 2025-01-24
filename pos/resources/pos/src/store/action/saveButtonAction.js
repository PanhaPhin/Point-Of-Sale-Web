import {constants} from '../../constants';

export const setSavingButton = (isSaving) => {
    return {type: constants.SET_SAVING, payload: isSaving};
};
