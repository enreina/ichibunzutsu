import useSWRImmutable from "swr/immutable";

const WANIKANI_API_KEY = ''; //replace with WaniKani API from https://www.wanikani.com/settings/personal_access_tokens

const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const fetcher = (url: string) => fetch(url, {
    headers: {
        'Authorization': `Bearer ${WANIKANI_API_KEY}` 
    }
})
.then(res => res.json())
.then(data => {
    let contextSentence: string | null = null;

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

const url = 'https://api.wanikani.com/v2/subjects?types=vocabulary&levels=1,2,3';

export const useSentence = () => {
    const {data, error} = useSWRImmutable(url, fetcher);

    return {
        sentence: data,
        isLoading: !error && !data,
        isError: error,
    };
};