import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const found = products.find((item) => item._id === productId);
    setProductData(found || null);
    setImage(found?.image?.[0] || "");
  }, [productId, products]);

  const selectedImageIndex = productData ? productData.image.findIndex((item) => item === image) : -1;

  const changeImageByDirection = (direction) => {
    if (!productData?.image?.length) return;
    const baseIndex = selectedImageIndex >= 0 ? selectedImageIndex : 0;
    const nextIndex = (baseIndex + direction + productData.image.length) % productData.image.length;
    setImage(productData.image[nextIndex]);
  };

  const changeSizeByDirection = (direction) => {
    if (!productData?.sizes?.length) return;
    const currentIndex = productData.sizes.findIndex((item) => item === size);
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (baseIndex + direction + productData.sizes.length) % productData.sizes.length;
    setSize(productData.sizes[nextIndex]);
  };

  if (!productData) {
    return <div className="opacity-0" />;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
              {productData.image.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setImage(item)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                      event.preventDefault();
                      changeImageByDirection(1);
                    }
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                      event.preventDefault();
                      changeImageByDirection(-1);
                    }
                  }}
                  className={`w-[24%] sm:mb-3 flex-shrink-0 cursor-pointer border ${item === image ? "border-orange-500" : "border-transparent"}`}
                >
                  <img
                    src={item}
                    className="w-full"
                    alt={productData.name}
                  />
                </button>
              ))}
            </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt={productData.name} />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-3.5" alt="star" />
            <img src={assets.star_icon} className="w-3.5" alt="star" />
            <img src={assets.star_icon} className="w-3.5" alt="star" />
            <img src={assets.star_icon} className="w-3.5" alt="star" />
            <img src={assets.star_dull_icon} className="w-3.5" alt="star" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                      event.preventDefault();
                      changeSizeByDirection(1);
                    }
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                      event.preventDefault();
                      changeSizeByDirection(-1);
                    }
                  }}
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-500" : ""}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% original product</p>
            <p>Cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, nemo!</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos, at.</p>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
