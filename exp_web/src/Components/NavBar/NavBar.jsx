import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import CustomButton from '../UIControls/CustomButton.jsx';
import './NavBar.css';
import useLogout from '../../Hooks/useLogout.jsx';

const NavBar = () => {
    const {loadingState, logout} = useLogout();
    const [isClicked, setIsClicked] = useState(false);
    const [button, setButton] = useState(false);
    const [menuLinks, setMenuLinks] = useState([
        {title: 'Categories', path: 'categories', isShowAtMenu: true},
        {title: 'Transactions', path: 'transactions', isShowAtMenu: true}
    ]);

    const getMenus = async() => {
        let url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Menus`;;
        let verb = 'GET';

        const fetchObject = {
            method: verb,
            headers: {'Content-Type': "application/json"},
            credentials: 'include',
            mode: 'cors',
        };

        try{
            const res = await fetch(url, fetchObject);

            const data = await res.json();

            if(data.error){
                throw new Error(data.error);
            }
            else{
                setMenuLinks(data);
            }
        }
        catch(error)
        {
            console.log(error);
        }
    };

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const closeMobileMenu = () => {
        setIsClicked(false);
    };

    const showButton = () => {
        if(window.innerWidth <= 960) 
        {
            setButton(false);
        }
        else
        {
            setButton(false);
        }
    };

    useEffect(() => {
        showButton();
        getMenus();
    }, []);

    window.addEventListener('resize', showButton);

    return(
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={isClicked ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                        {menuLinks.length == 0 ? '' :
                            <ul className={isClicked ? 'nav-menu active' : 'nav-menu'}>
                                {menuLinks.map((item, index) => {return item.isShowAtMenu ? <li key={index} className='nav-item'><Link to={item.path} className='nav-links' onClick={closeMobileMenu}>{item.title}</Link></li> : ''})}
                                {/* <li className='nav-item'>
                                    <Link to='/sing-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                                        Sing Up
                                    </Link>
                                </li> */}
                                
                            </ul>
                        }

                    {button && <CustomButton buttonStyle='btn--outline' text='Sing Up'></CustomButton>}
                    {!button && <CustomButton te buttonStyle='btn--outline' text='Sign Out' onClick={logout}></CustomButton>}
                </div>
            </nav>
        </>
    )
}

export default NavBar;