import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import AsideDefault from './sidebar/asideDefault';
import Header from './header/Header';
import Footer from './footer/Footer';
import AsideTopSubMenuItem from './sidebar/asideTopSubMenuItem';
import {Tokens} from '../constants';
import asideConfig from '../config/asideConfig';
import {environment} from '../config/environment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {fetchConfig} from "../store/action/configAction";

const MasterLayout = (props) => {
    const {children, newPermissions, frontSetting, fetchConfig, config, allConfigData} = props;
    const [isResponsiveMenu, setIsResponsiveMenu] = useState(false);
    const [isMenuCollapse, setIsMenuCollapse] = useState(false);
    const newRoutes = config && prepareRoutes(config);
    const token = localStorage.getItem(Tokens.ADMIN);

    useEffect(() => {
        if(token){
            fetchConfig()
        }
        if (!token) {
            window.location.href = environment.URL + '#' + '/login';
        }
    }, []);

    const menuClick = () => {
        setIsResponsiveMenu(!isResponsiveMenu);
    };

    const menuIconClick = () => {
        setIsMenuCollapse(!isMenuCollapse)
    };

    return (
        <div className='d-flex flex-row flex-column-fluid'>
            <AsideDefault asideConfig={newRoutes} frontSetting={frontSetting} isResponsiveMenu={isResponsiveMenu}
                          menuClick={menuClick} menuIconClick={menuIconClick} isMenuCollapse={isMenuCollapse}/>
            <div className={`${isMenuCollapse === true ? 'wrapper-res' : 'wrapper'} d-flex flex-column flex-row-fluid`}>
                <div className='d-flex align-items-stretch justify-content-between header'>
                    <div className='container-fluid d-flex align-items-stretch justify-content-xxl-between flex-grow-1'>
                        <button type='button' className='btn d-flex align-items-center d-xl-none px-0' title='Show aside menu'
                             onClick={menuClick}>
                            <FontAwesomeIcon icon={faBars} className='fs-1'/>
                        </button>
                        <AsideTopSubMenuItem asideConfig={asideConfig} isMenuCollapse={isMenuCollapse}/>
                        <Header newRoutes={newRoutes}/>
                    </div>
                </div>
                <div className='content d-flex flex-column flex-column-fluid pt-7'>
                    <div className='d-flex flex-column-fluid'>
                        <div className='container-fluid'>
                            {children}
                        </div>
                    </div>
                </div>
                <div className='container-fluid'>
                    <Footer allConfigData={allConfigData} frontSetting={frontSetting}/>
                </div>
            </div>
        </div>
    )
};

const getRouteWithSubMenu = (route, permissions) => {
    const subRoutes = route.subMenu ?  route.subMenu.filter((item) => permissions.indexOf(item.permission) !== -1 || item.permission === '') : null
    const newSubRoutes = subRoutes ? {...route, newRoute: subRoutes} : route
    return newSubRoutes
}

const prepareRoutes = (config) => {
    const permissions = config;
    let filterRoutes = [];
    asideConfig.forEach((route) => {
    const permissionsRoute = getRouteWithSubMenu(route, permissions)
    if (permissions && permissions.indexOf(route.permission) !== -1 || route.permission === '' || permissionsRoute.newRoute?.length) {
        filterRoutes.push(permissionsRoute)
        }
    });
    return filterRoutes;
};

const mapStateToProps = (state) => {
    const newPermissions = [];
    const {permissions, settings, frontSetting, config, allConfigData} = state;

    if (permissions) {
        permissions.forEach((permission) =>
            newPermissions.push(permission.attributes.name)
        )
    }
    return {newPermissions, settings, frontSetting, config, allConfigData};
};

export default connect(mapStateToProps, {fetchConfig})(MasterLayout);
