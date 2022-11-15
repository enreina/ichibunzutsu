import useSWRImmutable from "swr/immutable";

type Sentence = {
    en: string,
    ja: string,
};

const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const waniKaniFetcher = (url: string, apiKey: string | null) => {
    if (!apiKey) {
        return Promise.reject('API Key is required');
    }

    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${apiKey}` 
        }
    })
    .then(res => res.json())
    .then(data => {
        let contextSentence: Sentence | null = null;

        if (data?.error) {
            return Promise.reject(data.error);
        }

        // randomized sentence
        if (data?.data && data.data.length > 0) {
            const randomVocabIndex = getRandomInt(0, data.data.length);
            const randomVocabContextSentences = data.data[randomVocabIndex].data['context_sentences'];
            if (randomVocabContextSentences.length > 0) {
                const randomSentenceIndex = getRandomInt(0, randomVocabContextSentences.length);
                contextSentence = randomVocabContextSentences[randomSentenceIndex];
            }
        }
        
        return contextSentence;
    });
};

const sheetsonFetcher = (url: string) => {
    const params = {
        spreadsheetId: process.env.NEXT_PUBLIC_SHEETSON_SPREADHEET_ID || "",
        apiKey: process.env.NEXT_PUBLIC_SHEETSON_API_KEY || "",
    };
    const urlSearchParams = new URLSearchParams(params);
    const sentenceCountAPIUrl = `${url}SentenceCount/2?${urlSearchParams}`;

    return fetch(sentenceCountAPIUrl)
    .then(res => res.json())
    .then(data => {
        if (data?.count) {
            const sentenceCount = Number.parseInt(data.count);
            if (!Number.isNaN(sentenceCount)) {
                const randomSentenceId = getRandomInt(2, sentenceCount + 1); // data starts from row 2
                const sentenceAPIUrl = `${url}Sentences/${randomSentenceId}?${urlSearchParams}`;
                return fetch(sentenceAPIUrl);
            }
        }
        return Promise.reject("Error fetching sentence");
    })
    .then(res => res.json())
    .then(data => {
        if (data?.ja && data?.en) {
            return {
                "en": data.en,
                "ja": data.ja,
            };
        }

        return Promise.reject("Error fetching sentence");
    });
};

const waniKaniURL: string = 'https://api.wanikani.com/v2/subjects?types=vocabulary&levels=1,2,3';
const sheetsonURL: string = 'https://api.sheetson.com/v2/sheets/';

export const useSentence: 
    (waniKaniApiKey: string | null, fromWaniKani?: boolean) => {sentence: Sentence | null | undefined, isLoading: boolean, isError: boolean} 
    = (waniKaniApiKey, fromWaniKani=true) => {
    const swrKey = fromWaniKani ? [waniKaniURL, waniKaniApiKey] : sheetsonURL;
    const fetcher = fromWaniKani ? waniKaniFetcher : sheetsonFetcher;
    const {data, error} = useSWRImmutable(swrKey, fetcher);

    return {
        sentence: data,
        isLoading: !error && !data,
        isError: !!error,
    };
};
