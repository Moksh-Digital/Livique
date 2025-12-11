import React from 'react';

const PromoBanner = () => {
  return (
    <div className="sticky top-0 left-0 right-0 w-full bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916] text-white z-[80]" style={{ height: "40px" }}>
      <div className="max-w-[1400px] mx-auto h-full flex items-center px-4">
        <p className="w-full text-center text-xs md:text-sm font-medium leading-none">
          Free Shipping on order value above Rs.499 within India
        </p>
      </div>
    </div>
  );
};

export default PromoBanner;