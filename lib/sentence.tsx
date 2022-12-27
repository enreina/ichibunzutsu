import useSWRImmutable from "swr/immutable";
import type {Sentence} from "../types/sentence";
import {useState} from "react";
import parse, {HTMLReactParserOptions, domToReact, Element, Text} from 'html-react-parser';
import {ElementType} from "domelementtype";

const SENTENCE_API_ENDPOINT: string = "/api/sentence-v2";

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

const KanjiFuriganaElement = ({kanji, furigana}: {kanji: string, furigana: string}) => {
    const [shouldShowFurigana, setShouldShowFurigana] = useState<boolean>(false);
    const [alwaysShowFurigana, setAlwaysShowFurigana] = useState<boolean>(false);
    const showFurigana = () => {
        if (!alwaysShowFurigana) {
            setShouldShowFurigana(true);
        }
    };
    const hideFurigana = () => {
        if (!alwaysShowFurigana) {
            setShouldShowFurigana(false);
        }
    };
    const toggleFurigana = () => {
        // When the kanji is clicked, we always show the furigana unless it's clicked again
        setAlwaysShowFurigana(prevValue => !prevValue);
    };

    return <ruby onMouseEnter={showFurigana} onMouseLeave={hideFurigana} onClick={toggleFurigana}>
        {kanji}
        <rp>(</rp>
        <rt className={shouldShowFurigana ? 'show-furigana' : 'hide-furigana'}>
            {furigana}
        </rt>
        <rp>)</rp>
        <style jsx>{`
            ruby {
                cursor: pointer;
            }
            rt.show-furigana {
                opacity: 1;
            }
            rt.hide-furigana {
                opacity: 0;
            }
        `}</style>
    </ruby>;
}

const parseFuriganaOptions: HTMLReactParserOptions = {
    replace: domNode => {
        if (domNode instanceof Element && domNode.name === 'ruby') {
            let kanji = "";
            let furigana = "";
            // find the kanji
            const kanjiNode = domNode.children.find((node) => node.type === ElementType.Text); 
            if (kanjiNode) {
                kanji = (kanjiNode as Text).data;
            }

            const furiganaWrapperNode = domNode.children.find((node) => node instanceof Element && node.name === 'rt');
            if (furiganaWrapperNode instanceof Element) {
                const furiganaNode = (furiganaWrapperNode as Element).children.find((node) => node.type === ElementType.Text);
                if (furiganaNode) {
                    furigana = (furiganaNode as Text).data;
                }
            }

            return <KanjiFuriganaElement kanji={kanji} furigana={furigana} />;
        }
    }
}

export const JapaneseSentenceElement = ({sentence} : {sentence: Sentence}) => {
    if (sentence.furiganaHTML) {
        return <>
            {parse(sentence.furiganaHTML, parseFuriganaOptions)}
        </>;
    } else {
        return <>{sentence.ja}</>;
    }
};

