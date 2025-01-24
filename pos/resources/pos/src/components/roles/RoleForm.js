import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {editRole} from '../../store/action/roleAction';
import {getFormattedMessage, placeholderText} from "../../shared/sharedMethod";

const RoleForm = (props) => {
    const {addRolesData, singleRole, editRole, permissionsArray, id} = props;
    const navigate = useNavigate();
    const [permissions, setNewPer] = useState(permissionsArray);
    const [saveButtonEnable, setSaveButtonEnable] = useState('')
    const [allChecked, setAllChecked] = useState( false)
    const [rolesValue, setRolesValue] = useState({
        name: '',
        permissions: []
    });

    const [errors, setErrors] = useState({
        name: '',
        permissions: ''
    });

    useEffect(()=> {
        setRolesValue(
            {
                name:singleRole ? singleRole.name : "",
                permissions: singleRole ? singleRole.permissions : ''
            }
        )
    }, [singleRole])

    useEffect(() => {
        const permissionsArrays = permissions.filter(perm => perm.selected === true).map(((rodeId) => rodeId.id));
        setSaveButtonEnable(permissionsArrays);
        setAllChecked(permissions.every(item => item.selected));
    }, [permissions, allChecked]);

    const disabled = saveButtonEnable.length === 0 ? true : singleRole && singleRole.name === rolesValue.name && JSON.stringify(singleRole.permissions.map((item)=>item.id)) === JSON.stringify(saveButtonEnable);

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!rolesValue['name']) {
            errorss['name'] = getFormattedMessage("role.input.name.validate.label");
        } else if ((rolesValue['name'] && rolesValue['name'].length > 50)) {
            errorss['name'] = getFormattedMessage("role.input.name.valid.validate.label");
        } else if (!saveButtonEnable) {
            errorss['permissions'] = 'Please select permissions';
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const handleValidations = () => {
        let errorss = {};
        let isValid = false;
        if (!rolesValue['name']) {
            errorss['name'] = getFormattedMessage("globally.input.name.label");
        } else if(!rolesValue['permissions']) {
            errorss['permissions'] = 'Please select permissions';
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (event) => {
        event.preventDefault();
        setRolesValue(inputs => ({...inputs, [event.target.name]: event.target.value}))
        setErrors('');
    };

    const handleChanged = (event) => {
        let itemName = event.target.name;
        let checked = event.target.checked;
        if (itemName === "all_check") {
            setAllChecked(!allChecked)
            setNewPer(permissions.map(item => ({ ...item, selected: checked }))) ;
        } else {
            setNewPer(permissions.map(item => item.name === itemName ? ({ ...item, selected: checked }) : item));
        }
    };

    const onSubmit = (event, rolesValue) => {
        event.preventDefault();
        const Valid = handleValidation();
        if (Valid) {
            const permissionsArrays = permissions.filter(perm => perm.selected === true).map(((rodeId) => rodeId.id))
            rolesValue.permissions = permissionsArrays;
            setRolesValue(rolesValue);
            addRolesData(rolesValue);
            setSaveButtonEnable(permissionsArrays);
        }
    };

    const onEdit = (event) => {
        event.preventDefault();
        const Valid = handleValidations();
        if (Valid && !disabled) {
            const permissionsArrays = permissions.filter(perm => perm.selected === true).map(((rodeId) => rodeId.id))
            rolesValue.permissions = permissionsArrays;
            setRolesValue(rolesValue);
            editRole(id, rolesValue, navigate);
        }
    };

    return (
        <div className='container-fluid pt-10'>
            <div className='card custom-card p-5 bg-white'>
                <Form className='m-4'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <Form.Group className='mb-5 form-group'>
                                <Form.Label className='form-label fs-6 fw-bolder text-gray-700 mb-3'>{getFormattedMessage("globally.input.name.label")}: </Form.Label>
                                <span className='required'/>
                                <Form.Control type='text' name='name' placeholder={placeholderText("globally.input.name.placeholder.label")}
                                              className='form-control-solid'
                                              autoFocus={true}
                                              onChange={(event) => onChangeInput(event)}
                                              value={rolesValue.name}/>
                                <span className='text-danger'>{errors['name'] ? errors['name'] : null}</span>
                            </Form.Group>
                        </div>
                        <div>
                            <Form.Group className='mb-5 form-group'>
                                <div className='d-flex col-md-12 flex-wrap align-items-center'>
                                <Form.Label
                                    className='form-label fs-6 fw-bolder text-gray-700 mb-0'>{getFormattedMessage("role.input.permission.label")}: </Form.Label>
                                <span className='required'/>
                                <div className='d-flex col-md-6 flex-wrap ps-5'>
                                      <div className="col-md-8">
                                          <label
                                              className='form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label'
                                              >
                                              <input type='checkbox' checked={allChecked}
                                                     name='all_check'
                                                     onChange={(event) => handleChanged(event)}
                                                     className='me-3 form-check-input cursor-pointer'/>
                                              <div className='control__indicator'/>
                                              {getFormattedMessage("role.select.all-permission.label")}
                                          </label>
                                      </div>
                                </div>
                                </div>
                                <div className='d-flex col-md-12 flex-wrap'>
                                    {
                                        permissions && permissions.map((permission, index) => {
                                            return (
                                                <div className="col-md-4">
                                                    <label
                                                        className='form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label'
                                                        key={index}>
                                                        <input type='checkbox' checked={permissions[index].selected}
                                                               name={permission.name}
                                                               value={permission.name}
                                                               onChange={(event) => handleChanged(event, index)}
                                                               className='me-3 form-check-input cursor-pointer'/>
                                                        <div className='control__indicator'/>
                                                        {permission.name}
                                                    </label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <span
                                    className='text-danger'>{errors['permissions'] ? errors['permissions'] : null}</span>
                            </Form.Group>
                        </div>
                        <div className='d-flex mt-5'>
                            {singleRole ?
                                <div onClick={(event) => onEdit(event)}>
                                    <input className='btn btn-primary me-3' type='submit' value={placeholderText("globally.save-btn")}
                                           disabled={disabled}
                                    />
                                </div>
                                :
                                <div onClick={(event) => onSubmit(event, rolesValue)}>
                                    <input className='btn btn-primary me-3' type='submit' value={placeholderText("globally.save-btn")}
                                           disabled={!rolesValue.name || !(saveButtonEnable.length !== 0)}/>
                                </div>
                            }
                            <Link to='/app/roles'
                                  className='btn btn-light btn-active-light-primary me-3'>{getFormattedMessage("globally.cancel-btn")}</Link>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )
};

export default connect(null, {editRole})(RoleForm);
