import React from "react";
import "./PopularReviews.css";

const PopularReviews = () => {
  const reviews = [
    {
      username: "kevinporter",
      movie: "Nosferatu",
      year: 2024,
      rating: "★★★★",
      comments: 133,
      text: "Hawksferatuah",
      likes: 22088,
    },
    {
      username: "* .｡.*° mak °*.｡.*",
      movie: "Nosferatu",
      year: 2024,
      rating: "★★★",
      comments: 70,
      text:
        "so it’s okay to sing along during Wicked but if I start biting people during Nosferatu I’m in the wrong??? interesting",
      likes: 30794,
    },
    {
      username: "EvanAC",
      movie: "Nosferatu",
      year: 2024,
      rating: "★★★",
      comments: 41,
      text: "Nosferatu skips leg day",
      likes: 15622,
    },
    {
      username: "lucaselordi",
      movie: "Nosferatu",
      year: 2024,
      rating: "★★★★",
      comments: 33,
      text: "Horniest vampire movie since Breaking Dawn Part 1",
      likes: 17390,
    },
    {
      username: "ziwe",
      movie: "Nosferatu",
      year: 2024,
      rating: "★★★★★",
      comments: 14,
      text: "The dangers of a little crush",
      likes: 21516,
    },
    {
      username: "clementine",
      movie: "Nosferatu",
      year: 2024,
      rating: "★★★½",
      comments: 26,
      text: "Nightgown buttoned to the TOP",
      likes: 11556,
    },
  ];

  return (
    <div className="popular-reviews">
      <h1>Popular Reviews This Week</h1>
      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <img
                src="https://a.ltrbxd.com/resized/film-poster/3/5/9/5/0/5/359505-nosferatu-2024-0-1000-0-1500-crop.jpg?v=a12d4ad648" // Placeholder image, replace with actual
                alt="Movie poster"
                className="movie-poster"
              />
              <div className="review-info">
                <h2>{review.username}</h2>
                <p>
                  <span className="movie-title">{review.movie}</span> {review.year}
                </p>
                <p className="rating">{review.rating}</p>
              </div>
            </div>
            <p className="review-text">{review.text}</p>
            <div className="review-footer">
              <p>
                <span className="like-review">Like review</span> {review.likes} likes
              </p>
              <p>{review.comments} comments</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularReviews;
