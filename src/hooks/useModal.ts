import React from 'react';

export const useModal = <T = undefined>() => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState<T | undefined>(undefined);

  const open = (modalData?: T) => {
    if (modalData) {
      setData(modalData);
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setData(undefined); 
  };
  
  return { isOpen, open, close, data };
};