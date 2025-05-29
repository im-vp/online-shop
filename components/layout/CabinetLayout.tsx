import React, { FC } from 'react';

import CabinetMenu from '@/components/modules/cabinet/CabinetMenu';

interface Props {
  children: React.ReactNode;
}

const CabinetLayout: FC<Props> = ({ children }) => {
  return (
    <div className="cabinet-page">
      <div className="cabinet-page__side">
        <CabinetMenu />
      </div>
      <section className="cabinet-page__content">{children}</section>
    </div>
  );
};

export default CabinetLayout;
