import React from 'react';

import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

import { Game } from './models';

interface Props {
  game: Game;
}

const horizontalSx = {
  display: 'flex',
  gap: 2
};

const GameForm: React.FC<Props> = ({ game }: Props) => {
  return (
    <CssVarsProvider>
      <Sheet sx={horizontalSx}>
        <FormControl orientation="horizontal">
          <FormLabel>Game</FormLabel>
          <Input
            name="gameName"
            value={game.name}
          />
        </FormControl>
        <Typography level="h3">10:42</Typography>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <FormControl orientation="horizontal">
          <FormLabel>Team 1</FormLabel>
          <Input
            name="team1Name"
            value={game.team1Name}
          />
        </FormControl>
        <FormControl>
          <Input
            name="team1Score"
            startDecorator={<Button>-</Button>}
            endDecorator={<Button>+</Button>}
            value={game.team1Score}
          />
        </FormControl>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <FormControl orientation="horizontal">
          <FormLabel>Team 2</FormLabel>
          <Input
            name="team2Name"
            value={game.team2Name}
          />
        </FormControl>
        <FormControl>
          <Input
              name="team2Score"
              startDecorator={<Button>-</Button>}
              endDecorator={<Button>+</Button>}
              value={game.team2Score}
            />
        </FormControl>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <Button>Start game</Button>
        <Sheet>
          <b>Start time</b>: July 12, 2023 10:00<br/>
          <b>End time:</b><br/>
        </Sheet>
      </Sheet>

      <Sheet sx={horizontalSx}>
        <Button>Save</Button>
        <Button>Undo</Button>
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
