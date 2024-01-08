import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';

import { Game } from './models';
import { GameResponse, gameFromResponse } from './api';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

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

function MainImpl() {
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
      },
      useErrorBoundary: true
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
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} /> { /* Spacing above */ }

        <Grid item xs={0} sm={2} /> { /* Spacing to the left */ }
        <Grid item xs={12} sm={8}>
          <Card>
            <form onSubmit={handleSubmitViewGame}>
              <CardHeader title="Follow" subheader="Follow the score of a game in progress"/>
              <CardContent>
                  <TextField
                    name="viewId"
                    placeholder="TPWR"
                    value={viewId}
                    onChange={handleChangeViewId}
                    helperText="Game ID"
                  />
              </CardContent>
              <CardActions>
                <Button variant="contained">Follow</Button>
              </CardActions>
            </form>
          </Card>
        </Grid>
        <Grid item xs={0} sm={2} /> { /* Spacing to the right */ }

        <Grid item xs={0} sm={2} /> { /* Spacing to the left */ }
        <Grid item xs={12} sm={8}>
          <Card>
            <form onSubmit={handleSubmitAdminGame}>
              <CardHeader title="Manage" subheader="Keep score of a game in progress" />
              <CardContent>
                <TextField
                  name="adminId"
                  placeholder="NCTD"
                  value={adminId}
                  onChange={handleChangeAdminId}
                  helperText="Game ID"
                />
              </CardContent>
              <CardActions>
                <Button variant="contained">Manage</Button>
              </CardActions>
            </form>
          </Card>
        </Grid>
        <Grid item xs={0} sm={2} /> { /* Spacing to the right */ }

        <Grid item xs={0} sm={2} /> { /* Spacing to the left */ }
        <Grid item xs={12} sm={8}>
          <Card>
            <form onSubmit={handleSubmitCreateGame}>
              <CardHeader title="New game" subheader="Start keeping score of a game" />
              <CardContent>
                <TextField
                  name="gameName"
                  placeholder="Volleyball"
                  value={gameName}
                  onChange={handleChangeGameName}
                  helperText="Game name (optional)"
                />
                <TextField
                  name="team1Name"
                  value={team1Name}
                  onChange={handleChangeTeam1Name}
                  helperText="Team 1"
                  required
                />
                <TextField
                  name="team1Name"
                  value={team2Name}
                  onChange={handleChangeTeam2Name}
                  helperText="Team 2"
                  required
                />
              </CardContent>
              <CardActions>
                <Button variant="contained">New</Button>
              </CardActions>
            </form>
          </Card>
        </Grid>
        <Grid item xs={0} sm={2} /> { /* Spacing to the right */ }

      </Grid>
   </>
  );
}

function Main() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <MainImpl/>
    </ErrorBoundary>
  );
}

export default Main;
