import React from 'react';

const PromoBanner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-[#DC143C] to-[#B22222] text-white py-2 px-4 z-[60]">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-center text-xs md:text-sm font-medium">
          Free Shipping on order value above Rs.499 within India
        </p>
      </div>
    </div>
  );
};

export default PromoBanner;