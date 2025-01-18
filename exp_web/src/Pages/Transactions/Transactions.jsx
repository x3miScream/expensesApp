import React from 'react'
import CustomDataGrid from '../../Components/UIControls/CustomDataGrid.jsx';
import useGetTransactions from '../../Hooks/useGetTransactions.jsx';
import CustomButton from '../../Components/UIControls/CustomButton.jsx';
import  { Navigate, Link, useNavigate } from 'react-router-dom';
// import { Link } from "react-router";

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
        {field: 'TransactionId', headerText: 'TransactionId', textAlign: 'Left', width: '100'},
        {field: 'TransactionDate', headerText: 'TransactionDate', textAlign: 'Left', width: '100'},
        {field: 'Note', headerText: 'TransactionNode', textAlign: 'Left', width: '100'}, 
        {field: 'Amount', headerText: 'TransactionAmount', textAlign: 'Left', width: '100'},

        {field: 'CategoryId', headerText: 'Id', textAlign: 'Right', width: '100'},
        {field: 'CategoryCode', headerText: 'Code', textAlign: 'Left', width: '100'},
        {field: 'CategoryName', headerText: 'Name', textAlign: 'Left', width: '100'},
        {field: 'Icon', headerText: 'Icon', textAlign: 'Left', width: '100'},
        {field: 'CategoryType', headerText: 'CategoryType', textAlign: 'Left', width: '100'},

        {field: 'Edit', headerText: 'Action', textAlign: 'Center', width: '100', template: redirectToEditButtonColumnTemplate}
    ];


    return(<div>
        Hello from transactions

        <CustomDataGrid dataSource={transactions} columnsDirective={columnsDirective}></CustomDataGrid>
    </div>);
};

export default Transactions