import React from 'react';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/joy/IconButton';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface Props {
  targetName: string;
  closeCallback: (e: React.MouseEvent<HTMLElement>) => void;
}

const CopiedToClipboardAlert: React.FC<Props> = ({ targetName, closeCallback }: Props) => {
  return (
    <Alert
      variant="soft"
      color="success"
      startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
      endDecorator={
        <IconButton variant="plain" size="sm" color="neutral" onClick={closeCallback}>
          <CloseRoundedIcon />
        </IconButton>
      }
    >
      Copied {targetName} to clipboard.
    </Alert>
  );}

export default CopiedToClipboardAlert;
