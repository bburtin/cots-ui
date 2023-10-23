import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

import { Game } from './models';
import { GameResponse, gameFromResponse, getRefetchInterval } from './api';


interface Props {
  gameId: string;
}

const horizontalSx = {
  display: 'flex',
  gap: 2
};

class UpdateGameBody {
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

async function updateGameById(id: string, body: UpdateGameBody): Promise<Game> {
  const url = `/api/v1/games/${id}`;
  const response = await axios.patch<GameResponse>(url, body);
  return gameFromResponse(response.data);
}

enum Field { Name, Team1Name, Team1Score, Team2Name, Team2Score };

function addField(prev: Set<Field>, addedField: Field): Set<Field> {
  const newSet = new Set(prev);
  newSet.add(addedField);
  return newSet;
}

function removeField(prev: Set<Field>, removedField: Field): Set<Field> {
  const newSet = new Set(prev);
  newSet.delete(removedField);
  return newSet;
}

const GameForm: React.FC<Props> = ({ gameId }: Props) => {
  const [updatedName, setUpdatedName] = useState<string>('');
  const [updatedTeam1Name, setUpdatedTeam1Name] = useState<string>('');
  const [updatedTeam1Score, setUpdatedTeam1Score] = useState<string>('');
  const [updatedTeam2Name, setUpdatedTeam2Name] = useState<string>('');
  const [updatedTeam2Score, setUpdatedTeam2Score] = useState<string>('');
  const [changedFields, setChangedFields] = useState<Set<Field>>(new Set());
  const [previousGame, setPreviousGame] = useState<Game | null>(null);
  const [refetchInterval, setRefetchInterval] = useState(1000);
  const queryClient = useQueryClient();

  const state = queryClient.getQueryState(['games', gameId]);
  const dataUpdatedAt = state ? new Date(state.dataUpdatedAt) : null;

  function resetEditedState() {
    setUpdatedName('');
    setUpdatedTeam1Name('');
    setUpdatedTeam1Score('');
    setUpdatedTeam2Name('');
    setUpdatedTeam2Score('');
    setChangedFields(new Set<Field>());
  }

  /**
   * If API data has changed, remember the latest version.  This allows
   * us to set the refetch interval.
   * @param game the latest Game object from the API
   */
  function updatePreviousGame(game: Game) {
      if (!previousGame || game.modifiedTime.getTime() !== previousGame.modifiedTime.getTime()) {
        setPreviousGame(game);
      }
  }

  async function fetchGame(): Promise<Game> {
    const game = await getGameById(gameId);
    updatePreviousGame(game);
    const newInterval = getRefetchInterval(refetchInterval, 1000, 16000, previousGame, game);
    setRefetchInterval(newInterval);
    // console.log(`Fetched game ${game.id}, refetchInterval=${newInterval}`);
    return game;
  }

  const query = useQuery({
    queryKey: ['games', gameId],
    queryFn: fetchGame,
    staleTime: refetchInterval,
    refetchInterval: refetchInterval,
    useErrorBoundary: true
  });

  const mutation = useMutation(
    (body: UpdateGameBody) => updateGameById(gameId, body),
    {
      onSuccess: (game, variables, context) => {
        const key = ['games', game.id];
        queryClient.invalidateQueries(key);
        queryClient.setQueryData(key, game);
        resetEditedState();
        updatePreviousGame(game);
        console.log('Mutated, setting refetchInterval to 1000');
        setRefetchInterval(1000);
      },
      useErrorBoundary: true
    }
  );

  function getUpdateBody(): UpdateGameBody {
    const body = new UpdateGameBody();
    if (changedFields.has(Field.Name)) {
      body.name = updatedName;
    }
    if (changedFields.has(Field.Team1Name)) {
      body.team1_name = updatedTeam1Name;
    }
    if (changedFields.has(Field.Team1Score)) {
      body.team1_score = parseInt(updatedTeam1Score);
    }
    if (changedFields.has(Field.Team2Name)) {
      body.team2_name = updatedTeam2Name;
    }
    if (changedFields.has(Field.Team2Score)) {
      body.team2_score = parseInt(updatedTeam2Score);
    }
    return body;
  }

  let errorMessage = null;
  if (query.error instanceof Error) {
    errorMessage = query.error.message;
  }

  let gameName = '';
  let team1Name = '';
  let team1ScoreString = '';
  let team2Name = '';
  let team2ScoreString = '';
  const game: Game | undefined = query.data;

  if (game) {
    if (changedFields.has(Field.Name)) {
      gameName = updatedName;
    } else if (game.name) {
      gameName = game.name;
    }

    team1Name = changedFields.has(Field.Team1Name) ? updatedTeam1Name : game.team1Name;
    team1ScoreString = changedFields.has(Field.Team1Score) ? updatedTeam1Score : String(game.team1Score);
    team2Name = changedFields.has(Field.Team2Name) ? updatedTeam2Name : game.team2Name;
    team2ScoreString = changedFields.has(Field.Team2Score) ? updatedTeam2Score : String(game.team2Score);
  }

  function handleFocusName(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedName(e.target.value);
    setChangedFields(prev => addField(prev, Field.Name));
  }

  function handleFocusTeam1Name(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedTeam1Name(e.target.value);
    setChangedFields(prev => addField(prev, Field.Team1Name));
  }

  function handleFocusTeam1Score(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedTeam1Score(e.target.value);
    setChangedFields(prev => addField(prev, Field.Team1Score));
  }

  function handleFocusTeam2Name(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedTeam2Name(e.target.value);
    setChangedFields(prev => addField(prev, Field.Team2Name));
  }

  function handleFocusTeam2Score(e: React.FocusEvent<HTMLInputElement>) {
    setUpdatedTeam2Score(e.target.value);
    setChangedFields(prev => addField(prev, Field.Team2Score));
  }

  function handleBlurName(e: React.FocusEvent<HTMLInputElement>) {
    if (game && e.target.value === game.name) {
      // Value was not changed.
      setUpdatedName('');
      setChangedFields(prev => removeField(prev, Field.Name));
    }
  }

  function handleBlurTeam1Name(e: React.FocusEvent<HTMLInputElement>) {
    if (game && e.target.value === game.team1Name) {
      // Value was not changed.
      setUpdatedTeam1Name('');
      setChangedFields(prev => removeField(prev, Field.Team1Name));
    }
  }

  function handleBlurTeam1Score(e: React.FocusEvent<HTMLInputElement>) {
    if (game && e.target.value === String(game.team1Score)) {
      // Value was not changed.
      setUpdatedTeam1Score('');
      setChangedFields(prev => removeField(prev, Field.Team1Score));
    }
  }

  function handleBlurTeam2Name(e: React.FocusEvent<HTMLInputElement>) {
    if (game && e.target.value === game.team2Name) {
      // Value was not changed.
      setUpdatedTeam2Name('');
      setChangedFields(prev => removeField(prev, Field.Team2Name));
    }
  }

  function handleBlurTeam2Score(e: React.FocusEvent<HTMLInputElement>) {
    if (game && e.target.value === String(game.team2Score)) {
      // Value was not changed.
      setUpdatedTeam2Score('');
      setChangedFields(prev => removeField(prev, Field.Team2Score));
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
    resetEditedState();
  }

  function handleClickSave(e: React.MouseEvent<HTMLButtonElement>) {
    if (changedFields.size === 0) {
      return;
    }
    mutation.mutate(getUpdateBody());
  }

  function handleClickDecrementTeam1Score(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      const body = new UpdateGameBody();
      body.team1_score = game.team1Score - 1;
      mutation.mutate(body);
    }
  }

  function handleClickIncrementTeam1Score(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      const body = new UpdateGameBody();
      body.team1_score = game.team1Score + 1;
      mutation.mutate(body);
    }
  }

  function handleClickDecrementTeam2Score(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      const body = new UpdateGameBody();
      body.team2_score = game.team2Score - 1;
      mutation.mutate(body);
    }
  }

  function handleClickIncrementTeam2Score(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      const body = new UpdateGameBody();
      body.team2_score = game.team2Score + 1;
      mutation.mutate(body);
    }
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
            color={changedFields.has(Field.Name) ? 'warning' : 'neutral'}
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
            color={changedFields.has(Field.Team1Name) ? 'warning' : 'neutral'}
          />
        </FormControl>
        <FormControl>
          <Input
            name="team1Score"
            startDecorator={<Button onClick={handleClickDecrementTeam1Score}>-</Button>}
            endDecorator={<Button onClick={handleClickIncrementTeam1Score}>+</Button>}
            value={team1ScoreString}
            onFocus={handleFocusTeam1Score}
            onBlur={handleBlurTeam1Score}
            onChange={handleChangeTeam1Score}
            color={changedFields.has(Field.Team1Score) ? 'warning' : 'neutral'}
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
            color={changedFields.has(Field.Team2Name) ? 'warning' : 'neutral'}
          />
        </FormControl>
        <FormControl>
          <Input
            name="team2Score"
            startDecorator={<Button onClick={handleClickDecrementTeam2Score}>-</Button>}
            endDecorator={<Button onClick={handleClickIncrementTeam2Score}>+</Button>}
            value={team2ScoreString}
            onFocus={handleFocusTeam2Score}
            onBlur={handleBlurTeam2Score}
            onChange={handleChangeTeam2Score}
            color={changedFields.has(Field.Team2Score) ? 'warning' : 'neutral'}
          />
        </FormControl>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <Button
          disabled={changedFields.size === 0}
          onClick={handleClickSave}>
            Save
        </Button>
        <Button
          disabled={changedFields.size === 0}
          onClick={handleClickUndo}>
            Undo
        </Button>
        {game && (
          <Sheet>
            <b>Admin ID:</b> <Link to={`/admin/${game.adminId}`}>{game.adminId}</Link><br/>
            <b>View ID:</b> <Link to={`/view/${game.viewId}`}>{game.viewId}</Link>
          </Sheet>
        )}
      </Sheet>
      {dataUpdatedAt && <p>Data updated at {dataUpdatedAt.toLocaleTimeString()}.</p>}
    </CssVarsProvider>
  )
}

export default GameForm;
