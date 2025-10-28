/**
 * Custom hook to replace Convex useQuery
 * Provides similar API but uses Supabase
 */

import { useEffect, useState } from 'react';

export function useSupabaseQuery(queryFn, args = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await queryFn(args);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.error('Query error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(args)]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}

export function useSupabaseMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(args);
      return result;
    } catch (err) {
      setError(err);
      console.error('Mutation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
