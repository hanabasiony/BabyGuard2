import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import WhatsAppButton from '../WhatsButton/WhatsButton';



export default function ContactUsFloating() {
    const navigate = useNavigate()
    function navigateToContact(){
        navigate('/contactUs')
    }

  return (


   <>
   <WhatsAppButton></WhatsAppButton>
    <div className=' fixed bottom-5 text-white right-5 bg-pink-400 rounded-2xl p-1.5 cursor-pointer  text-sm md:text-l rounded-br-none'>
        <button onClick={navigateToContact} className='cursor-pointer '>Contact us <i class="fa-regular fa-address-book text-sm"></i></button>
        
    </div>
   
   </>
    
  )
}
