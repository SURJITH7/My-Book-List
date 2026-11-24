// import { useState, useEffect } from "react";

// const slides = [
//   {
//     label: "YOUR PERSONAL BOOK SPACE",
//     title: "Every book is a new",
//     highlight: "adventure.",
//     text: "Keep track of the books you read, discover new stories, and build your own reading journey.",
//     primary: { text: "My Library", href: "/library" },
//     secondary: { text: "Discover Books", href: "/search" },
//     books: ["BOOKS", "READ", "EXPLORE"],
//   },
//   {
//     label: "TRACK YOUR PROGRESS",
//     title: "Know exactly where you",
//     highlight: "left off.",
//     text: "Mark books as reading, finished, or wishlisted and watch your reading journey grow.",
//     primary: { text: "My Library", href: "/library" },
//     secondary: { text: "Discover Books", href: "/search" },
//     books: ["TRACK", "PAGES", "FINISH"],
//   },
//   {
//     label: "RATE AND REVIEW",
//     title: "Share what you",
//     highlight: "loved.",
//     text: "Rate your favorite books and see what the community is reading.",
//     primary: { text: "My Library", href: "/library" },
//     secondary: { text: "Discover Books", href: "/search" },
//     books: ["RATE", "REVIEW", "SHARE"],
//   },
// ];

// const HeroCarousel = () => {
//   const [current, setCurrent] = useState(0);
//   const [paused, setPaused] = useState(false);

//   useEffect(() => {
//     if (paused) return;
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [paused]);

//   const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
//   const next = () => setCurrent((c) => (c + 1) % slides.length);

//   const slide = slides[current];

//   return (
//     <section
//       className="home-hero"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       <div className="hero-slide" key={current}>
//         <div className="hero-content">
//           <span className="hero-label">{slide.label}</span>

//           <h1>
//             {slide.title} <span>{slide.highlight}</span>
//           </h1>

//           <p>{slide.text}</p>

//           <div className="hero-actions">
//             <a href={slide.primary.href} className="hero-btn primary-btn">
//               {slide.primary.text}
//             </a>
//             <a href={slide.secondary.href} className="hero-btn secondary-btn">
//               {slide.secondary.text}
//             </a>
//           </div>
//         </div>

//         <div className="hero-decoration">
//           <div className="hero-book book-one">{slide.books[0]}</div>
//           <div className="hero-book book-two">{slide.books[1]}</div>
//           <div className="hero-book book-three">{slide.books[2]}</div>
//         </div>
//       </div>

//       <div className="carousel-controls">
//         <button className="carousel-arrow" onClick={prev} aria-label="Previous slide">
//           ‹
//         </button>

//         <div className="carousel-dots">
//           {slides.map((_, i) => (
//             <button
//               key={i}
//               className={`carousel-dot ${i === current ? "active" : ""}`}
//               onClick={() => setCurrent(i)}
//               aria-label={`Go to slide ${i + 1}`}
//             />
//           ))}
//         </div>

//         <button className="carousel-arrow" onClick={next} aria-label="Next slide">
//           ›
//         </button>
//       </div>
//     </section>
//   );
// };

// export default HeroCarousel;


import BookCarousel from "./books_carousel.png";

const HeroBanner = () => {
  return (
    <section className="home-hero">
      <div className="hero-content">
        <h1>
          Track Every Book <span>Live Your Reading Life</span>
        </h1>

        <p>
          Save the books you love, track what you are reading now,
          and plan what comes next, all in your own library.
        </p>

        <div className="hero-actions">
          <a href="/library" className="hero-btn primary-btn">
            Open My Library
            <span className="btn-arrow">→</span>
          </a>

          <a href="/search" className="hero-btn secondary-btn">
            Discover Books
            <span className="btn-circle">›</span>
          </a>
        </div>
      </div>

      <div className="hero-image">
        <img src={BookCarousel} alt="" />
      </div>
    </section>
  );
};

export default HeroBanner;