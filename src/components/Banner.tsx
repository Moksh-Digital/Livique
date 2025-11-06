import React from 'react';

const PromoBanner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916] text-white py-2 px-4 z-[80]">
  <div className="max-w-[1400px] mx-auto">
    <p className="text-center text-xs md:text-sm font-medium">
      Free Shipping on order value above Rs.499 within India
    </p>
  </div>
</div>
  );
};

export default PromoBanner;