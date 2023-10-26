import axios from 'axios';
import { FallbackProps } from 'react-error-boundary';

function handleAxiosError(error: unknown): [number | null, string] {
  let status = null;
  let errorMessage = '';

  if (axios.isAxiosError(error) && error.response) {
    status = error.response.status;
    const statusCategory = Math.floor(status / 100);
    if (statusCategory === 4) {
      errorMessage = error.response.data['detail'];
    }
  }

  return [status, errorMessage];
}

function ErrorBoundaryFallback(props: FallbackProps) {
  const [statusCode, errorMessage] = handleAxiosError(props.error);
  if (statusCode) {
    if (statusCode === 500) {
      return <h3>Server error</h3>
    }
    let formattedMessage = `Server returned ${statusCode}`;
    if (errorMessage) {
      formattedMessage += `, ${errorMessage}`;
    }
    return <h3>{formattedMessage}</h3>;
  }
  return <h3>Something went wrong</h3>
}

export default ErrorBoundaryFallback;
