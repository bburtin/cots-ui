import React, { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { CssVarsProvider } from '@mui/joy/styles';

import GameForm from './GameForm';

interface Props {
  gameId: string;
}

const Main: React.FC<Props> = ({ gameId }: Props) => {
  return (
    <CssVarsProvider>
      <GameForm gameId={gameId} />
      <ReactQueryDevtools initialIsOpen />
    </CssVarsProvider>
  );
}

export default Main;
