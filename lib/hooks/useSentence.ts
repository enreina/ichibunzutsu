import useSWRImmutable from "swr/immutable";
import type {Sentence} from "../../types/sentence";

const SENTENCE_API_ENDPOINT: string = "/api/sentence";

const sentenceFetcher = (url: string, params: {shouldFetchFromWaniKani: boolean, waniKaniAPIKey: string | null}) => {
    const {shouldFetchFromWaniKani, waniKaniAPIKey} = params;
    const urlSearchParams = new URLSearchParams({
        shouldFetchFromWaniKani: shouldFetchFromWaniKani ? "true" : "false",
        waniKaniAPIKey: waniKaniAPIKey || "",
    });
    return fetch(`${SENTENCE_API_ENDPOINT}?${urlSearchParams}`).then(res => {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject("Error fetching sentence");
    });
};

export const useSentence: 
    (waniKaniAPIKey?: string, fromWaniKani?: boolean) => {sentence: Sentence | null | undefined, isLoading: boolean, isError: boolean, refetch: () => void} 
    = (waniKaniAPIKey, fromWaniKani=false) => {
    const params = {
        shouldFetchFromWaniKani: fromWaniKani,
        waniKaniAPIKey,
    };
    const {data, error, mutate, isValidating} = useSWRImmutable([SENTENCE_API_ENDPOINT, params], sentenceFetcher, {shouldRetryOnError: false});

    return {
        sentence: data,
        isLoading: isValidating,
        isError: !isValidating && (!!error || data === null),
        refetch: mutate,
    };
};

