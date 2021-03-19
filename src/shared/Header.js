import React from 'react'
import "../App.scss"

export default function Header(props) {
  return (
    <div className="header">
      <div className="navbar">
         {props.name}
      </div>
    </div>
  )
}
