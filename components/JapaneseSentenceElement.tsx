import {useState} from "react";
import parse, {HTMLReactParserOptions, domToReact, Element, Text} from 'html-react-parser';
import {ElementType} from "domelementtype";
import { Sentence } from "../types/sentence";

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