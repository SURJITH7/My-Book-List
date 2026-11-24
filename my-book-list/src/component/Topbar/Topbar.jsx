
// import styles from './Topbar.module.css';
// import { useState, useEffect } from "react";

// import MyBookListImage from './MyBookList.png';
// import ListImage from './list.png';
// import LogOutImage from './logout.svg';

// import { signOut } from 'firebase/auth';
// import { auth } from '../../../Firebase/firebase';


// const Topbar = ({user}) => {
//     const [userName, setUserName] = useState('');

//     useEffect(() => {
//         if (user?.email) {
//             fetch(`${import.meta.env.VITE_API_URL}/db/get/username`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email: user.email })
//             })
//             .then(response => {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     return response.text().then(text => {
//                         console.log('Received:', text);
//                         throw new Error('Error retrieving username');
//                     });
//                 }
//             })
//             .then(data => {
//                 setUserName(data.userName);
//             })
//             .catch(error => {
                
//                 console.error('Error retrieving username:', error);
//             });
//         }
//     }, [user?.email]);
    



//     const goHome = () => {
//         window.location = "/home";
//     }

//     const [searchBookQuery, setSearchBook] = useState('');

//     const handleChange = (event) =>{
//         setSearchBook(event.target.value);
//     }
//     const searchBook = () =>{
//         window.location = `/search/${searchBookQuery}`;
//         console.log(searchBookQuery);
//     }

//     const handleSignOut = () =>{
//             signOut(auth).then(()=>{
//                 window.location = '/';
//                 console.log("Signned Out")
//             }).catch((error)=>console.log(error));
//     }

//     return(
//         <>
//         <div className={styles.topBar}>
//             <div className={styles.topBarSite}>
//                 <img src={MyBookListImage} id="goHome" alt="My Book List" onClick={goHome}/>
//             </div>
//             <div className={styles.profileBar}>
//                 <div className={styles.searchBar}>
//                     <input type="text" value={searchBookQuery} onChange={handleChange} placeholder="search"/>
//                     <button id="searchButton" onClick={searchBook}></button>
//                 </div>
//                 <img src={LogOutImage} alt="LogOut" onClick={handleSignOut}/>
//                 {/* <img src={ListImage} alt="ListImage"/> */}
//                 <div className={styles.userName}>
//                     <p>{userName}</p>
//                 </div>
//             </div>
//         </div>
//         <div>
//             <nav className={styles.navBar}>
//                 <div className={styles.navDiv}> 
//                     <ul>
//                         <li><a href="/home">Books</a></li>
//                         <li><a href="/community">Community</a></li>
//                         {/* <li><a href="#">Industry</a></li> */}
//                     </ul>
//                 </div>
//             </nav>
//         </div>
        
//         </>
//     );
// }

// export default Topbar;






import styles from './Topbar.module.css';
import { useState, useEffect } from 'react';

import MyBookListImage from './MyBookList.png';
import LogOutImage from './logout.svg';

import { signOut } from 'firebase/auth';
import { auth } from '../../../Firebase/firebase';

const Topbar = ({ user }) => {
    const [userName, setUserName] = useState('');
    const [searchBookQuery, setSearchBook] = useState('');

    // Fetch username
    useEffect(() => {
        let isMounted = true;

        const fetchUsername = async () => {
            if (!user?.email) {
                setUserName('');
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/db/get/username`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: user.email })
                    }
                );

                if (!response.ok) {
                    throw new Error(`Username request failed: ${response.status}`);
                }

                const data = await response.json();

                if (isMounted) {
                    setUserName(data.userName || '');
                }
            } catch (error) {
                console.error('Error retrieving username:', error);
            }
        };

        fetchUsername();

        return () => {
            isMounted = false;
        };
    }, [user?.email]);

    // Navigate home
    const goHome = () => {
        window.location.href = '/home';
    };

    // Search books
    const searchBook = (event) => {
        event.preventDefault();

        const query = searchBookQuery.trim();

        if (!query) return;

        window.location.href = `/search/${encodeURIComponent(query)}`;
    };

    // Logout
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.topBar}>
                <button
                    className={styles.logoButton}
                    onClick={goHome}
                    aria-label="Go to MyBookList home"
                >
                    <img
                        src={MyBookListImage}
                        alt="MyBookList"
                        className={styles.logo}
                    />
                </button>

                <div className={styles.profileBar}>
                    <form className={styles.searchBar} onSubmit={searchBook}>
                        <input
                            type="search"
                            value={searchBookQuery}
                            onChange={(event) =>
                                setSearchBook(event.target.value)
                            }
                            placeholder="Search books..."
                            aria-label="Search books"
                        />

                        <button type="submit" aria-label="Search">
                            <span className={styles.searchIcon}>⌕</span>
                        </button>
                    </form>

                    <div className={styles.userSection}>
                        <span className={styles.userName}>
                            {userName || 'My Account'}
                        </span>

                        <button
                            className={styles.logoutButton}
                            onClick={handleSignOut}
                            aria-label="Log out"
                            title="Log out"
                        >
                            <img src={LogOutImage} alt="" />
                        </button>
                    </div>
                </div>
            </div>

            <nav className={styles.navBar}>
                <div className={styles.navContent}>
                    <a href="/home">Books</a>
                    <a href="/community">Community</a>
                </div>
            </nav>
        </header>
    );
};

export default Topbar;
