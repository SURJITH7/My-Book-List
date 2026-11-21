// import BookCard from "../BookCard/BookCard";
// import styles from './GenreCard.module.css'

// import { useState, useEffect } from 'react';
// import axios from 'axios';


// const GenreCard = ({genre}) => {

//     const goToGenre = (genreName) => {
//         window.location = `/view/genre/${genreName}`;
//     }

//     const [bookData, setBookData] = useState(null);

//     useEffect(() =>{
//         const fetchData = async () => {
//             try{
//                 const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/genre/${encodeURIComponent(genre)}`);
//                 setBookData(response.data);
//             } catch (error){
//                 console.log("Error fetching the data:", error);
//             }
//         };
//         fetchData();
//     }, [genre]);

//     return(
//         <>
//             <div>
//                 <p className={styles.genreName} onClick={() => goToGenre(genre)}>{genre}</p>
//             </div>
//             <div className={styles.genreDiv}>
//                 {bookData && Array.isArray(bookData) && bookData.slice(0, 10).map((book, index) => (
//                     <BookCard
//                         key={index}
//                         cover={book.bookCover}
//                         author={book.bookAuthor}
//                         title={book.bookTitle}
//                     />
//                 ))}
//             </div>

//         </>
//     )

// }


// export default GenreCard;


// import BookCard from "../BookCard/BookCard";
// import styles from "./GenreCard.module.css";

// import { useState, useEffect } from "react";
// import axios from "axios";

// const GenreCard = ({ genre }) => {
//     const goToGenre = (genreName) => {
//         window.location = `/view/genre/${genreName}`;
//     };

//     const [bookData, setBookData] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(
//                     `${import.meta.env.VITE_API_URL}/api/genre/${encodeURIComponent(genre)}`
//                 );
//                 setBookData(response.data);
//             } catch (error) {
//                 console.log("Error fetching the data:", error);
//             }
//         };

//         fetchData();
//     }, [genre]);

//     return (
//         <section className={styles.genreSection}>
//             <div className={styles.genreHeader}>
//                 <h2
//                     className={styles.genreName}
//                     onClick={() => goToGenre(genre)}
//                 >
//                     {genre}
//                 </h2>

//                 <span
//                     className={styles.genreArrow}
//                     onClick={() => goToGenre(genre)}
//                 >
//                     View all <span className={styles.arrow}>→</span>
//                 </span>
//             </div>

//             <div className={styles.genreDiv}>
//                 {bookData && Array.isArray(bookData) && bookData.length > 0 ? (
//                     bookData.slice(0, 10).map((book, index) => (
//                         <div className={styles.bookItem} key={book._id || index}>
//                             <BookCard
//                                 cover={book.bookCover}
//                                 author={book.bookAuthor}
//                                 title={book.bookTitle}
//                             />
//                         </div>
//                     ))
//                 ) : (
//                     bookData && (
//                         <p className={styles.emptyMessage}>
//                             No books found in this genre.
//                         </p>
//                     )
//                 )}
//             </div>
//         </section>
//     );
// };

// export default GenreCard;








import BookCard from "../BookCard/BookCard";
import styles from "./GenreCard.module.css";

import { useState, useEffect } from "react";
import axios from "axios";

const GenreCard = ({ genre }) => {
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);

    const goToGenre = () => {
        window.location.href = `/view/genre/${encodeURIComponent(genre)}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/genre/${encodeURIComponent(genre)}`
                );

                setBookData(response.data);
            } catch (error) {
                console.error("Error fetching genre books:", error);
                setBookData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [genre]);

    return (
        <section className={styles.genreSection}>

            {/* Genre Heading */}
            <div className={styles.genreHeader}>
                <div className={styles.headingContent}>
                    <span className={styles.sectionLabel}>
                        BROWSE COLLECTION
                    </span>

                    <h2 className={styles.genreName}>
                        {genre}
                    </h2>
                </div>

                <button
                    className={styles.viewAllButton}
                    onClick={goToGenre}
                >
                    Explore all
                    <span className={styles.arrow}>→</span>
                </button>
            </div>

            {/* Book Grid */}
            {loading ? (
                <div className={styles.loadingMessage}>
                    Discovering books...
                </div>
            ) : bookData && bookData.length > 0 ? (

                <div className={styles.bookGrid}>
                    {bookData.slice(0, 10).map((book, index) => (
                        <div className={styles.bookItem} key={book.bookId || index}>
                            <BookCard
                                cover={book.bookCover}
                                author={book.bookAuthor}
                                title={book.bookTitle}
                            />
                        </div>
                    ))}
                </div>

            ) : (
                <div className={styles.emptyMessage}>
                    No books available in this collection yet.
                </div>
            )}

        </section>
    );
};

export default GenreCard;

