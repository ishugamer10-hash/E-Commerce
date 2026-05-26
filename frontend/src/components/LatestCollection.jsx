// import React,{useContext, useEffect} from 'react'
// import {ShopContext} from '../context/ShopContext'
// import Title from './Title';

// const LatestCollection = () => {
//     const {products}= useContext (ShopContext);
//     const[latestProducts, setlatestProducts]=useEffect([]);

//     useEffect=(()=>{
//         setlatestProducts(products.slice(0,10))
//     },[])

//   return (
//     <div className='my-10'>
//         <div className='text-center py-8 text-3xl'>
//             <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
//             <p className='w-34 m-auto text-xs sm:text md:text-base text-gray-600 ' >Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, quis? Perspiciatis ducimus totam similique natus.</p>
//             </div>
//       <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
//         {
//             latestProducts.map((item,index)=>(
//                 <productItem key={index} id={id._id} image={item.image} name={item.name} price={item.price } />

                
//             ))
//         }
//       </div>
//     </div>
//   )
// }

// export default LatestCollection

import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className="section-shell my-14">

      <div className="text-center py-8 text-3xl">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="ui-subtext w-3/4 mx-auto text-xs sm:text-sm md:text-base leading-7">
          Fresh arrivals with clean cuts, softer palettes, and elevated everyday styling that stays wearable.
        </p>
      </div>

      <div className="product-grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

    </section>
  );
};

export default LatestCollection;
