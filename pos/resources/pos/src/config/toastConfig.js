import { toast, Slide } from 'react-toastify';

let id = 0;
const defaultOptions = {
    config: {
        position: toast.POSITION.TOP_RIGHT,
        closeButton: false,
        transition: Slide,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    }
};

export default ( options = {} ) => {
    return { ...defaultOptions, ...options, id: id++ }
};
