import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="product-card cursor-pointer" to={`/product/${id}`}>
      <div className="product-chip">New</div>
      <div className="product-media">
        <img src={image[0]} alt={name} />
      </div>
      <div className="product-content">
      <p className="product-name pt-1 pb-1 text-sm sm:text-[15px] font-medium leading-6">{name}</p>
      <p className="product-price text-sm font-semibold">
        {currency}
        {price}
      </p>
      </div>
    </Link>
  );
};

export default ProductItem;
