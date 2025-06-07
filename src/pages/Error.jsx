import React from 'react'
import HighlightText from '../Components/core/HomePage/HighlightText'

export default function Error() {
    return (
        <div className='flex w-full text-white justify-center items-center flex-1'>
            <div className='text-4xl justify-center items-center'>
                <HighlightText text={404} />
                Page not found
            </div>
           
        </div>
    )
}
