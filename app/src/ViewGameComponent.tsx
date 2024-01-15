import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import {
  Card,
  Col,
  Container,
  Row
} from 'react-bootstrap';

import ErrorBoundaryFallback from './ErrorBoundaryFallback';
import CotsNavbar from './CotsNavbar';
import { useCotsApi } from './hooks';

interface Props {
  viewId: string;
}

/**
 * Wraps the API to get Game data.  This allows ViewGame to render HTTP erors
 * with an error boundry.
 */
const ApiWrapper: React.FC<Props> = ({ viewId }: Props) => {
  const api = useCotsApi(viewId);
  const game = api.viewGame;
  const dataUpdatedAt = api.dataUpdatedAt;

  return (
    <>
      <CotsNavbar />
      {game && (
        <Container>
          <Card>
            <Card.Header className="text-center mb-3">{game.name}</Card.Header>
            <Row xs={1} md={2}>
              <Col className="text-center mb-3">
                <h3>{game.team1Name}</h3>
                <h1>{game.team1Score}</h1>
              </Col>
              <Col className="text-center mb-3">
                <h3>{game.team2Name}</h3>
                <h1>{game.team2Score}</h1>
              </Col>
            </Row>
            <Card.Footer>{dataUpdatedAt && <div>Updated at {dataUpdatedAt.toLocaleTimeString()}.</div>}</Card.Footer>
          </Card>
        </Container>
      )}
      {!game && <h3>Loading game {viewId}...</h3>}
    </>
  );
}

function ViewGameComponent() {
  const { viewId } = useParams();

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} >
        {viewId && <ApiWrapper viewId={viewId} />}
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen />
    </>
  );
}

export default ViewGameComponent;
