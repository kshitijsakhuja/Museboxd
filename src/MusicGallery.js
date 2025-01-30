import React from 'react';
import './MusicGallery.css';

const MusicGallery = () => {
    const albums = [
        {
            title: "Carry On",
            imgSrc: "https://upload.wikimedia.org/wikipedia/en/2/25/Fun._-_Carry_On.jpg",
            rating: "4.5",
            year: "2023"
        },
        {
            title: "Wicked",
            imgSrc: "https://upload.wikimedia.org/wikipedia/en/8/87/WickedCastRecording.jpg",
            rating: "4.2",
            year: "2023"
        },
        {
            title: "Red One",
            imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2PMwQOVeRv2pfaMMswGULsAfr_Aaa82Pc2Q&s",
            rating: "4.8",
            year: "2023"
        },
        {
            title: "Heretic",
            imgSrc: "https://i.scdn.co/image/ab67616d00001e0204cbdb4d4852815f62d99096",
            rating: "4.0",
            year: "2023"
        },
        {
            title: "Lover",
            imgSrc: "https://upload.wikimedia.org/wikipedia/en/c/cd/Taylor_Swift_-_Lover.png",
            rating: "4.7",
            year: "2023"
        },
        {
            title: "Abbey Road",
            imgSrc: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
            rating: "4.9",
            year: "1969"
        },
        {
            title: "The Dark Side of the Moon",
            imgSrc: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
            rating: "4.8",
            year: "1973"
        },
        {
            title: "Thriller",
            imgSrc: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
            rating: "4.9",
            year: "1982"
        },
        {
            title: "1989",
            imgSrc: "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
            rating: "4.7",
            year: "2014"
        },
        {
            title: "A Night at the Opera",
            imgSrc: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
            rating: "4.6",
            year: "1975"
        }
    ];
    

    return (
        <div className="music-gallery">
            <header className="header">
                <h1>Explore Top Albums</h1>
                <div className="search-bar">
                    <input type="text" placeholder="Search albums..." />
                </div>
            </header>
            <div className="music-carousel">
                {albums.map((album, index) => (
                    <div className="album-cover" key={index}>
                        <img src={album.imgSrc} alt={album.title} />
                        <div className="album-info">
                            <h2>{album.title}</h2>
                            <p>Rating: {album.rating}</p>
                            <p>Released: {album.year}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MusicGallery;
