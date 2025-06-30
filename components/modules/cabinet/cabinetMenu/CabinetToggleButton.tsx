import { FC } from 'react';

interface Props {
  isMenuShow: boolean;
  setIsMenuShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const CabinetToggleButton: FC<Props> = ({ setIsMenuShow, isMenuShow }) => {
  return (
    <button
      type="button"
      className={`${'cabinet-page__menu-toggle-btn'} ${isMenuShow ? 'cabinet-page__menu-toggle-btn--active' : ''}`}
      onClick={() => setIsMenuShow((prev) => !prev)}
    >
      Меню кабинета
    </button>
  );
};

export default CabinetToggleButton;
