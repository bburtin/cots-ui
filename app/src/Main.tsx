import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row
} from 'react-bootstrap';

import CotsNavbar from './CotsNavbar';

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
      <CotsNavbar />

      <Container>

        <Row xs={1} md={2}>
          {/* Follow game */}
          <Col className="mb-3">
            <Card>
              <Card.Header>Follow</Card.Header>
              <Card.Body>
                <Card.Subtitle className="mb-3">Watch the score of a game in progress</Card.Subtitle>

                <Form onSubmit={handleSubmitViewGame}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      name="viewId"
                      placeholder="TPWR"
                      value={viewId}
                      onChange={handleChangeViewId}
                    />
                    <Form.Text>Game ID</Form.Text>
                  </Form.Group>
                  <Button type="submit">Follow</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Manage game */}
          <Col className="mb-3">
            <Card>
              <Card.Header>Manage</Card.Header>
              <Card.Body>
                <Card.Subtitle className="mb-3">Keep score of a game in progress</Card.Subtitle>

                <Form onSubmit={handleSubmitAdminGame}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      name="adminId"
                      placeholder="CVBX"
                      value={adminId}
                      onChange={handleChangeAdminId}
                    />
                    <Form.Text>Game ID</Form.Text>
                  </Form.Group>
                  <Button type="submit">Manage</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* New game */}
          <Col>
            <Card>
              <Card.Header>New game</Card.Header>
              <Card.Body>
                <Card.Subtitle className="mb-3">Start keeping score</Card.Subtitle>

                <Form onSubmit={handleSubmitCreateGame}>
                  <Row xs={1} md={3}>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                          name="gameName"
                          value={gameName}
                          onChange={handleChangeGameName}
                          placeholder="Volleyball"
                        />
                        <Form.Text>Game name (optional)</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                          name="team1Name"
                          value={team1Name}
                          onChange={handleChangeTeam1Name}
                          placeholder="Spartans"
                          required={true}
                        />
                        <Form.Text>Team 1 name</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                          name="team2Name"
                          value={team2Name}
                          onChange={handleChangeTeam2Name}
                          placeholder="Eagles"
                          required={true}
                        />
                        <Form.Text>Team 2 name</Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit">New</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default function MainBootstrap() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <MainImpl/>
    </ErrorBoundary>
  );
}
