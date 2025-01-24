import React, {useEffect} from 'react';
import {ToastContainer} from 'react-toastify';
import PropTypes from 'prop-types';

const Toast = (props) => {
    const {onCancel, language} = props;

    useEffect(() => {
        setTimeout(() => onCancel(), 5000);
    }, []);

    return (
        <ToastContainer
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            rtl={language === "ar" ? true : false}
            draggable
            pauseOnHover
            pauseOnFocusLoss
        />
    );
};

Toast.propTypes = {
    onCancel: PropTypes.func,
};

export default Toast;
