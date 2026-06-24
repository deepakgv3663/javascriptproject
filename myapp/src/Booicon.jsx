const Booicon = ({ label, onClick }) => {
    return (
        <button className="btn btn-primary" onClick={onClick}>
            <i className={`bi bi-eye-slash`}></i>
            {label}
        </button>
    );
};

export default Booicon