import React from 'react';
import {useParams} from 'react-router-dom';
import CategoryDetails from '../../Components/CategoryDetails/CategoryDetails.jsx';

const Category = () => {
    const {categoryId} = useParams();

    return(
        <CategoryDetails categoryId={categoryId}></CategoryDetails>
    );
};

export default Category;