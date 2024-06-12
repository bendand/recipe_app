import { useEffect, useState } from 'react';

export function useFetch(fetchFn, initialValue) {
    const [isFetching, setIsFetching] = useState();
    const [error, setError] = useState();
    const [fetchedData, setFetchedData] = useState(initialValue);

    useEffect(() => {
        async function fetchData() {
            setIsFetching(true);
            try {
                console.log('trying to fetch fetchFn data');
                const data = await fetchFn();
                console.log('fetched data: ' + data);
                setFetchedData(data);
            } catch (error) {
                setError({message: error.message || 'Failed to fetch data'});
                setIsFetching(false);
            }
            setIsFetching(false);
        }

        fetchData();
    }, [fetchFn]);

    return {
        isFetching,
        fetchedData,
        setFetchedData,
        error
    }
}



