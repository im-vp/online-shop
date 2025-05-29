'use client';

import { FC, ReactNode, useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { createPortal } from 'react-dom';

import { usePopupStore } from '@/store/PopupStore';
import style from '@/styles/ui/popup/popup.module.css';

interface Props {
  isPopupOpen?: boolean;
  popupId: string;
  children: ReactNode;
  className?: string;
  maxWidth?: 'small' | 'medium' | 'large' | number;
  onClose?: () => void;
}

const popupSize: Record<'small' | 'medium' | 'large', string> = {
  small: '350px',
  medium: '650px',
  large: '950px',
};

const Popup: FC<Props> = ({ popupId, children, className = '', maxWidth = 'medium', onClose }) => {
  const { activePopup, togglePopup } = usePopupStore((state) => state);

  const pathname = usePathname();

  const popupRef = useRef<Element | null>(null);
  const ButtonCloseRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    popupRef.current = document.querySelector<HTMLElement>('#popup');
  }, []);

  useEffect(() => {
    if (activePopup === popupId && ButtonCloseRef.current) {
      ButtonCloseRef.current.focus();
    }
    return () => {
      if (popupId === activePopup) {
        onClose && onClose();
      }
    };
  }, [activePopup]);

  useEffect(() => {
    togglePopup(null);
  }, [pathname]);

  const handleClose = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (event.currentTarget === event.target) {
      togglePopup(null);
    }
  };

  const resolvedMaxWidth = typeof maxWidth === 'string' ? popupSize[maxWidth] : maxWidth;

  return activePopup === popupId && popupRef.current
    ? createPortal(
        <div className={`${style.overlay} opacity-in`} onClick={handleClose}>
          <div
            id={popupId}
            style={{ maxWidth: resolvedMaxWidth }}
            className={`${style.popup} smoothly-down ${className}`}
          >
            <button
              ref={ButtonCloseRef}
              type="button"
              className={style.close}
              onClick={handleClose}
            ></button>
            <div className={`${style.container} ${className}__container`}>
              <div className={`${style.content} ${className}__content`}>{children}</div>
            </div>
          </div>
        </div>,
        popupRef.current,
      )
    : null;
};
export default Popup;
