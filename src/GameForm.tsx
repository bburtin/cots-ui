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

interface UpdateGameBody {
  name?: string;
  team1_name?: string;
  team1_score?: number;
  team2_name?: string;
  team2_score?: number;
};

async function updateGame(
  id: string,
  name?: string,
  team1Name?: string,
  team1Score?: number,
  team2Name?: string,
  team2Score?: number
) {
  const url = `/api/v1/games/${id}`;
  const body: UpdateGameBody = {
    name: name,
    team1_name: team1Name,
    team1_score: team1Score,
    team2_name: team2Name,
    team2_score: team2Score
  };
  const response = await axios.patch<GameResponse>(url, body);
  return gameFromResponse(response.data);
}

interface UpdateGameBody {
  name?: string;
  team1_name?: string;
  team1_score?: number;
  team2_name?: string;
  team2_score?: number;
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

  function handleFocusName(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedName(e.target.value);
  }

  function handleFocusTeam1Name(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedTeam1Name(e.target.value);
  }

  function handleFocusTeam1Score(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedTeam1Score(e.target.value);
  }

  function handleFocusTeam2Name(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedTeam2Name(e.target.value);
  }

  function handleFocusTeam2Score(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedTeam2Score(e.target.value);
  }

  function handleBlurName(e: React.FocusEvent<HTMLInputElement>) {
    if (data && e.target.value === data.name) {
      // Value was not changed.
      setUpdatedName('');
    }
  }

  function handleBlurTeam1Name(e: React.FocusEvent<HTMLInputElement>) {
    if (data && e.target.value === data.team1Name) {
      // Value was not changed.
      setUpdatedTeam1Name('');
    }
  }

  function handleBlurTeam1Score(e: React.FocusEvent<HTMLInputElement>) {
    if (data && e.target.value === String(data.team1Score)) {
      // Value was not changed.
      setUpdatedTeam1Score('');
    }
  }

  function handleBlurTeam2Name(e: React.FocusEvent<HTMLInputElement>) {
    if (data && e.target.value === data.team2Name) {
      // Value was not changed.
      setUpdatedTeam2Name('');
    }
  }

  function handleBlurTeam2Score(e: React.FocusEvent<HTMLInputElement>) {
    if (data && e.target.value === String(data.team2Score)) {
      // Value was not changed.
      setUpdatedTeam2Score('');
    }
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
            onFocus={handleFocusName}
            onBlur={handleBlurName}
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
            onFocus={handleFocusTeam1Name}
            onBlur={handleBlurTeam1Name}
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
            onFocus={handleFocusTeam1Score}
            onBlur={handleBlurTeam1Score}
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
            onFocus={handleFocusTeam2Name}
            onBlur={handleBlurTeam2Name}
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
            onFocus={handleFocusTeam2Score}
            onBlur={handleBlurTeam2Score}
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
