import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

import { Game } from './models';
import { GameResponse, gameFromResponse } from './api';

const horizontalSx = {
  display: 'flex',
  gap: 2
};

class CreateGameBody {
  name?: string;
  team1_name: string;
  team2_name: string;

  constructor(team1Name: string, team2Name: string) {
    this.team1_name = team1Name;
    this.team2_name = team2Name;
  }
};

async function createGame(body: CreateGameBody): Promise<Game> {
  console.log(`Creating a game: ${JSON.stringify(body)}`);
  const response = await axios.post<GameResponse>('/api/v1/games', body);
  console.log(`Received status ${response.status}, ${JSON.stringify(response.data)}`)
  return gameFromResponse(response.data);
}

function Main() {
  const [viewId, setViewId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [gameName, setGameName] = useState('');

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(
    (body: CreateGameBody) => createGame(body),
    {
      onSuccess: (game, variables, context) => {
        const key = ['games', game.id];
        queryClient.setQueryData(key, game);
        navigate(`/admin/${game.adminId}`);
      }
    }
  );

  function handleChangeViewId(e: React.ChangeEvent<HTMLInputElement>) {
    const upper = (e.target.value || '').toUpperCase();
    setViewId(upper.slice(0, 4));
  }

  function handleSubmitViewGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(`/view/${viewId}`);
  }

  function handleChangeAdminId(e: React.ChangeEvent<HTMLInputElement>) {
    const upper = (e.target.value || '').toUpperCase();
    setAdminId(upper.slice(0, 4));
  }

  function handleSubmitAdminGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(`/admin/${adminId}`);
  }

  function handleChangeTeam1Name(e: React.ChangeEvent<HTMLInputElement>) {
    setTeam1Name(e.target.value);
  }

  function handleChangeTeam2Name(e: React.ChangeEvent<HTMLInputElement>) {
    setTeam2Name(e.target.value);
  }

  function handleChangeGameName(e: React.ChangeEvent<HTMLInputElement>) {
    setGameName(e.target.value);
  }

  function handleSubmitCreateGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Creating a game');
    const body = new CreateGameBody(team1Name, team2Name);
    if (gameName) {
      body.name = gameName;
    }
    mutation.mutate(body);
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

      <h3>Create a game:</h3>
      <Sheet sx={horizontalSx}>
        <form onSubmit={handleSubmitCreateGame}>
          <FormControl>
            <FormLabel>Team 1</FormLabel>
            <Input
              name="team1Name"
              placeholder="Team name"
              value={team1Name}
              onChange={handleChangeTeam1Name}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Team 2</FormLabel>
            <Input
              name="team2Name"
              placeholder="Team name"
              value={team2Name}
              onChange={handleChangeTeam2Name}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Game <i>(Optional)</i></FormLabel>
            <Input
              name="gameName"
              placeholder="Game name"
              value={gameName}
              onChange={handleChangeGameName}
            />
          </FormControl>

          <FormControl>
            <Button type="submit">Create</Button>
          </FormControl>
        </form>
      </Sheet>
    </CssVarsProvider>
  );
}

export default Main;
