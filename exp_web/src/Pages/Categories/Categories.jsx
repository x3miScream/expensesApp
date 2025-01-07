import React, {useState, useEffect} from 'react';
import CustomDataGrid from '../../Components/UIControls/CustomDataGrid.jsx';
import useGetCategoriesAsync from '../../Hooks/useGetCategoriesAsync.jsx';
import useGetCategories from '../../Hooks/useGetCategories.jsx';

const refreshGrid = () => {
    console.log('grid is refreshed');
};

const Categories = () => {
    const {categoriesAsync, loadingStateasync} = useGetCategoriesAsync({refreshDatasourceCallback: refreshGrid});
    const {categories, loadingState} = useGetCategories();
    const columnsDirective = [
        // {field: 'CategoryId', headerText: 'Id', textAlign: 'Right', width: '100'},
        {field: 'CategoryCode', headerText: 'Code', textAlign: 'Left', width: '100'},
        {field: 'CategoryName', headerText: 'Name', textAlign: 'Left', width: '100'},
        {field: 'Icon', headerText: 'Icon', textAlign: 'Left', width: '100'},
        {field: 'CategoryType', headerText: 'CategoryType', textAlign: 'Left', width: '100'}
    ];

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     console.log(message);

    //     if(message){
    //         await sendMessage(message);
    //         setMessage('');
    //     }
    // };

    return(<div>
        {/* <CustomDataGrid dataSource={categoriesAsync} columnsDirective={columnsDirective}></CustomDataGrid> */}
        <CustomDataGrid dataSource={categories} columnsDirective={columnsDirective}></CustomDataGrid>
    </div>);
};

export default Categories;