import React from 'react'
import Navbar from '../navbar/Navbar'
import Fotter from '../footer/Fotter'
import ContactUsFloating from '../contactUsFloating/ContactUsFloating'

export default function Layout() {
  return (
    <>
    <Navbar/>

    <ContactUsFloating/>
    <Fotter/>
    </>
  )
}
