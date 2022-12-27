import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { Sentence } from "../../types/sentence";
import { WANIKANI_USER_ENDPOINT } from "../../utils/constants";
import { getRandomInt } from "../../utils/numbers";
import { SentenceSource } from "@prisma/client";

const getWaniKaniUserLevel = (apiKey: string | null) => {
    if (!apiKey) {
        return Promise.reject('API Key is required');
    }
    const headers = {
        'Authorization': `Bearer ${apiKey}` 
    };

    return fetch(WANIKANI_USER_ENDPOINT, {headers})
    .then(res => res.json())
    .then(data => {
        if (data?.error) {
            return Promise.reject(data.error);
        }

        const userLevel = data?.data?.level;
        if (!userLevel) {
            return Promise.reject("Error fetching WaniKani user");
        }

        const userMaxLevelGranted = data?.data?.subscription?.max_level_granted || userLevel;
        const maxSentenceLevel = Math.min(userLevel, userMaxLevelGranted);

        return maxSentenceLevel;
    });
};

const fetchWaniKaniSentence = (userLevel: number): Promise<Sentence> => {
    const filterQuery = {
        where: {
            source: SentenceSource.wanikani,
            wanikaniLevel: {lt: userLevel},
        }
    };

    return prisma.sentence.count(filterQuery).then(sentenceCount => {
        const randomSkip = getRandomInt(0, sentenceCount);
        
        return prisma.sentence.findFirstOrThrow({
            ...filterQuery,
            skip: randomSkip,
        });
    }).then(({sentenceJa, sentenceEn, sentenceJaFurigana}) => {

        return {
            ja: sentenceJa || "",
            en: sentenceEn || "",
            furiganaHTML: sentenceJaFurigana || "",
        };
    });
};

const fetchTatoebaSentence = (): Promise<Sentence> => {
    const filterQuery = {
        where: {
            source: SentenceSource.tatoeba,
        }
    };
    return prisma.sentence.count(filterQuery).then(sentenceCount => {
        const randomSkip = getRandomInt(0, sentenceCount);
        
        return prisma.sentence.findFirstOrThrow({
            ...filterQuery,
            skip: randomSkip,
        });
    }).then(({sentenceJa, sentenceEn, sentenceJaFurigana}) => {

        return {
            ja: sentenceJa || "",
            en: sentenceEn || "",
            furiganaHTML: sentenceJaFurigana || "",
        };
    });;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Sentence | {error: string}>) {
    const {shouldFetchFromWaniKani: shouldFetchFromWaniKaniParam = false, waniKaniAPIKey: waniKaniAPIKeyParam = null} = req.query;
    const shouldFetchFromWaniKani = Array.isArray(shouldFetchFromWaniKaniParam) ? shouldFetchFromWaniKaniParam[0] === "true" : shouldFetchFromWaniKaniParam === "true";
    const waniKaniAPIKey = Array.isArray(waniKaniAPIKeyParam) ? waniKaniAPIKeyParam[0] : waniKaniAPIKeyParam;
    
    try {
        if (shouldFetchFromWaniKani) {
            const userLevel = await getWaniKaniUserLevel(waniKaniAPIKey);
            const sentence = await fetchWaniKaniSentence(userLevel);
            res.status(200).json(sentence);
        } else {
            const sentence = await fetchTatoebaSentence();
            res.status(200).json(sentence);
        }
    } catch (error) {
        console.error(error);
        const errorString: string = error as string;
        res.status(500).send({error: errorString});
    } 
}