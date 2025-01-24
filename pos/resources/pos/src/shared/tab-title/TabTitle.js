import React from 'react';
import {Helmet} from 'react-helmet';
import {useSelector} from "react-redux";

const TabTitle = (props) => {
    const { title } = props;
    const {frontSetting} = useSelector(state => state)

    return (
        <Helmet>
            <title>{title + ' '} {frontSetting ? ` | ${frontSetting?.value?.company_name}` : ""}</title>
            frontSetting && <link rel="icon" type="image/png" href={frontSetting ? frontSetting?.value?.logo : "./../../../public/favicon.ico"}  sizes="16x16" />
        </Helmet>
    )
}

export default TabTitle;
