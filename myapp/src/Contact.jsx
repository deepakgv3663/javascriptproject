import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const API = "http://localhost:5000";

function Contact() {
    const navi = useNavigate();

    const savedUser = JSON.parse(localStorage.getItem("user")) || null;
    const userEmail = savedUser ? savedUser.email : "";

    const [form, setForm] = useState({
        name: "",
        email: userEmail,
        phone: "",
        problem: ""
    });

    useEffect(() => {
        if (userEmail) {
            setForm((prevForm) => ({ ...prevForm, email: userEmail }));
        }
    }, [userEmail]);

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API}/orders/contact/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    problem: form.problem
                }),
            });

            if (!response.ok) {
                throw new Error("Database logging failed");
            }

            await emailjs.send(
                "service_uia9ao9",
                "template_nycyvyn",
                {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    problem: form.problem
                },
                "BGUV5mUqSPtrJRV8D"
            );

            setSubmitted(true);
            setForm({ name: "", email: userEmail, phone: "", problem: "" });
            setTimeout(() => setSubmitted(false), 4000);

        } catch (error) {
            console.error(error);
            setErrorMessage("❌ Failed to register request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h2 style={styles.title}>Helpdesk Support</h2>
                <p style={styles.subtitle}>We’re here to help you</p>

                {submitted && (
                    <div style={styles.success}>
                        ✅ Problem Noted, We Will Contact Soon!
                    </div>
                )}

                {errorMessage && (
                    <div style={styles.error}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="👤 Your Name"
                        value={form.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="📧 Your Email"
                        value={form.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="📱 Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <textarea
                        name="problem"
                        placeholder="📝 Describe your problem..."
                        value={form.problem}
                        onChange={handleChange}
                        style={styles.textarea}
                        required
                    />

                    <button style={styles.button} disabled={loading}>
                        {loading ? "Processing..." : "Submit Request"}
                    </button>

                    <button
                        type="button"
                        style={styles.homeBtn}
                        onClick={() => navi("/")}
                    >
                        Back to Home
                    </button>

                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        fontFamily: "Arial"
    },
    card: {
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(15px)",
        padding: "30px",
        borderRadius: "15px",
        width: "350px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        color: "#fff"
    },
    title: {
        textAlign: "center",
        marginBottom: "5px"
    },
    subtitle: {
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "14px",
        opacity: 0.8
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "12px",
        borderRadius: "8px",
        border: "none",
        outline: "none",
        boxSizing: "border-box"
    },
    textarea: {
        width: "100%",
        padding: "10px",
        height: "80px",
        borderRadius: "8px",
        border: "none",
        marginBottom: "15px",
        boxSizing: "border-box"
    },
    button: {
        width: "100%",
        padding: "10px",
        background: "#00c6ff",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        marginBottom: "10px"
    },
    homeBtn: {
        width: "100%",
        padding: "10px",
        background: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },
    success: {
        background: "#28a745",
        padding: "8px",
        borderRadius: "6px",
        marginBottom: "10px",
        textAlign: "center"
    },
    error: {
        background: "#dc3545",
        padding: "8px",
        borderRadius: "6px",
        marginBottom: "10px",
        textAlign: "center"
    }
};

export default Contact;