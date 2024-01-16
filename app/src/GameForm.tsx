import React, { useState } from 'react';
import axios from 'axios';

import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Stack
} from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';

import { UpdateGameBody } from './api';
import CopiedToClipboardAlert from './CopiedToClipboardAlert';
import useAdminGameApi from './hooks/useAdminGameApi';

interface Props {
  gameId: string;
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

const BootstrapGameForm: React.FC<Props> = ({ gameId }: Props) => {
  const [updatedName, setUpdatedName] = useState<string>('');
  const [updatedTeam1Name, setUpdatedTeam1Name] = useState<string>('');
  const [updatedTeam1Score, setUpdatedTeam1Score] = useState<string>('');
  const [updatedTeam2Name, setUpdatedTeam2Name] = useState<string>('');
  const [updatedTeam2Score, setUpdatedTeam2Score] = useState<string>('');
  const [changedFields, setChangedFields] = useState<Set<Field>>(new Set());
  const [showViewClipboardAlert, setShowViewClipboardAlert] = useState(false);
  const [showAdminClipboardAlert, setShowAdminClipboardAlert] = useState(false);
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  function resetEditedState() {
    setUpdatedName('');
    setUpdatedTeam1Name('');
    setUpdatedTeam1Score('');
    setUpdatedTeam2Name('');
    setUpdatedTeam2Score('');
    setChangedFields(new Set<Field>());
  }

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

  let gameName = '';
  let team1Name = '';
  let team1ScoreString = '';
  let team2Name = '';
  let team2ScoreString = '';

  const api = useAdminGameApi(gameId);
  const game = api.game;

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (changedFields.size === 0) {
      return;
    }
    api.mutate(getUpdateBody());
    resetEditedState();
  }

  function handleClickDecrementTeam1Score(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      const body = new UpdateGameBody();
      body.team1_score = game.team1Score - 1;
      api.mutate(body);
      resetEditedState();
    }
  }

  function handleClickIncrementTeam1Score(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      const body = new UpdateGameBody();
      body.team1_score = game.team1Score + 1;
      api.mutate(body);
      resetEditedState();
    }
  }

  function handleClickDecrementTeam2Score(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      const body = new UpdateGameBody();
      body.team2_score = game.team2Score - 1;
      api.mutate(body);
      resetEditedState();
    }
  }

  function handleClickIncrementTeam2Score(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      const body = new UpdateGameBody();
      body.team2_score = game.team2Score + 1;
      api.mutate(body);
      resetEditedState();
    }
  }

  function handleClickCopyViewLinkToClipboard(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      navigator.clipboard.writeText(`${baseUrl}/view/${game.viewId}`);
      setShowViewClipboardAlert(true);

      // Turn off admin alert if it's currently being shown, since clipboard
      // contents have been replaced.
      setShowAdminClipboardAlert(false);
    }
  }

  function handleClickCopyAdminLinkToClipboard(e: React.MouseEvent<HTMLButtonElement>) {
    if (game) {
      navigator.clipboard.writeText(`${baseUrl}/admin/${game.adminId}`);
      setShowAdminClipboardAlert(true);

      // Turn off view alert if it's currently being shown, since clipboard
      // contents have been replaced.
      setShowViewClipboardAlert(false);
    }
  }

  function closeViewClipboardAlertHandler(e: React.MouseEvent<HTMLElement>) {
    setShowViewClipboardAlert(false);
  }

  function closeAdminClipboardAlertHandler(e: React.MouseEvent<HTMLElement>) {
    setShowAdminClipboardAlert(false);
  }

  return (
    <Container>
      <Card>
        <Card.Header>Keep score</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Control
                    name="gameName"
                    value={gameName}
                    onFocus={handleFocusName}
                    onBlur={handleBlurName}
                    onChange={handleChangeName}
                    className={changedFields.has(Field.Name) ? 'border-warning' : ''}
                  />
                  <Form.Text>Game name</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Row xs={1} md={2}>
                  <Col className="mb-3">
                    <Form.Group>
                      <Form.Control
                        name="team1Name"
                        value={team1Name}
                        onFocus={handleFocusTeam1Name}
                        onBlur={handleBlurTeam1Name}
                        onChange={handleChangeTeam1Name}
                        className={changedFields.has(Field.Team1Name) ? 'border-warning' : ''}
                      />
                      <Form.Text>Team 1</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className="mb-3">
                    <InputGroup>
                      <Button onClick={handleClickDecrementTeam1Score}>-</Button>
                      <Form.Control
                        name="team1Score"
                        value={team1ScoreString}
                        onFocus={handleFocusTeam1Score}
                        onBlur={handleBlurTeam1Score}
                        onChange={handleChangeTeam1Score}
                        className={changedFields.has(Field.Team1Score) ? 'border-warning' : ''}
                      />
                      <Button onClick={handleClickIncrementTeam1Score}>+</Button>
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col>
                <Row xs={1} md={2}>
                  <Col className="mb-3">
                    <Form.Group>
                      <Form.Control
                        name="team2Name"
                        value={team2Name}
                        onFocus={handleFocusTeam2Name}
                        onBlur={handleBlurTeam2Name}
                        onChange={handleChangeTeam2Name}
                        className={changedFields.has(Field.Team2Name) ? 'border-warning' : ''}
                      />
                      <Form.Text>Team 2</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className="mb-3">
                    <InputGroup>
                      <Button onClick={handleClickDecrementTeam2Score}>-</Button>
                      <Form.Control
                        name="team2Score"
                        value={team2ScoreString}
                        onFocus={handleFocusTeam2Score}
                        onBlur={handleBlurTeam2Score}
                        onChange={handleChangeTeam2Score}
                        className={changedFields.has(Field.Team2Score) ? 'border-warning' : ''}
                      />
                      <Button onClick={handleClickIncrementTeam2Score}>+</Button>
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row xs={1} md={3}>
              <Col className="mb-3">
                <Stack direction="horizontal" gap={3}>
                  <Button
                    type="submit"
                    disabled={changedFields.size === 0}
                  >
                    Save
                  </Button>
                  <Button
                    disabled={changedFields.size === 0}
                    onClick={handleClickUndo}
                  >
                    Undo
                  </Button>
                </Stack>
              </Col>
              <Col className="mb-3">
                {game &&
                  <Stack direction="horizontal" gap={3}>
                    View ID: <Card.Link href={`/view/${game.viewId}`}>{game.viewId}</Card.Link>
                    <Button onClick={handleClickCopyViewLinkToClipboard}><Clipboard/></Button>
                  </Stack>
                }
              </Col>
              <Col className="mb-3">
                {game &&
                  <Stack direction="horizontal" gap={3}>
                    Admin ID: <Card.Link href={`/admin/${game.adminId}`}>{game.adminId}</Card.Link>
                    <Button onClick={handleClickCopyAdminLinkToClipboard}><Clipboard/></Button>
                  </Stack>
                }
              </Col>
            </Row>
          </Form>

        </Card.Body>
        <Card.Footer>
          {api.dataUpdatedAt &&
            <div>Updated at {api.dataUpdatedAt.toLocaleTimeString()}</div>
          }
        </Card.Footer>
      </Card>
      {showViewClipboardAlert &&
        <CopiedToClipboardAlert
          targetName="view link"
          closeCallback={closeViewClipboardAlertHandler}
        />
      }
      {showAdminClipboardAlert &&
        <CopiedToClipboardAlert
          targetName="admin link"
          closeCallback={closeAdminClipboardAlertHandler}
        />
      }
    </Container>
  );
}

export default BootstrapGameForm;
