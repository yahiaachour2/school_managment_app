import { RefObject } from 'react';

export const handleClickOutside = (event: MouseEvent, handleCloseModal: { (): void; (): void; (): void; }, modalRef: RefObject<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleCloseModal();
    }
  };