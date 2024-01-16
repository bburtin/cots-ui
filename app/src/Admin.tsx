import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import CotsNavbar from './CotsNavbar';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';
import GameForm from './GameForm';
import useGetGameApi from './hooks/useGetGameApi';

interface Props {
  adminId: string;
}

/**
 * Wraps GameForm and looks up a Game by its adminId.  This allows
 * Admin to catch exceptions with its error boundary.
 */
const ApiWrapper: React.FC<Props> = ({ adminId }: Props) => {
  const api = useGetGameApi(adminId);
  const game = api.game;

  return (
    <>
      {game && <GameForm gameId={game.id} />}
      {!game && <h3>Loading game {adminId}...</h3>}
    </>
  );
}

function Admin() {
  const { adminId } = useParams();

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <CotsNavbar/>
        { adminId && <ApiWrapper adminId={adminId} /> }
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen />
    </>
  );
}

export default Admin;
