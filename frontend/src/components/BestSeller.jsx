import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  const bestSeller = useMemo(
    () => products.filter((item) => item.bestseller).slice(0, 5),
    [products]
  );

  return (
    <section className="section-shell my-16">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="ui-subtext w-3/4 m-auto text-xs sm:text-sm md:text-base leading-7">
          The pieces customers come back for most: easy layering, smart tailoring, and high-repeat favorites.
        </p>
      </div>
      <div className="product-grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {bestSeller.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
