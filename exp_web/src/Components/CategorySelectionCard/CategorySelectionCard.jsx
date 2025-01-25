import React, {useState} from 'react';
import './CategorySelectionCard.css';

const CategorySelectionCard = (props) => {
    const {category, onClick} = props;

    return(<div className='category-selection-card' onClick={onClick}>
        <div className='category-selection-icon'>
            <img></img>
        </div>
        <div className='category-selection-info'>
            {category.categoryName}
        </div>
    </div>);
};

export default CategorySelectionCard;