import React from "react";

function ProductCard({ product, onAdd, loading }) {

    return (
        <div className="card shadow-lg border-0 h-100">
            <img src={product.img} height="200" alt="" />

            <div className="card-body text-center">
                <h5>{product.name}</h5>
                <p>₹{product.price}</p>

                <button
                    className="btn btn-dark w-100"
                    onClick={() => onAdd(product)}
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;