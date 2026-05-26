import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
const About = () => {
  return (
    <div className='text-2xl text-center pt-8 border-t'>
     <Title text1={'About'} text2={'Us'} />      
    <div className='my-10 flex flex-col md:flex-row gap-16'>
      <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea iusto facilis vol
          uptates explicabo ab unde, at quam modi reiciendis omnis.  </p>
 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea iusto facilis vol
          uptates explicabo ab unde, at quam modi reiciendis omnis.  </p>
   <b className='text-gray-800'>Our Mission</b>
   <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, deserunt quam pariatur consectetur magni doloribus? </p>
        </div>
        </div>
        <div className='text-xl py-4'>
          <Title text1={'Why'} text2={'Choose us'} />
        </div>
        <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure excepturi rerum reprehenderit possimus, molestias laborum?</p>
          </div>

  <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience </b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure excepturi rerum reprehenderit possimus, molestias laborum?</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service </b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure excepturi rerum reprehenderit possimus, molestias laborum?</p>
          </div>

  
        </div>
        <NewsletterBox/>
    </div>
  
  

    

  )
}

export default About
