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
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">

      {/* TEXT SECTION */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">

        <div className="text-[#414141]">

          {/* BESTSELLER TAG */}
          <div className="flex items-center gap-2">
            <span className="w-8 md:w-11 h-[2px] bg-[#414141]" />
            <p className="font-medium text-sm md:text-base">
              OUR BESTSELLERS
            </p>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed font-semibold">
            Latest Arrival
          </h1>

          {/* CTA */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <p className="font-semibold text-sm md:text-base group-hover:underline">
              SHOP NOW
            </p>
            <span className="w-8 md:w-11 h-[1px] bg-[#414141] group-hover:w-14 transition-all duration-300" />
          </div>

        </div>

      </div>

      {/* IMAGE */}
      <img
        className="w-full sm:w-1/2 object-cover"
        src={assets.hero_img}
        alt="Hero"
      />

    </div>
  );
};

export default Hero;
