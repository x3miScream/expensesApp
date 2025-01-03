import React from 'react'
import CustomDataGrid from '../Components/CustomDataGrid';
import useGetTransactions from '../Hooks/useGetTransactions.jsx';

const refreshGrid = () => {
    console.log('grid is refreshed');
};

const Transactions = () => {
    const {transactions, loadingState} = useGetTransactions();

    const columnsDirective = [
        {field: 'CategoryId', headerText: 'Id', textAlign: 'Right', width: '100'},
        {field: 'CategoryCode', headerText: 'Code', textAlign: 'Left', width: '100'},
        {field: 'CategoryName', headerText: 'Name', textAlign: 'Left', width: '100'},
        {field: 'Icon', headerText: 'Icon', textAlign: 'Left', width: '100'},
        {field: 'CategoryType', headerText: 'CategoryType', textAlign: 'Left', width: '100'},

        {field: 'TransactionId', headerText: 'TransactionId', textAlign: 'Left', width: '100'},
        {field: 'TransactionDate', headerText: 'TransactionDate', textAlign: 'Left', width: '100'},
        {field: 'TransactionNode', headerText: 'TransactionNode', textAlign: 'Left', width: '100'}, 
        {field: 'TransactionAmount', headerText: 'TransactionAmount', textAlign: 'Left', width: '100'}
    ];


    return(<div>
        Hello from transactions

        <CustomDataGrid dataSource={transactions} columnsDirective={columnsDirective}></CustomDataGrid>
    </div>);
};

export default Transactions