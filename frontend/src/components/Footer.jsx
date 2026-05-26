import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='footer-shell'>
      <div className='ui-panel rounded-[28px] px-6 py-8 sm:px-10 flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-16 text-sm'>
        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 ui-subtext leading-7'>
            Thoughtful fashion for everyday confidence, designed to feel clean, modern, and easy to wear. </p>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 ui-subtext'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
                            </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 ui-subtext'>
            <li>+91 63072741114</li>
            <li>pratyakshasrivastavr5@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr/>
        <p className='py-5 text-sm text-center ui-subtext'>Copyright 2025 @forever.com- All rights reserved</p>
      </div>
    </div>
  )
}

export default Footer
