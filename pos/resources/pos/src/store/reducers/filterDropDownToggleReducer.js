
export default (state = false, action) => {
    switch (action.type) {
        case "ON_TOGGLE":
            return action.payload;
        default:
            return state;
    }
}
