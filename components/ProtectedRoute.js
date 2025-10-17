import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getToken, isTokenValid } from '../lib/auth';

export default function withAuth(WrappedComponent) {
  return function Protected(props) {
    const router = useRouter();
    useEffect(() => {
      const token = getToken();
      if (!isTokenValid(token)) {
        router.replace('/login?message=' + encodeURIComponent("You've been logged out"));
      }
    }, []);
    return <WrappedComponent {...props} />;
  };
}
