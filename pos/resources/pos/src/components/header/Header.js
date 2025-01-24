import React, { useEffect, useState } from 'react';
import { Image, Nav, Navbar } from 'react-bootstrap-v5';
import { connect, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Tokens } from '../../constants/index'
import { logoutAction } from '../../store/action/authAction';
import ChangePassword from '../auth/change-password/ChangePassword';
import { getAvatarName } from '../../shared/sharedMethod';
import English from '../../assets/images/gb.svg';
import French from '../../assets/images/fr.svg';
import Arabic from '../../assets/images/sa.svg';
import Turkish from '../../assets/images/tr.svg';
import German from '../../assets/images/de.svg';
import Spanish from '../../assets/images/es.svg';
import Vietnamese from "../../assets/images/vn.svg"
import Chinese from "../../assets/images/cn.svg"
import { getFormattedMessage } from '../../shared/sharedMethod';
import { updateLanguage } from '../../store/action/updateLanguageAction';
import User from '../../assets/images/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMaximize,
    faMinimize,
    faUser,
    faLock,
    faRightFromBracket,
    faAngleDown,
    faBell, faLanguage
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Row } from "react-bootstrap";
import { productQuantityReportAction } from '../../store/action/paymentQuantityReport';
import { Filters } from '../../constants';
import LanguageModel from "../user-profile/LanguageModel";
import PosRegisterModel from '../posRegister/PosRegisterModel.js';

const Header = (props) => {
    const { logoutAction, newRoutes, updateLanguage, selectedLanguage, productQuantityReportAction, productQuantityReport } = props;
    const navigate = useNavigate();
    const users = localStorage.getItem(Tokens.USER);
    const firstName = localStorage.getItem(Tokens.FIRST_NAME);
    const lastName = localStorage.getItem(Tokens.LAST_NAME);
    const token = localStorage.getItem(Tokens.ADMIN);
    const imageUrl = localStorage.getItem(Tokens.USER_IMAGE_URL);
    const image = localStorage.getItem(Tokens.IMAGE);
    const updatedEmail = localStorage.getItem(Tokens.UPDATED_EMAIL);
    const updatedFirstName = localStorage.getItem(Tokens.UPDATED_FIRST_NAME);
    const updatedLastName = localStorage.getItem(Tokens.UPDATED_LAST_NAME);
    const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE)
    const [deleteModel, setDeleteModel] = useState(false);
    const [languageModel, setLanguageModel] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [warehouseValue, setWarehouseValue] = useState({ label: 'All', value: null });
    const [totalRecords, setTotalRecords] = useState(0)
    const [showPosRegisterModel, setShowPosRegisterModel] = useState(false)
    const { allConfigData } = useSelector(state => state)

    useEffect(() => {
        let isLoading
        productQuantityReportAction(warehouseValue.value, Filters.OBJ, isLoading = false, setTotalRecords)
    }, [])
    const onClickDeleteModel = () => {
        setDeleteModel(!deleteModel);
    };

    const onClickLanguageModel = () => {
        setLanguageModel(!languageModel);
    };

    const onLogOut = () => {
        logoutAction(token, navigate);
        navigate('/login');
    };

    const onProfileClick = () => {
        window.location.href = '#/app/profile/edit';
    };

    // const changeLanguage = (language) => {
    //     updateLanguage({language: language});
    // };
    //
    // const activeLanguage = updatedLanguage ? updatedLanguage : selectedLanguage;
    //
    // const activeFlag = () => {
    //     if (activeLanguage === 'en') {
    //         return English
    //     }
    //     if (activeLanguage === 'fr') {
    //         return French
    //     }
    //     if (activeLanguage === 'ar') {
    //         return Arabic
    //     }
    //     if (activeLanguage === 'tr') {
    //         return Turkish
    //     }
    //     if (activeLanguage === 'gr') {
    //         return German
    //     }
    //     if (activeLanguage === 'sp') {
    //         return Spanish
    //     }
    //     if (activeLanguage === 'vi') {
    //         return Vietnamese
    //     }
    //     if (activeLanguage === 'cn') {
    //         return Chinese
    //     }
    // };

    const fullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const handleClickPOSBtn = () => {
        setShowPosRegisterModel(true)
    }

    const onClickshowPosRegisterModel = () => {
        setShowPosRegisterModel(false)
    }

    return (
        <Navbar collapseOnSelect expand='lg' className='align-items-stretch ms-auto py-1'>
            <div className='d-flex align-items-stretch justify-content-center'>
                <Nav className='align-items-stretch justify-content-between flex-row'>
                    <ul className='nav align-items-center'>
                        <li>
                            {newRoutes.map((route) => route.permission).filter(routeName => routeName === 'manage_pos_screen')[0] === 'manage_pos_screen'
                                ?
                                allConfigData?.open_register === true
                                    ?
                                    <button onClick={handleClickPOSBtn}
                                        className='px-sm-3 px-2 d-flex text-decoration-none pos-button pos-button-highlight'>
                                        {getFormattedMessage('header.pos.title')}
                                    </button>
                                    :
                                    <Link to='/app/pos'
                                        className='px-sm-3 px-2 d-flex text-decoration-none pos-button pos-button-highlight'>
                                        {getFormattedMessage('header.pos.title')}
                                    </Link>
                                :
                                ''
                            }
                        </li>
                        {isFullscreen === true ?
                            <li className="px-sm-3 px-2" onClick={() => fullScreen()}>
                                <FontAwesomeIcon icon={faMinimize} className='text-primary fs-2' />
                            </li>
                            :
                            <li className="px-sm-3 px-2" onClick={() => fullScreen()}>
                                <FontAwesomeIcon icon={faMaximize} className='text-primary fs-2' />
                            </li>
                        }
                    </ul>
                    {/*<Dropdown className='d-flex align-items-stretch me-3'>*/}
                    {/*    <Dropdown.Toggle className='hide-arrow bg-transparent border-0 p-0 d-flex align-items-center'*/}
                    {/*                     id='dropdown-basic'>*/}
                    {/*        <Image src={activeFlag()} width='30' height='20'*/}
                    {/*               className='image'/>*/}
                    {/*    </Dropdown.Toggle>*/}
                    {/*    <Dropdown.Menu>*/}
                    {/*        <div*/}
                    {/*            className='menu-icon-grid d-flex justify-content-around  align-items-center flex-wrap p-2 pb-0'>*/}
                    {/*            <div className='d-sm-flex'>*/}
                    {/*                <Dropdown.Item className='p-0 bg-white'>*/}
                    {/*                    <button*/}
                    {/*                        className={`language-btn btn mb-2 mx-1 ${activeLanguage === 'en' ? 'language-btn-active active' : null}`}*/}
                    {/*                        onClick={() => changeLanguage('en')}>*/}
                    {/*                        <Image src={English} className='mb-1'/>*/}
                    {/*                        <span className='fs-6'>English</span>*/}
                    {/*                    </button>*/}
                    {/*                </Dropdown.Item>*/}
                    {/*                <Dropdown.Item className='p-0 bg-white'>*/}
                    {/*                    <button*/}
                    {/*                        className={`language-btn btn mb-2 mx-1 ${activeLanguage === 'fr' ? 'language-btn-active active' : null}`}*/}
                    {/*                        onClick={() => changeLanguage('fr')}>*/}
                    {/*                        <Image src={French} className='mb-1'/>*/}
                    {/*                        <span className='fs-6'>French</span>*/}
                    {/*                    </button>*/}
                    {/*                </Dropdown.Item>*/}
                    {/*                <Dropdown.Item className='p-0 bg-white'>*/}
                    {/*                    <button*/}
                    {/*                        className={`language-btn btn mb-2 mx-1 ${activeLanguage === 'ar' ? 'language-btn-active active' : null}`}*/}
                    {/*                        onClick={() => changeLanguage('ar')}>*/}
                    {/*                        <Image src={Arabic} className='mb-1'/>*/}
                    {/*                        <span className='fs-6'>Arabic</span>*/}
                    {/*                    </button>*/}
                    {/*                </Dropdown.Item>*/}
                    {/*            </div>*/}
                    {/*            <div className='d-sm-flex'>*/}
                    {/*                <Dropdown.Item className='p-0 bg-white'>*/}
                    {/*                    <button*/}
                    {/*                        className={`language-btn btn mb-2 mx-1 ${activeLanguage === 'tr' ? 'language-btn-active active' : null}`}*/}
                    {/*                        onClick={() => changeLanguage('tr')}>*/}
                    {/*                        <Image src={Turkish}  className='mb-1'/>*/}
                    {/*                        <span className='fs-6'>Turkish</span>*/}
                    {/*                    </button>*/}
                    {/*                </Dropdown.Item>*/}
                    {/*                <Dropdown.Item className='p-0 bg-white'>*/}
                    {/*                    <button*/}
                    {/*                        className={`language-btn btn mb-2 mx-1 ${activeLanguage === 'gr' ? 'language-btn-active active' : null}`}*/}
                    {/*                        onClick={() => changeLanguage('gr')}>*/}
                    {/*                        <Image src={German} className='mb-1'/>*/}
                    {/*                        <span className='fs-6'>German</span>*/}
                    {/*                    </button>*/}
                    {/*                </Dropdown.Item>*/}
                    {/*                <Dropdown.Item className='p-0 bg-white'>*/}
                    {/*                    <button*/}
                    {/*                        className={`language-btn btn mb-2 mx-1 ${activeLanguage === 'sp' ? 'language-btn-active active' : null}`}*/}
                    {/*                        onClick={() => changeLanguage('sp')}>*/}
                    {/*                        <Image src={Spanish}  className='mb-1'/>*/}
                    {/*                        <span className='fs-6'>Spanish</span>*/}
                    {/*                    </button>*/}
                    {/*                </Dropdown.Item>*/}
                    {/*            </div>*/}
                    {/*            <div className='d-sm-flex'>*/}
                    {/*                <Dropdown.Item className='p-0 bg-white'>*/}
                    {/*                    <button*/}
                    {/*                        className={`language-btn btn mb-2 mx-1 ${activeLanguage === 'vi' ? 'language-btn-active active' : null}`}*/}
                    {/*                        onClick={() => changeLanguage('vi')}>*/}
                    {/*                        <Image src={Vietnamese} className='mb-1'/>*/}
                    {/*                        <span className='fs-6'>Vietnamese</span>*/}
                    {/*                    </button>*/}
                    {/*                </Dropdown.Item>*/}
                    {/*                <Dropdown.Item className='p-0 bg-white'>*/}
                    {/*                    <button*/}
                    {/*                        className={`language-btn btn mb-2 mx-1 ${activeLanguage === 'cn' ? 'language-btn-active active' : null}`}*/}
                    {/*                        onClick={() => changeLanguage('cn')}>*/}
                    {/*                        <Image src={Chinese} className='mb-1'/>*/}
                    {/*                        <span className='fs-6'>Chinese</span>*/}
                    {/*                    </button>*/}
                    {/*                </Dropdown.Item>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </Dropdown.Menu>*/}
                    {/*</Dropdown>*/}
                    {/*<div className='nav align-items-center alert-badge-icon position-relative'>*/}
                    {/*<ul className='m-0'>*/}
                    {/*    <li className="pe-4">*/}
                    {/*        <FontAwesomeIcon icon={faBell} className='text-primary fs-2' />*/}
                    {/*    </li>*/}
                    {/*</ul>*/}
                    {/*<div className='product-alert-badge'>{productQuantityReport.length > 0 ? 1 : 0}</div>*/}
                    {/*<div className='product-alert-message'>*/}
                    {/*<Link to='/app/report/report-product-quantity' className='text-decoration-none'>*/}
                    {/*    <FontAwesomeIcon icon={faBell} className='fs-2' /> {productQuantityReport ? totalRecords : 0} Product Quantity Alerts*/}
                    {/*</Link>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <Dropdown className='d-flex align-items-stretch'>
                        <Dropdown.Toggle className='hide-arrow bg-transparent border-0 p-0 d-flex align-items-center'
                            id='dropdown-basic'>
                            <div className='d-flex align-items-center justify-content-center'>
                                {imageUrl || image ?
                                    <Image src={imageUrl ? imageUrl : image || User}
                                        className='image image-circle image-tiny'
                                        alt='user-avatar' height='50' width='50' />
                                    :
                                    <span className='custom-user-avatar'>
                                        {getAvatarName(updatedFirstName && updatedLastName ? updatedFirstName + ' ' + updatedLastName : firstName + ' ' + lastName)}
                                    </span>
                                }
                                <span
                                    className='ms-2 text-gray-600 d-none d-sm-block'>
                                    {updatedFirstName && updatedLastName ? <>{updatedFirstName + ' ' + updatedLastName}</> : <> {firstName + ' ' + lastName}</>}
                                </span>
                            </div>
                            <FontAwesomeIcon icon={faAngleDown} className="text-gray-600 ms-2 d-none d-sm-block" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <div className='text-center pb-1 border-bottom mb-4'>
                                <div className='text-center text-decoration-none pb-5 w-100 align-items-center'>
                                    <div className='image image-circle w-100 image-tiny pb-5'>
                                        {imageUrl || image ?
                                            <img src={imageUrl ? imageUrl : image}
                                                className='img-fluid' height='50' width='50' alt='user-avatar' /> :
                                            <span className='user_avatar mx-auto'>
                                                {getAvatarName(updatedFirstName && updatedLastName ? updatedFirstName + ' ' + updatedLastName : firstName + ' ' + lastName)}
                                            </span>
                                        }
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <h3 className='text-gray-900'>
                                            {updatedFirstName && updatedLastName ? <>{updatedFirstName + ' ' + updatedLastName}</> : <> {firstName + ' ' + lastName}</>}
                                        </h3>
                                        <h4 className='mb-0 fw-400 fs-6'>
                                            {updatedEmail ? updatedEmail : users}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <Dropdown.Item
                                onClick={(e) => onProfileClick(e)}
                                className='px-5 fs-6'>
                                <span className='dropdown-icon me-4 text-gray-600'>
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                {getFormattedMessage('header.profile-menu.profile.label')}</Dropdown.Item>
                            <Dropdown.Item onClick={onClickDeleteModel}
                                className='px-5 fs-6'>
                                <span className='dropdown-icon me-4 text-gray-600'>
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                                {getFormattedMessage('header.profile-menu.change-password.label')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={onClickLanguageModel}
                                className='px-5 fs-6'>
                                <span className='dropdown-icon me-4 text-gray-600'>
                                    <FontAwesomeIcon icon={faLanguage} />
                                </span>
                                {getFormattedMessage('header.profile-menu.change-language.label')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(e) => onLogOut(e)}
                                className='px-5 fs-6'>
                                <span className='dropdown-icon me-4 text-gray-600'>
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                </span>
                                {getFormattedMessage('header.profile-menu.logout.label')}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </div>
            {deleteModel === true &&
                <ChangePassword deleteModel={deleteModel} onClickDeleteModel={onClickDeleteModel} />}

            {languageModel === true &&
                <LanguageModel languageModel={languageModel} onClickLanguageModel={onClickLanguageModel} />}

            <PosRegisterModel showPosRegisterModel={showPosRegisterModel} onClickshowPosRegisterModel={onClickshowPosRegisterModel} />
        </Navbar>
    )
};

const mapStateToProps = (state) => {
    const { selectedLanguage, productQuantityReport } = state;
    return { selectedLanguage, productQuantityReport }
};

export default connect(mapStateToProps, { logoutAction, updateLanguage, productQuantityReportAction })(Header);
