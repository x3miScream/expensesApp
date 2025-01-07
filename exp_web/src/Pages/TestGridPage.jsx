import CustomDataGrid from '../Components/UIControls/CustomDataGrid.jsx';
import CustomTextBox from '../Components/UIControls/CustomTextBox.jsx';

var TestGridPage = () => {
    return(
        <div>
            <CustomDataGrid></CustomDataGrid>
            <br></br>
            <CustomTextBox value='some custom value' placeHolder='custom place holder'></CustomTextBox>
        </div>
    )
};

export default TestGridPage;