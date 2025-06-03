import React from 'react';

function Notfound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</p>
        <p className="text-gray-500">Sorry, the page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default Notfound;
