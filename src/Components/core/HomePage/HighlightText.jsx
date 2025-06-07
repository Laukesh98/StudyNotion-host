import React from 'react'

export default function HighlightText({text}) {
  return (
    <span className=' bg-gradient-to-b from-sky-400 to-cyan-200 bg-clip-text text-transparent font-nold'>
    {" "}
    {text}
    {" "}
    </span>
  )
}
