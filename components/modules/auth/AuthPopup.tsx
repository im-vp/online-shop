'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import AuthContainer from '@/components/modules/auth/AuthContainer';
import Popup from '@/components/ui/popup/Popup';

import { POPUP_ID } from '@/constants/constants';
import { usePopupStore } from '@/store/PopupStore';

const AuthPopup = () => {
  const router = useRouter();
  const togglePopup = usePopupStore((state) => state.togglePopup);

  useEffect(() => {
    togglePopup(POPUP_ID.authentication);
  }, []);
  return (
    <Popup
      popupId={POPUP_ID.authentication}
      className="authentication-popup"
      onClose={() => {
        router.back();
      }}
    >
      <AuthContainer />
    </Popup>
  );
};

export default AuthPopup;
