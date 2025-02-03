import React, {useState, useEffect} from 'react';
import CustomTextBox from '../UIControls/CustomTextBox.jsx';
import CustomLabel from '../UIControls/CustomLabel.jsx';
import CustomDropDown from '../UIControls/CustomDropDown.jsx';
import CustomButton from '../UIControls/CustomButton.jsx';
import CustomDataGrid from '../UIControls/CustomDataGrid';
import useGetSubCategories from '../../Hooks/useGetSubCategories';

import useGetCategoryDetails from '../../Hooks/useGetCategoryDetails';
import useSaveCategory from '../../Hooks/useSaveCategory.jsx';
import useGetDropDownListData from '../../Hooks/useGetDropDownListData.jsx';
import  { Navigate, Link, useNavigate } from 'react-router-dom';

import './CategoryDetails.css';

const CategoryDetails = (props) => {
    const {categoryId} = props;
    const [categoryData, setCategoryData] = useState({
        categoryId: (categoryId != undefined ? parseInt(categoryId) : 0)
    });

    const columnsDirective = [
        {field: 'subCategoryId', headerText: 'Id', textAlign: 'Right', width: '100', visible: false},
        {field: 'subCategoryCode', headerText: 'Code', textAlign: 'Left', width: '100'},
        {field: 'subCategoryName', headerText: 'Name', textAlign: 'Left', width: '100'}
    ];

    const toolbarOptions = ['Add', 'Delete', 'Cancel'];

    const [subCategoriesData, setSubCategoriesData] = useState([]);
    const [categoryTypeDataSource, setCategoryTypeDataSource] = useState([]);

    const navigate = useNavigate();
    const {getCategoryDetailsLoadingState, getCategoryDetails} = useGetCategoryDetails();
    const {ddlLoadingState, getDropDownList} = useGetDropDownListData();
    const {saveCategoryLoadingState, createCategory, updateCategory, deleteCategory} = useSaveCategory();
    const {getSubCategoriesLoadingState, getSubCategories} = useGetSubCategories();
    
    const getDropDownLists = async () => {
        await getDropDownList('CategoryType', setCategoryTypeDataSource);
    };

    const onRedirectToCategoriesClick = async () => {
        navigate(`/categories`);
    };

    const checkSub = async () => {
        console.log(subCategoriesData);
    };

    const onSaveCategoryClick = async () => {
        if(categoryData.categoryId == 0)
            await createCategory({...categoryData, callBack: onRedirectToCategoriesClick});
        else
            await updateCategory({...categoryData, callBack: onRedirectToCategoriesClick});
    };

    const onDeleteCategoryClick = async () => {};

    const initializePage = async () => {
        await getCategoryDetails(categoryId, setCategoryData);
        await getSubCategories(categoryId, setSubCategoriesData);
        await getDropDownLists();
    };

    useEffect(() => {
        initializePage();
    }, []);

    return(<div className='category-page-container'>
        {
            (getCategoryDetailsLoadingState ? 'Loading...':
                <div className='category-details-container'>
                    <CustomLabel>Category Code</CustomLabel>
                    <CustomTextBox value={categoryData.categoryCode}
                        onChange={(e) => setCategoryData({...categoryData, categoryCode: e.target.value})}
                    ></CustomTextBox>

                    <CustomLabel>Category Name</CustomLabel>
                    <CustomTextBox value={categoryData.categoryName}
                        onChange={(e) => setCategoryData({...categoryData, categoryName: e.target.value})}
                    ></CustomTextBox>

                    <CustomLabel>Category Type</CustomLabel>
                    <CustomDropDown id='categoryTypeDDL' dataSource={categoryTypeDataSource} value={categoryData.categoryType}
                    onChange={(e) => {setCategoryData({...categoryData, categoryType: e.target.value})}}></CustomDropDown>
                </div>
            )
        }

        <div className='subcategories-grid-container'>
            <CustomLabel>Sub Categories</CustomLabel>
            <CustomDataGrid dataSource={subCategoriesData} columnsDirective={columnsDirective} allowEditing={true} allowAdding={true} toolbarOptions={toolbarOptions}></CustomDataGrid>
        </div>

        <div className='category-details-buttons-container'>
            {(saveCategoryLoadingState? 'Saving' : '')}
            <CustomButton text="Save" onClick={onSaveCategoryClick}></CustomButton>
            <CustomButton text="check sub" onClick={checkSub}></CustomButton>
            {categoryData.categoryId == 0 ? '' : <CustomButton text="Delete" onClick={onDeleteCategoryClick}></CustomButton>}
            <CustomButton text="Back" onClick={onRedirectToCategoriesClick}></CustomButton>
        </div>
    </div>);
};

export default CategoryDetails;