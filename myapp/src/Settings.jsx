import { useNavigate } from "react-router-dom";

function Settings() {
    const navi = useNavigate();

    const settingsList = [
        {
            title: "Profile Settings",
            desc: "Update your personal information and profile details."
        },
        {
            title: "Security",
            desc: "Manage password, authentication, and security options."
        },
        {
            title: "Notifications",
            desc: "Control alerts and notification preferences."
        }
    ];

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Settings</h1>

            <div style={styles.grid}>
                {settingsList.map((item, idx) => (
                    <div
                        key={idx}
                        style={styles.card}
                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                    </div>
                ))}
            </div>

            <button style={styles.button} onClick={() => navi(-1)}>
                ⬅ Go Back
            </button>

        </div>
    );
}

const styles = {
    container: {
        padding: "40px",
        textAlign: "center",
        background: "#f8f9fa",
        minHeight: "100vh"
    },
    title: {
        marginBottom: "30px",
        fontSize: "35px"
    },
    grid: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap"
    },
    card: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        width: "250px",
        transition: "0.3s",
        cursor: "pointer"
    },
    button: {
        marginTop: "30px",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        background: "#007bff",
        color: "#fff",
        cursor: "pointer"
    }
};

export default Settings; 