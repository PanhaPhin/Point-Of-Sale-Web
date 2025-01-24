import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import Form from 'react-bootstrap/Form';
import {getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ModelFooter from '../../shared/components/modelFooter';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {UpdateEmailTemplate} from "../../store/action/emailTemplatesAction";

const EmailTemplateForm = (props) => {
    const {id, singleEmailTemplate, UpdateEmailTemplate} = props;
    const navigate = useNavigate();

    const [emailTemplateValue, setEmailTemplateValue] = useState({
        name: singleEmailTemplate ? singleEmailTemplate[0].name : '',
        content: singleEmailTemplate ? singleEmailTemplate[0].content : ''
    });

    const [errors, setErrors] = useState({
        name: '',
        content: ""
    });

    const disabled = singleEmailTemplate && singleEmailTemplate[0].content === emailTemplateValue.content

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!emailTemplateValue['name']) {
            errorss['name'] = getFormattedMessage('globally.input.name.validate.label');
        } else if (!emailTemplateValue['content']) {
            errorss['content'] = "content must be required";
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setEmailTemplateValue(inputs => ({...inputs, [e.target.name]: e.target.value}))
        setErrors('');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (singleEmailTemplate && valid) {
            if (!disabled) {
                UpdateEmailTemplate(id, emailTemplateValue, navigate);
            }
        }
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
    ];

    const handleContentChange = (content, delta, source, editor) => {
        setEmailTemplateValue(inputs => ({...inputs, content: content}))
    }

    return (
        <div className='card'>
            <div className='card-body'>
                <Form>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage('globally.input.name.label')}:
                            </label>
                            <span className='required'/>
                            <input type='text' name='name'
                                   readOnly={true}
                                   placeholder={placeholderText('globally.input.name.placeholder.label')}
                                   className='form-control disabled' autoFocus={true}
                                   onChange={(e) => onChangeInput(e)}
                                   value={emailTemplateValue.name}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['name'] ? errors['name'] : null}</span>

                            <label
                                className='form-label'>{getFormattedMessage('globally.input.content.label')}: </label>
                            <ReactQuill theme="snow" formats={formats} value={emailTemplateValue.content}
                                        onChange={handleContentChange}/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['content'] ? errors['content'] : null}</span>

                        </div>
                        <div className='col-md-6 mb-3 '>
                            <div className="email-template-padding">
                                <label
                                    className='form-label text-decoration-underline'>{getFormattedMessage('email-content-variables.title')}
                                    : </label>
                                {/*<textarea name='content' className='form-control' rows='3'*/}
                                {/*          placeholder={placeholderText('globally.input.content.label')}*/}
                                {/*          onChange={(e) => onChangeInput(e)}*/}
                                {/*          value={emailTemplateValue.content || ''}/>*/}
                                <ul className="text-gray-600">
                                    <li>
                                        {`{customer_name}`}
                                    </li>
                                    <li>
                                        {`{sales_id}`}
                                    </li>
                                    <li>
                                        {`{sales_date}`}
                                    </li>
                                    <li>
                                        {`{sales_amount}`}
                                    </li>
                                    <li>
                                        {`{paid_amount}`}
                                    </li>
                                    <li>
                                        {`{due_amount}`}
                                    </li>
                                    <li>
                                        {`{app_name}`}
                                    </li>
                                </ul>
                            </div>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['content'] ? errors['content'] : null}</span>
                        </div>
                        <ModelFooter onEditRecord={singleEmailTemplate} onSubmit={onSubmit} editDisabled={disabled}
                                     link='/app/email-templates' addDisabled={!emailTemplateValue.name}/>
                    </div>
                </Form>
            </div>
        </div>
    )
};

export default connect(null, {UpdateEmailTemplate})(EmailTemplateForm);
