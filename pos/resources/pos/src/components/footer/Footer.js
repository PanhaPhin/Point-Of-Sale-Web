import React from 'react';

const Footer = (props) => {
    const {allConfigData, frontSetting} = props
    return (
        <footer className='border-top w-100 pt-4 mt-7 d-flex justify-content-between'>
            <p className='fs-6 text-gray-600'>All Rights Reserved (C) {new Date().getFullYear()}
                <a href='#' className='text-decoration-none'> {frontSetting?.value?.company_name}</a>
            </p>
            <div className="fs-6 text-gray-600">
                {allConfigData && allConfigData.is_version === "1" ? "v" + allConfigData.version : ""}
            </div>
        </footer>
    )
};

export default Footer;
