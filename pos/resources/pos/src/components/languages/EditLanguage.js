import React from 'react';
import {connect} from 'react-redux';
import LanguageForm from './LanguageForm';
import { getFormattedMessage } from '../../shared/sharedMethod';

const EditLanguage = (props) => {
    const {handleClose, show, language} = props;

    return (
        <>
            {language &&
                <LanguageForm handleClose={handleClose} show={show} singleLanguage={language}
                               title={getFormattedMessage('language.edit.title')}/>
            }
        </>
    )
};

export default connect(null)(EditLanguage);

