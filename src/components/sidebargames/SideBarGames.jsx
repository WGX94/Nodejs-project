import "./sideBarGames.scss";
import React, { useState, useEffect, useRef } from "react";
import arrow from "../../assets/arrow.svg";
import userIcon from "../../assets/user_icon.png"
import arrowDown from "../../assets/arrow_down_icon.png"
import favorite from "../../assets/favorite_icon.svg"
import favoriteCheck from "../../assets/favorite_check_icon.svg"
import settings from "../../assets/settings_icon.svg"
import myGames from "../../assets/my_games_icon.svg"
import searchIcon from "../../assets/search_icon.svg"
import avatar from "../../assets/avatar.png"
import infinityBg from "../../assets/infinityBg.svg"
import rabbitBg from "../../assets/rabbitBg.svg"
import turtleBg from "../../assets/turtleBg.svg"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import defaultAvatar from "../../assets/avatar.png"

const SideBarGamesContainer = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [currentGame, setCurrentGame] = useState(null);
    const [expandedBar, setExpandedBar] = useState(false);
    const [expandedFavorites, setExpandedFavorites] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [userJob, setUserJob] = useState('');
    const [games, setGames] = useState([]);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [onlinePlayers, setOnlinePlayers] = useState([]);

    const isVictoryPage = location.pathname.includes('/victory/');

    useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetch(`http://localhost/liked/${parsedUser.id}`)
        .then((res) => res.json())
        .then(setFavorites)
        .catch((err) => console.error("Erreur favoris :", err));
    }
    console.log("User loaded:", storedUser);
  }, []);

    useEffect(() => {
        fetch("http://localhost/games")
            .then(res => res.json())
            .then(gamesData => {
                setGames(gamesData);
                if (gameId) {
                    const game = gamesData.find(g => g.id === parseInt(gameId));
                    setCurrentGame(game);
                }
            })
            .catch(err => console.error("Erreur fetch jeux :", err));
    }, [gameId]);

    const gamesToShow = gameId && currentGame ? [currentGame] : [];

    function handleClick() {
        setExpandedBar(!expandedBar);
    }

    function toggleFavorite(gameId) {
        if (!userId) return;

        const alreadyLiked = favorites.some(fav => fav.id === gameId);
        const url = `http://localhost/liked`;
        const options = {
            method: alreadyLiked ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, game_id: gameId })
        };

        fetch(url, options)
            .then(res => res.json())
            .then(updatedFavorites => {
                setFavorites(updatedFavorites);
            })
            .catch(err => {
                console.error("Erreur mise à jour favoris :", err);
            });
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    const handlePlayerClick = (playerId) => {
        console.log("Player clicked:", playerId);
    };


    const [sliderValue, setSliderValue] = useState(50); 
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
    const knobRef = useRef(null);

    const getSpeedText = (value) => {
        if (value < 33) return "Normal";
        if (value < 67) return "Fast";
        return "Slow";
    };


    const getGameDuration = (value) => {
        if (value < 33) return "~ 5 min";
        if (value < 67) return "~ 1 min";
        return "~ no time limit";
    };


    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault();
    };


    const handleMouseMove = React.useCallback((e) => {
        if (!isDragging || !sliderRef.current) return;

        e.preventDefault(); 

        const sliderRect = sliderRef.current.getBoundingClientRect();
        const sliderWidth = sliderRect.width;
        const mouseX = e.clientX - sliderRect.left;


        let newValue = (mouseX / sliderWidth) * 100;
        newValue = Math.max(0, Math.min(100, newValue)); 

        setSliderValue(newValue);
    }, [isDragging]);


    const handleMouseUp = React.useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {

            document.addEventListener('mousemove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp, { passive: true });
            document.body.style.userSelect = 'none';
        } else {

            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleSliderClick = (e) => {
        if (isDragging) return;

        const sliderRect = sliderRef.current.getBoundingClientRect();
        const sliderWidth = sliderRect.width;
        const mouseX = e.clientX - sliderRect.left;

        let newValue = (mouseX / sliderWidth) * 100;
        newValue = Math.max(0, Math.min(100, newValue));

        setSliderValue(newValue);
    };

    const handlePlayAgain = () => {
        if (gameId) {
            navigate(`/game/${gameId}`);
        }
    };

    return (
        <div id={expandedBar ? "sideBarGamesContainerNotExpanded" : "sideBarGamesContainer"}>
            <button id="toggleSideBar" onClick={handleClick}>
                <img src={arrow} alt="toggle sidebar" />
            </button>
            <div id={expandedBar ? "innerContainerNotExpanded" : "innerContainer"}>

                <div id="topIcons">
                    <button className="buttonTop"><img className="imgIcon" src={settings} alt="" /></button>
                    <button className="buttonTop"><img className="imgIcon" src={userIcon} alt="" /></button>
                    <button onClick={handleLogout} id="logOutButton">Log out</button>
                </div>
                <div id="userBlock">
                    <img
              id="avatar"
              src={
                user?.image
                  ? `http://localhost/uploads/${user.image}`
                  : defaultAvatar
              }
              alt="avatar"
              style={{ width: "50px", height: "50px" }
            }
            />
                    <div id="userInfo">
                        <span id="jobTitle">{user?.jobTitle || "DESIGNER"}</span>
                        <span id="userName">{user?.name || "James"}</span>
                    </div>
                </div>
               
                {gamesToShow.length > 0 && (
                    <div id="favoritesList">
                        <span id="favoritesTitle">{isVictoryPage ? "GAME RESULTS" : "IN GAME"}</span>
                        <ul id={expandedFavorites ? "noContainerFavoriteGames" : "containerFavoriteGames"}>
                            {gamesToShow.map(game => {
                                const isFavorite = favorites.some(fav => fav.id === game.id);
                                return (
                                    <li className="gameBlock" key={game.id}>
                                        {game.image && (
                                            <div className="leftBlock" style={{
                                                backgroundImage: `url(http://localhost/uploads/${game.image})`,
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat"
                                            }}></div>
                                        )}
                                        <div className="rightBlock">
                                            <div className="topBlock">
                                                <div className="titleAndCategories">
                                                    <span className="gameName">{game.name}</span>
                                                    <span className="categoryName">{game.category_name}</span>
                                                </div>
                                                <div className="usersInGame">
                                                    <div className="presence"></div>
                                                    <span>24</span>
                                                </div>
                                            </div>
                                            <div className="bottomBlock">
                                                <div className="leftButtons">
                                                    <button className="findMatch" onClick={() => handleGameClick(game.id)}>Find a match</button>
                                                    <button className="invite">Invite</button>
                                                </div>
                                                <button
                                                    className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                                                    onClick={() => toggleFavorite(game.id)}
                                                    aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                                                >
                                                    <img
                                                        src={isFavorite ? favoriteCheck : favorite}
                                                        alt={isFavorite ? "Favoris" : "Ajouter aux favoris"}
                                                        style={{ width: "16px", height: "16px" }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        {!isVictoryPage && (
                            <div id="nbPlayers">
                                <div id="first-line">
                                    <span id="title">Number of player</span>
                                    <select className="player-selector">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </select>
                                </div>
                                <div className="second-line">

                                    <span id="speed-text">Game speed : {getSpeedText(sliderValue)}</span>
                                    <div className="slider-container">
                                        <div
                                            ref={sliderRef}
                                            className={`slider-track ${isDragging ? 'dragging' : ''}`}
                                            onClick={handleSliderClick}
                                        >
                                            <img className="speed-icon" alt="" id="leftSlider" src={infinityBg} />

                                            <img className="speed-icon" alt="" src={turtleBg} />

                                            <img className="speed-icon" alt="" id="rightSlider" src={rabbitBg} />

                                            <div className="slider-fill-container">
                                                <div
                                                    className="slider-fill"
                                                    style={{ width: `${sliderValue}%` }}
                                                />
                                            </div>

                                            <div
                                                ref={knobRef}
                                                className={`slider-knob ${isDragging ? 'dragging' : ''}`}
                                                style={{
                                                    left: `calc(${sliderValue}% - 12px)`, // 12px = half of knob width
                                                }}
                                                onMouseDown={handleMouseDown}
                                            />
                                        </div>
                                    </div>

                                    <div className="duration-text">
                                        <span>Game length {getGameDuration(sliderValue)}</span>
                                    </div>
                                </div>

                                <div className="third-line">
                                    <span>Choice of Board</span>
                                    <select className="board-select">
                                        <option value="">Random board</option>
                                    </select>
                                </div>

                                <div className="fourth-line">
                                    <span>Playing with the Dolphin</span>
                                    <select className="dolphin-select">
                                        <option value="">Add the Dolphin tile to the bag</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                )}
                {gameId && (
                    <div id="gameList">
                        <span id="gamesMostPlayed">ONLINE PLAYERS</span>
                        <ul id={expandedFavorites ? "containerGamesExtended" : "containerGames"}>
                            {onlinePlayers.length > 0 ? (
                                onlinePlayers.map(player => (
                                    <li className="gameBlock" key={player.id || player.user_id}>
                                        <div className="leftBlock" style={{
                                            backgroundImage: `url(${player.avatar || avatar})`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat"
                                        }}></div>
                                        <div className="rightBlock">
                                            <div className="topBlock">
                                                <div className="titleAndCategories">
                                                    <span className="gameName">{player.name || player.username || `Player ${player.user_id}`}</span>
                                                    <span className="categoryName">Score: {player.score || 0}</span>
                                                </div>
                                                <div className="usersInGame">
                                                    <div className="presence"></div>
                                                    <span>Online</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="gameBlock">
                                    <span>
                                        No players currently online
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                {isVictoryPage && gameId && (

                    <button
                        id="playAgainButton"
                        onClick={handlePlayAgain}
                    >
                        Play Again
                    </button>
                )}
            </div>

        </div>
    );
};

export default SideBarGamesContainer;