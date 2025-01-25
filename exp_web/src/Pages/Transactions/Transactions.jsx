import React from 'react'
import CustomDataGrid from '../../Components/UIControls/CustomDataGrid.jsx';
import useGetTransactions from '../../Hooks/useGetTransactions.jsx';
import CustomButton from '../../Components/UIControls/CustomButton.jsx';
import  { useNavigate } from 'react-router-dom';
import './Transactions.css';

const refreshGrid = () => {
    console.log('grid is refreshed');
};

const Transactions = () => {
    const navigate = useNavigate();

    const onGridEditBtnClickEvent = (transactionId) => {
        navigate(`/transaction/${transactionId}`);
    };

    const {transactions, loadingState} = useGetTransactions();

    const redirectToEditButtonColumnTemplate = (props) => {
        return (<div>
            <CustomButton text="Edit" onClick={() => {onGridEditBtnClickEvent(props.transactionId)}}></CustomButton>
            {/* <Link to={`/transaction/${props.transactionId}`}>Edit</Link> */}
          </div>)
    };

    const columnsDirective = [
        {field: 'TransactionId', headerText: 'TransactionId', textAlign: 'Left', width: '100', visible: false},
        {field: 'TransactionDate', headerText: 'Transaction Date', textAlign: 'Left', width: '100', type: "date", format: "dd MMM yyyy" },
        {field: 'CategoryName', headerText: 'Category', textAlign: 'Left', width: '100'},
        {field: 'SubCategoryName', headerText: 'Sub Category', textAlign: 'Left', width: '100'},
        {field: 'Amount', headerText: 'Amount', textAlign: 'Left', width: '100', format: 'C2'},

        {field: 'Note', headerText: 'TransactionNode', textAlign: 'Left', width: '100'}, 

        {field: 'CategoryId', headerText: 'CategoryId', textAlign: 'Right', width: '100', visible: false},
        {field: 'CategoryCode', headerText: 'CategoryCode', textAlign: 'Left', width: '100', visible: false},

        {field: 'SubCategoryId', headerText: 'SubCategoryId', textAlign: 'Right', width: '100', visible: false},
        {field: 'SubCategoryCode', headerText: 'SubCategoryCode', textAlign: 'Left', width: '100', visible: false},

        {field: 'Icon', headerText: 'Icon', textAlign: 'Left', width: '100'},
        {field: 'CategoryType', headerText: 'CategoryType', textAlign: 'Left', width: '100'},

        {field: 'Edit', headerText: 'Action', textAlign: 'Center', width: '100', template: redirectToEditButtonColumnTemplate}
    ];


    return(<div>
        Transactions

        <div className='transactions-listing-page'>
            <CustomDataGrid dataSource={transactions} columnsDirective={columnsDirective}></CustomDataGrid>
        </div>
    </div>);
};

export default Transactions