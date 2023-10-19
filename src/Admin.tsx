import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssVarsProvider } from '@mui/joy/styles';

import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

import ErrorBoundaryFallback from './ErrorBoundaryFallback';
import GameForm from './GameForm';
import { Game } from './models';
import { GameResponse, gameFromResponse } from './api';

async function getGameByAdminId(adminId: string | undefined): Promise<Game> {
  const url = `/api/v1/games/admin_id/${adminId}`;
  const response = await axios.get<GameResponse>(url);
  return gameFromResponse(response.data);
}

interface Props {
  adminId: string;
}

/**
 * Wraps GameForm and looks up a Game by its adminId.  This allows
 * Admin to catch exceptions with its error boundary.
 */
const ApiWrapper: React.FC<Props> = ({ adminId }: Props) => {
  const query = useQuery({
    queryKey: ['games', 'adminId', adminId],
    queryFn: () => getGameByAdminId(adminId),
    useErrorBoundary: true
  });
  const queryClient = useQueryClient();

  let game: Game | null = null;
  if (query.data) {
    game = query.data;
    const key = ['games', game.id];
    queryClient.invalidateQueries(key);
    queryClient.setQueryData(key, game);
  }

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
    <CssVarsProvider>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        {adminId && <ApiWrapper adminId={adminId} />}
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen />
    </CssVarsProvider>
  );
}

export default Admin;
