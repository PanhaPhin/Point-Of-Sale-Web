import React, {useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {useNavigate} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import {fetchCustomers} from '../../store/action/customerAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import DeleteCustomer from './DeleteCustomer';
import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedDate, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ImportCustomersModel from './ImportCustomersModel';

const Customers = (props) => {
    const {fetchCustomers, customers, totalRecord, isLoading, allConfigData} = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const navigate = useNavigate();
    const [importCustomers, setImportCustomers] = useState(false);
    const handleClose = () => {
        setImportCustomers(!importCustomers);
    };
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchCustomers(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id
        navigate(`/app/customers/edit/${id}`)
    };

    const itemsValue = customers.length >= 0 && customers.map(customer => ({
        date: getFormattedDate(customer.attributes.created_at, allConfigData && allConfigData),
        time: moment(customer.attributes.created_at).format('LT'),
        name: customer.attributes.name,
        email: customer.attributes.email,
        phone: customer.attributes.phone,
        country: customer.attributes.country,
        city: customer.attributes.city,
        id: customer.id
    }));

    const columns = [
        {
            name: getFormattedMessage('customer.title'),
            selector: row => row.name,
            sortField: 'name',
            sortable: true,
            cell: row => {
                return <div>
                    <div className='text-primary'>{row.name}</div>
                    <div>{row.email}</div>
                </div>
            }
        },
        {
            name: getFormattedMessage('globally.input.phone-number.label'),
            selector: row => row.phone,
            sortField: 'phone',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.react-table.column.created-date.label'),
            selector: row => row.date,
            sortField: 'created_at',
            sortable: true,
            cell: row => {
                return (
                    <span className='badge bg-light-info'>
                        <div className='mb-1'>{row.time}</div>
                        {row.date}
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={goToEditProduct} isEditMode={true}
                                       onClickDeleteModel={onClickDeleteModel}/>
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('customers.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                            ButtonValue={getFormattedMessage('customer.create.title')} totalRows={totalRecord}
                            buttonImport={true}  goToImport={handleClose} importBtnTitle={'customers.import.title'}
                            to='#/app/customers/create'/>
            <DeleteCustomer onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete}/>
            {importCustomers && < ImportCustomersModel  handleClose={handleClose} show={importCustomers}/> }
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {customers, totalRecord, isLoading, allConfigData} = state;
    return {customers, totalRecord, isLoading, allConfigData}
};

export default connect(mapStateToProps, {fetchCustomers})(Customers);

