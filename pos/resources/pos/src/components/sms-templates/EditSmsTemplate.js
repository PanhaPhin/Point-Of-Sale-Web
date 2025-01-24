import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom'
import HeaderTitle from '../header/HeaderTitle';
import MasterLayout from '../MasterLayout';
import { getFormattedMessage } from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import SmsTemplateForm from "./SmsTemplateForm";
import { fetchSmsTemplate } from "../../store/action/smsTemplatesAction";

const EditSmsTemplate = ( props ) => {
    const { fetchSmsTemplate, smsTemplates } = props;
    const { id } = useParams();

    useEffect( () => {
        fetchSmsTemplate( id );
    }, [] );

    const itemsValue = smsTemplates && smsTemplates.length === 1 && smsTemplates.map( smsTemplate => ( {
        name: smsTemplate.attributes.template_name,
        content: smsTemplate.attributes.content,
        id: smsTemplate.id
    } ) );

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage( 'sms-template.edit.title' )} to='/app/sms-templates' />
            {smsTemplates && itemsValue.length >= 1 && <SmsTemplateForm singleSMSTemplate={itemsValue} id={id} />}
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { smsTemplates } = state;
    return { smsTemplates }
};

export default connect( mapStateToProps, { fetchSmsTemplate } )( EditSmsTemplate );

