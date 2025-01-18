import React from 'react';
import {useParams} from 'react-router-dom';

const Category = () => {
    const {categoryId} = useParams();

    return(<div>
        {`Category Id: ${categoryId}`}
    </div>);
};

export default Category;