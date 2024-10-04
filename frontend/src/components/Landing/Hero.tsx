import React from 'react';

interface HeroProps {
  setShowLogInModal: (show: boolean) => void;
  setShowRegisterModal: (show: boolean) => void;
}

const Hero: React.FC<HeroProps> = ({
  setShowLogInModal,
  setShowRegisterModal,
}) => {
  //* open modal logic
  const openLoginModal = () => {
    setShowLogInModal(true);
  };
  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <h1 className="text-3vw p-4"> Wallet Sage </h1>
      <div className="flex gap-4 justify-center">
        <button
          className="bg-primary p-2 w-[7vw] rounded-lg hover:bg-muted hover:shadow-lg shadow-shadow"
          onClick={openRegisterModal}
        >
          Get Started
        </button>
        <button
          className="bg-primary p-2 w-[7vw] rounded-lg hover:bg-muted hover:shadow-lg shadow-shadow"
          onClick={openLoginModal}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Hero;
