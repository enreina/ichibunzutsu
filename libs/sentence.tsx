import useSWRImmutable from "swr/immutable";
import type {Sentence} from "../pages/api/sentence";
import parse, {HTMLReactParserOptions, Element, domToReact} from 'html-react-parser';

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

export const JapaneseSentenceElement = ({sentence, showFurigana = true} : {sentence: Sentence, showFurigana?: boolean}) => {
    const parseFuriganaOptions: HTMLReactParserOptions = {
        replace: domNode => {
            if (domNode instanceof Element && domNode.name === 'rt') {
                return <rt className={showFurigana ? 'show-furigana' : 'hide-furigana'}>
                    {domToReact(domNode.children, parseFuriganaOptions)}
                    <style jsx>{`
                        .show-furigana {
                            opacity: 1;
                        }
                        .hide-furigana {
                            opacity: 0;
                        }
                    `}</style>
                </rt>
            }
        }
    }

    if (sentence.furiganaHTML) {
        return <>
            {parse(sentence.furiganaHTML, parseFuriganaOptions)}
        </>;
    } else {
        return <>{sentence.ja}</>;
    }
};

