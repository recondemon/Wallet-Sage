import React, { useState } from 'react';

interface DropdownProps {
  children: React.ReactNode;
  buttonContent: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ children, buttonContent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      <div onClick={toggleDropdown} className="cursor-pointer">
        {buttonContent}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-altBackground border rounded-lg shadow-lg z-10 py-4">
          <div className="flex flex-col gap-2">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
