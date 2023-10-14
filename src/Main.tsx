import { useState } from 'react';

import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

const horizontalSx = {
  display: 'flex',
  gap: 2
};

function Main() {
  const [viewId, setViewId] = useState('');
  const [adminId, setAdminId] = useState('');

  function handleChangeViewId(e: React.ChangeEvent<HTMLInputElement>) {
    setViewId(e.target.value);
  }

  function handleChangeAdminId(e: React.ChangeEvent<HTMLInputElement>) {
    setAdminId(e.target.value);
  }

  function handleClickViewGame(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(`Viewing game ${viewId}`);
  }

  function handleClickAdminGame(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(`Administering game ${adminId}`);
  }

  return (
    <CssVarsProvider>
      <h1>Check Out the Score!</h1>
      <Sheet sx={horizontalSx}>
        <FormControl orientation="horizontal">
          <FormLabel>View game</FormLabel>
          <Input
            name="viewId"
            onChange={handleChangeViewId}
            endDecorator={<Button onClick={handleClickViewGame}>+</Button>}
          />
        </FormControl>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <FormControl orientation="horizontal">
          <FormLabel>Administer game</FormLabel>
          <Input
            name="adminId"
            onChange={handleChangeAdminId}
            endDecorator={<Button onClick={handleClickAdminGame}>+</Button>}
          />
        </FormControl>
      </Sheet>
    </CssVarsProvider>
  );
}

export default Main;
