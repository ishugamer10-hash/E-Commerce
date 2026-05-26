import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <div className='inline-flex gap-3 items-center mb-3'>
      <p className='ui-title text-xs sm:text-sm'>
        {text1} <span className='font-semibold'>{text2}</span>
      </p>
      <p className='ui-kicker-line w-12 sm:w-16 h-[1.5px] rounded-full'></p>
    </div>
  )
}

export default Title
