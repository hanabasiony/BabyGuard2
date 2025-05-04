import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = '1234567890'; // Replace with your full international number
  const message = 'Hello, I want to know more!';

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${+201010082384}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <button onClick={handleClick} className='fixed bottom-15 right-5.5 bg-pink-400 rounded-2xl p-2 rounded-br-none cursor-pointer'>
      <i class="fa-brands fa-whatsapp text-white text-3xl cursor-pointer"></i>
    </button>
  );
};

export default WhatsAppButton;