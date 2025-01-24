import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap-v5';
import { connect } from 'react-redux';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ReactSelect from "../../shared/select/reactSelect";
import { fetchAllLanguage } from "../../store/action/languageAction";
import { updateLanguage } from '../../store/action/updateLanguageAction';
import { Tokens } from "../../constants";

const LanguageModel = (props) => {
    const { languageModel, onClickLanguageModel, updateLanguage, fetchAllLanguage, languages } = props;

    const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE)
    const [fetchAllLanguages, setFetchAllLanguages] = useState([])
    const [languageValue, setLanguageValue] = useState({
        language: ''
    })

    const [isoCodeValue, setISOCodeValue] = useState({
        isoCode: '',
        language_id: 0
    })

    const itemsValue = languages.length >= 0 && languages.map(language => {
        return (
            {
                id: language?.id,
                name: language?.attributes?.name
            }
        )
    });

    useEffect(() => {
        fetchAllLanguage()
    }, [updatedLanguage])

    useEffect(() => {
        if (updatedLanguage) {
            setFetchAllLanguages([...languages])
        }
    }, [languages])

    useEffect(() => {
        if (fetchAllLanguages.length >= 1) {
            const getLanguage = fetchAllLanguages.filter(items => items?.attributes?.iso_code.toString() === updatedLanguage.toString())
            setLanguageValue({
                language: { label: getLanguage[0]?.attributes?.name, value: getLanguage[0]?.id }
            })
        }
    }, [fetchAllLanguages])

    const onLanguageChange = (obj) => {
        setLanguageValue(inputs => ({ ...inputs, language: obj }));
    };

    useEffect(() => {
        const getLanguage = fetchAllLanguages.filter(items => items?.attributes?.name === languageValue.language.label)
        setISOCodeValue(inputs => ({ ...inputs, isoCode: getLanguage[0]?.attributes?.iso_code, language_id: getLanguage[0]?.id }))
    }, [languageValue.language])

    const onSubmit = (e) => {
        e.preventDefault();
        updateLanguage({ 'language': isoCodeValue.isoCode }, isoCodeValue.language_id);
        onClickLanguageModel(false)
    };

    return (
        <Modal show={languageModel}
            onHide={() => onClickLanguageModel(false)}
            keyboard={true}
        >
            <Form onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    onSubmit(e)
                }
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{getFormattedMessage('header.profile-menu.change-language.label')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-12 mb-5'>
                            <ReactSelect title={getFormattedMessage("language.title")}
                                defaultValue={languageValue.language}
                                value={languageValue?.language}
                                multiLanguageOption={itemsValue}
                                onChange={onLanguageChange} />
                        </div>
                    </div>
                </Modal.Body>
            </Form>
            <Modal.Footer children='justify-content-start' className='pt-0'>
                <button type="button" className="btn btn-primary m-0"
                    onClick={(event) => onSubmit(event)}>
                    {placeholderText('globally.save-btn')}</button>
                <button type="button" className="btn btn-secondary my-0 ms-5 me-0" data-bs-dismiss="modal"
                    onClick={() => onClickLanguageModel(false)}>{getFormattedMessage('globally.cancel-btn')}
                </button>
            </Modal.Footer>
        </Modal>
    )
};

const mapStateToProps = (state) => {
    const { languages } = state;
    return { languages }
};

export default connect(mapStateToProps, { fetchAllLanguage, updateLanguage })(LanguageModel);
