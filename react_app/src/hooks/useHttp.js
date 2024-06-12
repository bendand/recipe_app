import { useState, useEffect, useCallback } from 'react';

import { useSelector } from "react-redux";

// const currentUser = useSelector(state => state.authentication.currentUser.payload);


async function sendHttpRequest(url, config) {
    const response = await fetch(url, config);
    const resData = await response.json();
    console.log(resData);

    if (!response.ok) {
        throw new Error(
            resData.message || 'something went wrong, failed to send request'
        );
    }
    return resData
}


export function useHttp(url, config, initialData) {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    console.log('config: ' + config[0]);
   
 
    const sendRequest = useCallback(
        async function sendRequest() {
            setIsLoading(true);
            try {
                const resData = await sendHttpRequest(url, config);
                setData(resData);
            } catch (error) {
                console.log(error.message);
                setError(error.message || 'something went wrong');
            }
            setIsLoading(false);
        }, 
        [url, config]
    );
    useEffect(() => {
        if (config && (config.method === 'GET' || !config.method || !config)) {
            sendRequest();
        }
    }, [sendRequest, config]);

   

    return {
        data,
        isLoading,
        error,
        sendRequest
    }
}

export default useHttp;