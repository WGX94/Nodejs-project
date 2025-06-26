import "./profile.scss"
import SideBarGamesContainer from "../../components/sidebargames/SideBarGames"
import ProfileScreen from "../../components/profilescreen/ProfileScreen"
import { useNavigate } from "react-router-dom"
import closeIcon from "../../assets/closeIcon.svg"

const Profile = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <>
            <div id="profileContainer">
                <div id="innerProfileContainer">
                    <SideBarGamesContainer></SideBarGamesContainer>
                    <ProfileScreen></ProfileScreen>

                    <button onClick={handleClick} id="backHome">
                        <img src={closeIcon} />
                    </button>


                </div>
                


            </div>
        </>

    )
}

export default Profile