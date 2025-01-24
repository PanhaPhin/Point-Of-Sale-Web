import React, {useState} from 'react';
import {Button} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {addLanguage} from '../../store/action/languageAction';
import LanguageForm from './LanguageForm';
import {getFormattedMessage} from "../../shared/sharedMethod";

const CreateBaseUnits = (props) => {
    const {addLanguage} = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    const addLanguageData = (productValue) => {
        addLanguage(productValue);
    };

    return (
        <div className='text-end w-sm-auto'>
            <Button variant='primary mb-lg-0 mb-4' onClick={handleClose}>
                {getFormattedMessage('language.create.title')}
            </Button>
            <LanguageForm addLanguageData={addLanguageData} handleClose={handleClose} show={show}
                           title={getFormattedMessage('language.create.title')}/>
        </div>

    )
};

export default connect(null, {addLanguage})(CreateBaseUnits);
