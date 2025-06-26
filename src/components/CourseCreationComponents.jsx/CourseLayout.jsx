import React from 'react';

const Layout = ({ children }) => {
  return (
    <div 
      className="min-h-screen w-[100%] bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 flex items-center justify-center p-6"
    >
      <main 
        className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8"
        style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
