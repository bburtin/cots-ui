import { FallbackProps } from 'react-error-boundary';
import { handleAxiosError } from './api';

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
