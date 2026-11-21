// import GenreCard from "../GenreCard/GenreCard";
// import lodash from 'lodash'

// let genres = [
//     'Fiction',
//     'Mystery',
//     'Romance',
//     'Science fiction',
//     'Fantasy',
//     'Horror',
//     'Thriller',
//     'Biography',
//     'History',
//     'Self-help',
//     'Travel',
//     'Cooking',
//     'Art',
//     'Religion',
//     'Philosophy',
//     'Psychology',
//     'Business',
//     'Economics',
//     'Education'
// ]

// genres = lodash.shuffle(genres);
// const genreCards = genres.map((genre => (
//     <GenreCard key={genre} genre={genre}></GenreCard>
// )))

// const Home = () => {
//     return(
//     <>
//         {genreCards}
//     </>
//     )
// }

// export default Home;



import GenreCard from "../GenreCard/GenreCard";
import lodash from "lodash";
import "./Home.css";

const genres = [
  "Fiction",
  "Mystery",
  "Romance",
  "Science fiction",
  "Fantasy",
  "Horror",
  "Thriller",
  "Biography",
  "History",
  "Self-help",
  "Travel",
  "Cooking",
  "Art",
  "Religion",
  "Philosophy",
  "Psychology",
  "Business",
  "Economics",
  "Education",
];

const Home = () => {
  const shuffledGenres = lodash.shuffle(genres);

  return (
    <div className="home-page">

      {/* Welcome Section */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-label">YOUR PERSONAL BOOK SPACE</span>

          <h1>
            Every book is a new
            <span> adventure.</span>
          </h1>

          <p>
            Keep track of the books you read, discover new stories,
            and build your own reading journey.
          </p>

          <div className="hero-actions">
            <a href="/library" className="hero-btn primary-btn">
              My Library
            </a>

            <a href="/search" className="hero-btn secondary-btn">
              Discover Books
            </a>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="hero-book book-one">BOOKS</div>
          <div className="hero-book book-two">READ</div>
          <div className="hero-book book-three">EXPLORE</div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="home-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div>
            <h3>My Library</h3>
            <p>Manage your collection</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div>
            <h3>Reading Journey</h3>
            <p>Track your progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div>
            <h3>My Ratings</h3>
            <p>Rate your favorite books</p>
          </div>
        </div>
      </section>

      {/* Genre Exploration */}
      <section className="genre-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">EXPLORE YOUR INTERESTS</span>
            <h2>Explore by Genre</h2>
            <p>Find your next favorite book.</p>
          </div>
        </div>

        <div className="genre-grid">
          {shuffledGenres.map((genre) => (
            <GenreCard key={genre} genre={genre} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
