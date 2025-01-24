import React from 'react';
import { connect } from 'react-redux';
import UserForm from './UserForm';
import { addUser } from '../../store/action/userAction';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import { Filters } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { getFormattedMessage } from '../../shared/sharedMethod';

const CreateUser = ( props ) => {
    const { addUser } = props;
    const navigate = useNavigate();
    const addUserData = ( formValue ) => {
        addUser( formValue, navigate, Filters.OBJ );
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage( 'user.create.title' )} to='/app/users' />
            <UserForm addUserData={addUserData} />
        </MasterLayout>
    );
}

export default connect( null, { addUser } )( CreateUser );
