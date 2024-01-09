import React from 'react';

import { Alert } from 'react-bootstrap';

interface Props {
  targetName: string;
  closeCallback: (e: React.MouseEvent<HTMLElement>) => void;
}

const CopiedToClipboardAlert: React.FC<Props> = ({ targetName, closeCallback }: Props) => {
  return (
    <Alert dismissible variant="success">
      Copied {targetName} to clipboard.
    </Alert>
  );
}

export default CopiedToClipboardAlert;
