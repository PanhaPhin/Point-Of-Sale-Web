import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getFormattedMessage } from "../../shared/sharedMethod";
import { editLanguageData, fetchLanguageData } from '../../store/action/languageAction';
import { useNavigate, useParams } from "react-router-dom";
import MasterLayout from "../MasterLayout";
import HeaderTitle from "../header/HeaderTitle";
import { languageFileOptions } from "../../constants";
import ReactSelect from "../../shared/select/reactSelect";

const EditLanguageData = ( props ) => {
    const { editLanguageData, language, fetchLanguageData } = props;
    const { id } = useParams();
    const navigate = useNavigate()
    const [ langJsonObj, setLangJsonObj ] = useState( {} )
    const [ langPhpObj, setLangPhpObj ] = useState( {} )
    const [ errorObj, setErrorObj ] = useState( {} )
    const [ successObj, setSuccessObj ] = useState( {} )
    const [ pdfObj, setPdfObj ] = useState( {} )
    const [ fileType, setFileType ] = useState( { type: 1 } )

    useEffect( () => {
        fetchLanguageData( id )
    }, [] )

    let lang_json_array = language[ 0 ]?.lang_json_array
    let lang_php_array = language[ 0 ]?.lang_php_array;
    let errorArray = lang_php_array?.error
    let pdfArray = lang_php_array?.pdf
    let successArray = lang_php_array?.success

    useEffect( () => {
        setLangJsonObj( lang_json_array )
        setLangPhpObj( lang_php_array )
        setErrorObj( errorArray )
        setSuccessObj( successArray )
        setPdfObj( pdfArray )
    }, [ lang_json_array, lang_php_array, errorArray, successArray, pdfArray ] )

    const languageFileTypeOption = languageFileOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const onFileTypeChange = ( obj ) => {
        setFileType( { type: obj.value } );
    };

    function str_replace ( string ) {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1 ).replaceAll( '.', ' ' ).replaceAll( '-', ' ' ).replaceAll( '_', ' ' );
    }

    const onChangeInput = ( e ) => {
        e.preventDefault();
        const { name, value } = e.target;
        if ( fileType.type === 2 ) {
            setLangPhpObj( inputs => ( { ...inputs, [ name ]: value } ) )
        } else if ( fileType.type === 3 ) {
            setErrorObj( inputs => ( { ...inputs, [ name ]: value } ) )
            setLangPhpObj( language => ( {
                ...language,
                error: { ...language.error, [ name ]: value }
            } ) )
        } else if ( fileType.type === 4 ) {
            setSuccessObj( inputs => ( { ...inputs, [ name ]: value } ) )
            setLangPhpObj( language => ( {
                ...language,
                success: { ...language.success, [ name ]: value }
            } ) )
        } else if ( fileType.type === 5 ) {
            setPdfObj( inputs => ( { ...inputs, [ name ]: value } ) )
            setLangPhpObj( language => ( {
                ...language,
                pdf: { ...language.pdf, [ name ]: value }
            } ) )
        } else {
            setLangJsonObj( inputs => ( { ...inputs, [ name ]: value } ) )
        }
    };

    const FetchLung = () => {
        const steps = [];
        if ( fileType.type === 1 || fileType.type === 2 ) {
            for ( const key in fileType.type === 2 ? langPhpObj : langJsonObj ) {
                if ( key === 'pdf' || key === 'success' || key === 'error' ) {
                    steps.push( '' )
                } else {
                    steps.push(
                        <div className={"col-md-4 mt-2"} key={key}>
                            <label
                                className='form-label'>{str_replace( key )} : </label>
                            <input type='text' name={[ key ]}
                                value={fileType.type === 2 ? langPhpObj[ key ] : langJsonObj[ key ]}
                                placeholder={"Enter " + str_replace( key )}
                                className='form-control' autoComplete='off'
                                onChange={( e ) => onChangeInput( e )} />
                        </div>
                    );
                }
            }
        } else if ( fileType.type === 3 ) {
            for ( const key in errorObj ) {
                steps.push(
                    <div className={"col-md-4 mt-2"} key={key}>
                        <label
                            className='form-label'>{str_replace( key )} : </label>
                        <input type='text' name={[ key ]}
                            value={errorObj[ key ]}
                            placeholder={"Enter " + str_replace( key )}
                            className='form-control' autoComplete='off'
                            onChange={( e ) => onChangeInput( e )} />
                    </div>
                );
            }
        }
        else if ( fileType.type === 4 ) {
            for ( const key in successObj ) {
                steps.push(
                    <div className={"col-md-4 mt-2"} key={key}>
                        <label
                            className='form-label'>{str_replace( key )} : </label>
                        <input type='text' name={[ key ]}
                            value={successObj[ key ]}
                            placeholder={"Enter " + str_replace( key )}
                            className='form-control' autoComplete='off'
                            onChange={( e ) => onChangeInput( e )} />
                    </div>
                );
            }
        }
        else if ( fileType.type === 5 ) {
            for ( const key in pdfObj ) {
                steps.push(
                    <div className={"col-md-4 mt-2"} key={key}>
                        <label
                            className='form-label'>{str_replace( key )} : </label>
                        <input type='text' name={[ key ]}
                            value={pdfObj[ key ]}
                            placeholder={"Enter " + str_replace( key )}
                            className='form-control' autoComplete='off'
                            onChange={( e ) => onChangeInput( e )} />
                    </div>
                );
            }
        }
        return steps
    }

    const prepareFormData = ( prepareData, jsonArray ) => {
        const formValue = {
            lang_php_array: prepareData,
            lang_json_array: jsonArray,
            iso_code: language[ 0 ]?.iso_code
        }
        return formValue
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        editLanguageData( id, prepareFormData( langPhpObj, langJsonObj ) );
        navigate( "/app/languages" );
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage( 'translation.manager.title' )} to='/app/languages' />
            <div className={"card"}>
                <div className={"card-body"}>
                    <div className={"row mb-3"}>
                        <div className={"col-md-4"}>
                            <ReactSelect isRequired
                                data={languageFileTypeOption}
                                onChange={onFileTypeChange}
                                defaultValue={languageFileTypeOption[ 0 ]}
                            />
                        </div>
                        <div className={"form-group col-sm-3 mb-7 d-flex justify-content-end offset-3 ms-auto"}>
                            <button onClick={( event ) => onSubmit( event )} className={"btn btn-primary"}>Save</button>
                        </div>
                    </div>
                    <div className='row'>
                        {FetchLung()}
                    </div>
                </div>
            </div>
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { language } = state;
    return { language }
};


export default connect( mapStateToProps, { editLanguageData, fetchLanguageData } )( EditLanguageData );
