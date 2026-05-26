// import React from 'react'
// import { assets } from '../assets/assets'

// const Hero = () => {
//   return (
    
//     <div className='flex flex-col sm:flex-row border border-gray-400'>
      
//       <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        
//         <div className='text-[#414141]'>

//           {/* Bestseller Tag */}
//           <div className='flex items-center gap-2'>
//             <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
//             <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
//           </div>

//           {/* Title */}
//           <h1 className='text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
//             Latest Arrival
//           </h1>

//           {/* CTA */}
//           <div className='flex items-center gap-2'>
//             <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
//             <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
//           </div>

//         </div>

//       </div>
    
//       {/* Image */}
//       <img className='w-full sm:w-1/2 object-cover' src={assets.hero_img} alt="hero" />

//     </div> 
//   )
// }

// export default Hero
 
import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="hero-shell flex flex-col sm:flex-row mt-4">

      {/* TEXT SECTION */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0 px-6 sm:px-10 lg:px-14">

        <div className="hero-copy max-w-xl">

          {/* BESTSELLER TAG */}
          <div className="flex items-center gap-3">
            <span className="ui-kicker-line w-10 md:w-14 h-[2px] rounded-full" />
            <p className="ui-title text-xs sm:text-sm">
              Curated Highlights
            </p>
          </div>

          {/* TITLE */}
          <h1 className="text-4xl sm:py-4 lg:text-6xl leading-tight font-semibold max-w-lg">
            Dresses That Feel Modern, Polished, and Effortless.
          </h1>
          <p className="ui-subtext text-sm sm:text-base leading-7 max-w-md">
            Discover a refined collection with clean silhouettes, flattering fits, and everyday pieces that still feel special.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 mt-7">
          <Link to="/collection" className="hero-cta cursor-pointer group">
            <p className="font-semibold text-sm md:text-base">
              Shop Collection
            </p>
            <span className="ui-kicker-line w-8 md:w-10 h-[1.5px] rounded-full group-hover:w-14 transition-all duration-300" />
          </Link>
          <p className="ui-subtext text-sm">Simple styling, premium feel, season-ready pieces.</p>
          </div>

        </div>

      </div>

      {/* IMAGE */}
      <img
        className="w-full sm:w-1/2 object-cover min-h-[320px] sm:min-h-[100%]"
        src={assets.hero_img}
        alt="Hero"
      />

    </div>
  );
};

export default Hero;
