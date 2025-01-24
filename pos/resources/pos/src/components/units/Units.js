import React, {useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import {fetchUnits} from '../../store/action/unitsAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import DeleteUnits from './DeleteUnits';
import CreateUnits from './CreateUnits';
import EditUnits from './EditUnits';
import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedDate, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const Units = (props) => {
    const {fetchUnits, units, totalRecord, isLoading, allConfigData} = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [unit, setUnit] = useState();

    const handleClose = (item) => {
        setEditModel(!editModel);
        setUnit(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchUnits(filter, true);
    };

    const itemsValue = units.length >= 0 && units.map(unit => {
        return (
            {
                date: getFormattedDate(unit.attributes.created_at, allConfigData && allConfigData),
                time: moment(unit.attributes.created_at).format('LT'),
                name: unit.attributes.name,
                short_name: unit.attributes.short_name,
                base_unit: unit.attributes.base_unit_name?.name ? unit.attributes.base_unit_name?.name : 'N/A',
                id: unit.id
            }
        )
    });

    const columns = [
        {
            name: getFormattedMessage('globally.input.name.label'),
            selector: row => row.name,
            sortField: 'name',
            sortable: true,
        },
        {
            name: getFormattedMessage('unit.modal.input.short-name.label'),
            sortField: 'short_name',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-info'>
                            <span>{row.short_name}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('unit.modal.input.base-unit.label'),
            sortField: 'base_unit',
            sortable: true,
            cell: row => {
                return (
                    row.base_unit  &&
                    <span className='badge bg-light-success'>
                        <span>{row.base_unit}</span>
                    </span>
                )
            }
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
                        <div>{row.date}</div>
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
            cell: row => <ActionButton item={row} goToEditProduct={handleClose} isEditMode={true}
                                       onClickDeleteModel={onClickDeleteModel}/>
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('units.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                            AddButton={<CreateUnits/>} title={getFormattedMessage('unit.modal.input.base-unit.label')}
                            totalRows={totalRecord} isShowFilterField isUnitFilter/>
            <EditUnits handleClose={handleClose} show={editModel} unit={unit}/>
            <DeleteUnits onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                         onDelete={isDelete}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {units, totalRecord, isLoading, allConfigData} = state;
    return {units, totalRecord, isLoading, allConfigData}
};

export default connect(mapStateToProps, {fetchUnits})(Units);

