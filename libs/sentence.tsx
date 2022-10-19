import useSWR from "swr";

const WANIKANI_API_KEY = ''; //replace with WaniKani API from https://www.wanikani.com/settings/personal_access_tokens
const fetcher = (url: string) => fetch(url, {
    headers: {
        'Authorization': `Bearer ${WANIKANI_API_KEY}` 
    }
}).then(res => res.json());
const url = 'https://api.wanikani.com/v2/subjects?types=vocabulary&levels=22';

export const useSentence = () => {
    const {data, error} = useSWR(url, fetcher);

    const contextSentence = data?.data[0]?.data["context_sentences"][0];

    return {
        sentence: contextSentence,
        isLoading: !error && !data,
        isError: error,
    };
};