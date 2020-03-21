import React from 'react'
import { NavLink } from 'react-router-dom'

function MenuUI() {
  return (
   
        <ul className="navbar-nav flex-column mt-4">
        <li
          className="nav-item p-3 mb-2 sidebar-link"
        >
          <NavLink 
          exact 
          activeClassName="active" 
          className="nav-link" to="/mainpage">
            <i className="fas fa-home text-white ml-2 mr-4"></i>
            <span className="hidden-sm-down text-white">首頁</span>
          </NavLink>
        </li>
        <li className="nav-item p-3 mb-2 sidebar-link">
          <NavLink activeClassName="active" className="nav-link" to="/info">
            <i className="fas fa-user mr-3 text-white"></i>
            <span className="hidden-sm-down text-white">個人訊息</span>
          </NavLink>
        </li>
        <li className="nav-item p-3 mb-2 sidebar-link">
          <NavLink activeClassName="active" className="nav-link" to="/coupon">
            <i className="fas fa-tags mr-3 text-white"></i>
            <span className="hidden-sm-down text-white">優惠券</span>
          </NavLink>
        </li>
        <li className="nav-item p-3 mb-2 sidebar-link">
          <NavLink activeClassName="active" className="nav-link" to="/class">
            <i className="fas fa-chalkboard-teacher mr-3 text-white"></i>
            <span className="hidden-sm-down text-white">課程</span>
          </NavLink>
        </li>
        <li className="nav-item p-3 mb-2 sidebar-link">
          <NavLink activeClassName="active" className="nav-link" to="/order">
            <i className="fas fa-store mr-3 text-white"></i>
            <span className="hidden-sm-down text-white">訂單</span>
          </NavLink>
        </li>
        <li className="nav-item text-white p-3 mb-2 sidebar-link">
          <NavLink activeClassName="active" className="nav-link" to="/message">
           <i  className="fab fa-facebook-messenger text-white mr-3"></i> 
            <span className="hidden-sm-down text-white">訊息</span>
          </NavLink>
        </li>
        </ul>
     
  )
}

export default MenuUI