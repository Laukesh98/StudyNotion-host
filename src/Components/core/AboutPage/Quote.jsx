import React from 'react'
import HighlightText from '../HomePage/HighlightText'


const Quote = () => {
  return (
    <div >
      We are passionate about revolutionizing the way we learn. Our innovative platform
      <HighlightText text={"combines technology"}/> 
      <span className='bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text font-semibold text-transparent'>
        {" "}
        expertise
      </span>
      , and community to create an 
      <span  className='bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text font-semibold text-transparent'>
      {" "}
        unparalleled educational experience.
      </span>
    </div>
  )
}

export default Quote
