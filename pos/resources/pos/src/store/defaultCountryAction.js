import { constants } from "../constants";

export const setDefaultCountry = (country) => {
    return {type: constants.SET_DEFAULT_COUNTRY, payload: country};
};
