import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import ReactDataTable from '../../shared/table/ReactDataTable';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchSmsTemplates, activeInactiveSms } from "../../store/action/smsTemplatesAction";

const SmsTemplates = ( props ) => {
    const { totalRecord, isLoading, smsTemplates, fetchSmsTemplates, activeInactiveSms } = props;

    const navigate = useNavigate();

    const onChange = ( filter ) => {
        fetchSmsTemplates( filter, true );
    };

    const goToEditProduct = ( item ) => {
        const id = item.id
        navigate( `/app/sms-templates/${id}` )
    };

    const itemsValue = smsTemplates.length >= 0 && smsTemplates.map( smsTemplate => ( {
        name: smsTemplate.attributes.template_name,
        content: smsTemplate.attributes.content,
        is_active: smsTemplate?.attributes?.status === 0 || smsTemplate?.attributes?.status === false ? false : true,
        id: smsTemplate.id
    } ) );

    const columns = [
        {
            name: getFormattedMessage( 'supplier.table.name.column.title' ),
            selector: row => row.name,
            sortField: 'template_name',
            sortable: true,
        },
        {
            name: getFormattedMessage( "purchase.select.status.label" ),
            sortField: 'status',
            cell: row => {
                const content = row.content
                const item = content.replace( /<\/?.+?>/ig, '' );
                return (
                    <div className="d-flex align-items-center mt-4">
                        <label className="form-check form-switch form-switch-sm">
                            <input name="status" data-id="704" className="form-check-input admin-status" type="checkbox"
                                value="1" checked={row.is_active} onChange={() => onChecked( row )} />
                            <span className="switch-slider" data-checked="✓" data-unchecked="✕"></span>
                        </label>
                    </div>
                )
            },
            sortable: false,
        },
        {
            name: getFormattedMessage( "globally.input.content.label" ),
            sortField: 'content',
            cell: row => {
                const content = row.content
                const item = content.replace( /<\/?.+?>/ig, '' );
                return (
                    <div>{item}</div>
                )
            },
            sortable: true,
        },
        {
            name: getFormattedMessage( 'react-data-table.action.column.label' ),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} isDeleteMode={false} goToEditProduct={goToEditProduct} isEditMode={true} />
        }
    ];

    const onChecked = ( row ) => {
        activeInactiveSms( row.id, row );
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'sms-template.title' )} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading} totalRows={totalRecord}
                to='#/app/sms-templates/create' />
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { totalRecord, isLoading, smsTemplates } = state;
    return { totalRecord, isLoading, smsTemplates }
};

export default connect( mapStateToProps, { fetchSmsTemplates, activeInactiveSms } )( SmsTemplates );


