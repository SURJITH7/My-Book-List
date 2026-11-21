// import styles from './BookCard.module.css';

// const BookCard = ({ cover, author, title }) => {
//     const viewBook = () =>{ 
//         window.location = `/view/book/${title}`
//     }

//     const viewAuthorBooks = (author) => {
//         window.location = `/view/author/${author}`
//     }
    

//     return (
//         <div className={styles.bookCard}>
//             <div className={styles.bookCardDiv}>
//                 <div className={styles.cover}>
//                     <img src={cover} alt="Book cover" onClick={viewBook}/>
//                 </div>
//                 <div className={styles.author} onClick={ () => viewAuthorBooks(author)}>
//                     <p>{author}</p>
//                 </div>
//                 <div className={styles.title}>
//                     <p onClick={viewBook}>{title}</p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default BookCard;



import styles from './BookCard.module.css';

const BookCard = ({ cover, author, title }) => {

    const viewBook = () => {
        window.location.href = `/view/book/${encodeURIComponent(title)}`;
    };

    const viewAuthorBooks = () => {
        window.location.href = `/view/author/${encodeURIComponent(author)}`;
    };

    return (
        <article className={styles.bookCard}>

            <div className={styles.cover} onClick={viewBook}>
                <img
                    src={cover}
                    alt={`${title} book cover`}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                    }}
                />
            </div>

            <div className={styles.bookInfo}>

                <p
                    className={styles.title}
                    title={title}
                    onClick={viewBook}
                >
                    {title}
                </p>

                <p
                    className={styles.author}
                    title={author}
                    onClick={viewAuthorBooks}
                >
                    {author}
                </p>

            </div>

        </article>
    );
};

export default BookCard;
