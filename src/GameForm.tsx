import React, { useState } from 'react';
import {
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios';

import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

import { Game } from './models';
import { GameResponse, gameFromResponse } from './api';


interface Props {
  gameId: string;
}

const horizontalSx = {
  display: 'flex',
  gap: 2
};

async function getGameById(id: string): Promise<Game> {
  const url = `/api/v1/games/${id}`;
  const response = await axios.get<GameResponse>(url);
  return gameFromResponse(response.data);
}

enum Focused { None, Name, Team1Name, Team1Score, Team2Name, Team2Score };

const GameForm: React.FC<Props> = ({ gameId }: Props) => {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['games', gameId],
    queryFn: () => getGameById(gameId),
    staleTime: 5000,
    refetchInterval: 1000
  });
  const [focused, setFocused] = useState<Focused>(Focused.None);
  const [updatedName, setUpdatedName] = useState<string>('');
  const [updatedTeam1Name, setUpdatedTeam1Name] = useState<string>('');
  const [updatedTeam1Score, setUpdatedTeam1Score] = useState<string>('');
  const [updatedTeam2Name, setUpdatedTeam2Name] = useState<string>('');
  const [updatedTeam2Score, setUpdatedTeam2Score] = useState<string>('');

  let errorMessage = null;
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  let gameName = '';
  let team1Name = '';
  let team1ScoreString = '';
  let team2Name = '';
  let team2ScoreString = '';

  if (data) {
    gameName = updatedName || data.name;
    team1Name = updatedTeam1Name || data.team1Name;
    team1ScoreString = updatedTeam1Score || String(data.team1Score);
    team2Name = updatedTeam2Name || data.team2Name;
    team2ScoreString = updatedTeam2Score || String(data.team2Score);
  }

  console.log('Rendering, focused=' + focused);

  function handleFocus(newFocused: Focused) {
    setFocused(newFocused);
  }

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setUpdatedName(e.target.value);
  }

  function handleChangeTeam1Name(e: React.ChangeEvent<HTMLInputElement>) {
    setUpdatedTeam1Name(e.target.value);
  }

  function handleChangeTeam1Score(e: React.ChangeEvent<HTMLInputElement>) {
    setUpdatedTeam1Score(e.target.value);
  }

  function handleChangeTeam2Name(e: React.ChangeEvent<HTMLInputElement>) {
    setUpdatedTeam2Name(e.target.value);
  }

  function handleChangeTeam2Score(e: React.ChangeEvent<HTMLInputElement>) {
    setUpdatedTeam2Score(e.target.value);
  }

  function handleClickUndo(e: React.MouseEvent<HTMLButtonElement>) {
    setUpdatedName('');
    setUpdatedTeam1Name('');
    setUpdatedTeam1Score('');
    setUpdatedTeam2Name('');
    setUpdatedTeam2Score('');
  }

  return (
    <CssVarsProvider>
      <Sheet sx={horizontalSx}>
        <FormControl orientation="horizontal">
          <FormLabel>Game</FormLabel>
          <Input
            name="gameName"
            value={gameName}
            onFocus={() => handleFocus(Focused.Name)}
            onBlur={() => handleFocus(Focused.None)}
            onChange={handleChangeName}
            color={updatedName ? 'warning' : 'neutral'}
          />
        </FormControl>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <FormControl orientation="horizontal">
          <FormLabel>Team 1</FormLabel>
          <Input
            name="team1Name"
            value={team1Name}
            onFocus={() => handleFocus(Focused.Team1Name)}
            onBlur={() => handleFocus(Focused.None)}
            onChange={handleChangeTeam1Name}
            color={updatedTeam1Name ? 'warning' : 'neutral'}
          />
        </FormControl>
        <FormControl>
          <Input
            name="team1Score"
            startDecorator={<Button>-</Button>}
            endDecorator={<Button>+</Button>}
            value={team1ScoreString}
            onFocus={() => handleFocus(Focused.Team1Score)}
            onBlur={() => handleFocus(Focused.None)}
            onChange={handleChangeTeam1Score}
            color={updatedTeam1Score ? 'warning' : 'neutral'}
          />
        </FormControl>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <FormControl orientation="horizontal">
          <FormLabel>Team 2</FormLabel>
          <Input
            name="team2Name"
            value={team2Name}
            onFocus={() => handleFocus(Focused.Team2Name)}
            onBlur={() => handleFocus(Focused.None)}
            onChange={handleChangeTeam2Name}
            color={updatedTeam2Name ? 'warning' : 'neutral'}
          />
        </FormControl>
        <FormControl>
          <Input
            name="team2Score"
            startDecorator={<Button>-</Button>}
            endDecorator={<Button>+</Button>}
            value={team2ScoreString}
            onFocus={() => handleFocus(Focused.Team2Score)}
            onBlur={() => handleFocus(Focused.None)}
            onChange={handleChangeTeam2Score}
            color={updatedTeam2Score ? 'warning' : 'neutral'}
          />
        </FormControl>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <Button>Save</Button>
        <Button onClick={handleClickUndo}>Undo</Button>
        <Sheet>
          <b>Game ID:</b>
          <Button>BRCV</Button>
          <b>Admin ID:</b><Button>WXTL</Button>
        </Sheet>
      </Sheet>
    </CssVarsProvider>
  )
}

export default GameForm;
