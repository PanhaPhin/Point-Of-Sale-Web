import React from 'react'
import AsideMenu from './asideMenu';

const AsideDefault = (props) => {
    const {asideConfig, frontSetting, isResponsiveMenu, menuClick, menuIconClick, isMenuCollapse} = props;

    return (
        <AsideMenu asideConfig={asideConfig} frontSetting={frontSetting} isResponsiveMenu={isResponsiveMenu}
                   menuClick={menuClick} menuIconClick={menuIconClick} isMenuCollapse={isMenuCollapse}/>
    )
};

export default AsideDefault;

