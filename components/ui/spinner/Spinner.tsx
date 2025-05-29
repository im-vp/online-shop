import React, { FC } from 'react';

import style from '@/styles/ui/spinner/spinner.module.css';

interface Props {
  color?: string;
  css?: React.CSSProperties;
}

const Spinner: FC<Props> = ({ color = '#fff', css = {} }) => {
  const defaultCss = {
    '--color': color,
  } as React.CSSProperties;
  return <div style={{ ...defaultCss, ...css }} className={style.spinner}></div>;
};

export default Spinner;
