import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

const horizontalSx = {
  display: 'flex',
  gap: 2
};

function Main() {
  const [viewId, setViewId] = useState('');
  const [adminId, setAdminId] = useState('');
  const navigate = useNavigate();

  function handleChangeViewId(e: React.ChangeEvent<HTMLInputElement>) {
    const upper = (e.target.value || '').toUpperCase();
    setViewId(upper.slice(0, 4));
  }

  function handleChangeAdminId(e: React.ChangeEvent<HTMLInputElement>) {
    const upper = (e.target.value || '').toUpperCase();
    setAdminId(upper.slice(0, 4));
  }

  function handleSubmitViewGame(e: React.FormEvent<HTMLFormElement>) {
    navigate(`/view/${viewId}`);
  }

  function handleSubmitAdminGame(e: React.FormEvent<HTMLFormElement>) {
    navigate(`/admin/${adminId}`);
  }

  return (
    <CssVarsProvider>
      <h1>Check Out the Score!</h1>
      <Sheet sx={horizontalSx}>
        <form onSubmit={handleSubmitViewGame}>
          <FormControl orientation="horizontal">
            <Input
              name="viewId"
              placeholder="TPWR"
              value={viewId}
              onChange={handleChangeViewId}
              endDecorator={
                <Button type="submit">View</Button>
              }
            />
          </FormControl>
        </form>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <form onSubmit={handleSubmitAdminGame}>
          <FormControl orientation="horizontal">
            <Input
              name="adminId"
              placeholder="NCTD"
              value={adminId}
              onChange={handleChangeAdminId}
              endDecorator={
                <Button type="submit">Administer</Button>
              }
            />
          </FormControl>
        </form>
      </Sheet>
    </CssVarsProvider>
  );
}

export default Main;
