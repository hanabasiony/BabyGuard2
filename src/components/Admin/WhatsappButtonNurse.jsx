import React from 'react';

const WhatsAppButton = ({ children }) => {
  const message = '';

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${children}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <button onClick={handleClick} className='inline-flex items-center ml-2 text-green-600 hover:text-green-700'>
      <i className="fa-brands fa-whatsapp text-xl"></i>
    </button>
  );
};

export default WhatsAppButton;