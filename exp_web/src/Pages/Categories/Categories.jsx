import React, {useState, useEffect} from 'react';
import CustomDataGrid from '../../Components/UIControls/CustomDataGrid.jsx';
import useGetCategoriesAsync from '../../Hooks/useGetCategoriesAsync.jsx';
import useGetCategories from '../../Hooks/useGetCategories.jsx';
import  { Navigate, Link, useNavigate } from 'react-router-dom';
import CustomButton from '../../Components/UIControls/CustomButton.jsx';

const Categories = () => {
    const navigate = useNavigate();

    const refreshGrid = () => {
        console.log('grid is refreshed');
    };

    const onGridEditBtnClickEvent = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    const redirectToEditCategory = (props) => {
        return (<div>
            <CustomButton text="Edit" onClick={() => {onGridEditBtnClickEvent(props.categoryId)}}></CustomButton>
        </div>)
    };

    const {categoriesAsync, loadingStateasync} = useGetCategoriesAsync({refreshDatasourceCallback: refreshGrid});
    const {categories, loadingState} = useGetCategories();
    const columnsDirective = [
        {field: 'CategoryId', headerText: 'Id', textAlign: 'Right', width: '100'},
        {field: 'CategoryCode', headerText: 'Code', textAlign: 'Left', width: '100'},
        {field: 'CategoryName', headerText: 'Name', textAlign: 'Left', width: '100'},
        {field: 'Icon', headerText: 'Icon', textAlign: 'Left', width: '100'},
        {field: 'CategoryType', headerText: 'CategoryType', textAlign: 'Left', width: '100'},

        {field: 'Edit', headerText: 'Action', textAlign: 'Center', width: '100', template: redirectToEditCategory}
    ];

    return(<div>
        {/* <CustomDataGrid dataSource={categoriesAsync} columnsDirective={columnsDirective}></CustomDataGrid> */}
        <CustomDataGrid dataSource={categories} columnsDirective={columnsDirective}></CustomDataGrid>
    </div>);
};

export default Categories;