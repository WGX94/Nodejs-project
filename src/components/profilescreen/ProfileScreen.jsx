import { useState, useEffect } from "react";
import "./profileScreen.scss";
import deleteIcon from "../../assets/deleteIcon.svg";
import modifyIcon from "../../assets/modifyIcon.svg";
import heart from "../../assets/heart.svg"
import fire from "../../assets/fire.svg"
import { useNavigate } from "react-router-dom";



const ProfileScreen = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;
    const navigate = useNavigate()
    const [messages, setMessages] = useState([]);
    const [userReactionCount, setUserReactionCount] = useState({ heart: 0, fire: 0 });
    const [error, setError] = useState("");
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // Récupérer les messages de l'utilisateur
    useEffect(() => {
        if (!userId) return;

        fetch(`http://localhost/messagesPT/users/${userId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors du chargement des messages");
                return res.json();
            })
            .then((data) => {
                const withReactions = data.map((msg) => ({
                    ...msg,
                    reactions: msg.reactions || [],
                }));
                setMessages(withReactions);
            })
            .catch((err) => setError(err.message));
    }, [userId]);

    // Calculer le nombre total de réactions effectuées par l'utilisateur
    useEffect(() => {
        if (!userId) return;

        // Récupérer tous les messages pour compter les réactions de l'utilisateur
        fetch("http://localhost/messagesPT")
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors du chargement des messages");
                return res.json();
            })
            .then((data) => {
                let heartCount = 0;
                let fireCount = 0;

                data.forEach((msg) => {
                    if (msg.reactions) {
                        msg.reactions.forEach((reaction) => {
                            if (reaction.user_id === userId) {
                                if (reaction.reaction === "heart") heartCount++;
                                if (reaction.reaction === "fire") fireCount++;
                            }
                        });
                    }
                });

                setUserReactionCount({ heart: heartCount, fire: fireCount });
            })
            .catch((err) => setError(err.message));
    }, [userId]);

    // Supprimer un message
    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

        try {
            const res = await fetch(`http://localhost/messagesPT/${messageId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Erreur lors de la suppression du message");

            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        } catch (err) {
            setError(err.message);
        }
    };

    // Commencer l'édition d'un message
    const startEditing = (messageId, currentText) => {
        setEditingMessageId(messageId);
        setEditingText(currentText);
    };

    // Annuler l'édition
    const cancelEditing = () => {
        setEditingMessageId(null);
        setEditingText("");
    };

    // Sauvegarder les modifications
    const saveEdit = async (messageId) => {
        if (!editingText.trim()) return;

        try {
            const res = await fetch(`http://localhost/messagesPT/${messageId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: editingText.trim() }),
            });

            if (!res.ok) throw new Error("Erreur lors de la modification du message");

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, message: editingText.trim() } : msg
                )
            );

            setEditingMessageId(null);
            setEditingText("");
        } catch (err) {
            setError(err.message);
        }
    };

    // Supprimer un utilisateur
    const handleDeleteUser = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;

        try {
            const res = await fetch(`http://localhost/users/${userId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur lors de la suppression du compte");
            }

            
            localStorage.removeItem("user");
            navigate('/signup');
            
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            setError(err.message);
        }
    };

    // Nombre de réactions pour chaque message
    const countReactions = (msg, reactionType) =>
        msg.reactions.filter((r) => r.reaction === reactionType).length;

    return (
        <div id="profileScreenContainer">
            <div id="innerContainer">
                <div id="titleProfile">
                    <h1>Profil</h1>
                    <button id="deleteUser" onClick={handleDeleteUser}>Supprimer le compter</button>

                </div>

                

                <div id="topProfilescreen">

                    <div id="infos">
                        <h3>Vos informations de profil</h3>
                        {user && (
                            <div className="user-info">
                                <p><strong>Nom:</strong> {user.name}</p>
                                <p><strong>Structure:</strong> {user.structure}</p>
                                <p><strong>Pays:</strong> {user.country}</p>
                                <p><strong>Rôle:</strong> {user.role === "A" ? "Administrateur" : "Utilisateur"}</p>
                            </div>
                        )}
                    </div>

                    <div id="nbReactions">
                        <h3>Nombre de réactions que vous avez effectuées :</h3>
                        <div className="reaction-stats">
                            <div className="stat-item">
                                <img className="icons" src={heart} alt="" />
                                <span className="count">{userReactionCount.heart}</span>
                                
                            </div>
                            <div className="stat-item">
                                <img className="icons" src={fire} alt="" />
                                <span className="count">{userReactionCount.fire}</span>
                
                            </div>
                        </div>
                    </div>

                </div>

                <div id="userMessages">
                    <h3>Vos messages ({messages.length})</h3>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {messages.length === 0 ? (
                        <p className="no-messages">Vous n'avez encore envoyé aucun message.</p>
                    ) : (
                        <div id="messages-list">
                            {messages.map((msg) => (
                                <div key={msg.id} className="messageItem">
                                    <div className="message-header">
                                        <div className="topPart">
                                            <div className="message-date">
                                                {new Date(msg.date).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                            <div className="message-actions">
                                                <button
                                                    className="action-btn edit-btn"
                                                    onClick={() => startEditing(msg.id, msg.message)}
                                                    title="Modifier"
                                                >
                                                    <img className="actionIcon" src={modifyIcon} alt="Edit" />
                                                </button>
                                                <button
                                                    className="action-btn delete-btn"
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    title="Supprimer"
                                                >
                                                    <img className="actionIcon" src={deleteIcon} alt="Delete" />
                                                </button>
                                            </div>

                                        </div>

                                    </div>

                                    {editingMessageId === msg.id ? (
                                        <div className="edit-form">
                                            <textarea
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                className="edit-textarea"
                                                rows="3"
                                            />
                                            <div className="edit-actions">
                                                <button
                                                    className="save-btn"
                                                    onClick={() => saveEdit(msg.id)}
                                                    disabled={!editingText.trim()}
                                                >
                                                    Sauvegarder
                                                </button>
                                                <button
                                                    className="cancel-btn"
                                                    onClick={cancelEditing}
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="message-content">
                                            {msg.message}
                                        </div>
                                    )}

                                    <div className="message-stats">
                                        <div className="reaction-count">
                                            <img className="icons" src={heart} alt="" />
                                            <span>{countReactions(msg, "heart")}</span>
                                        </div>
                                        <div className="reaction-count">
                                            <img className="icons" src={fire} alt="" />
                                            <span>{countReactions(msg, "fire")}</span>
                                        </div>
                                        <div className="total-reactions">
                                            Total: {countReactions(msg, "heart") + countReactions(msg, "fire")} réactions
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;