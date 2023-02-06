import { useState } from 'react';
import parse, {
  HTMLReactParserOptions,
  Element,
  Text,
} from 'html-react-parser';
import { ElementType } from 'domelementtype';
import { Sentence } from '../types/sentence';

type FuriganaMode = 'hover' | 'show' | 'hide';

const KanjiFuriganaElement = ({
  kanji,
  furigana,
  mode = 'hover',
}: {
  kanji: string;
  furigana: string;
  hoverMode?: boolean;
  mode?: FuriganaMode;
}) => {
  const [shouldShowFurigana, setShouldShowFurigana] = useState<boolean>(
    mode === 'show'
  );
  const [alwaysShowFurigana, setAlwaysShowFurigana] = useState<boolean>(
    mode === 'show'
  );
  const onMouseEnter = () => {
    if (mode === 'hover' && !alwaysShowFurigana) {
      setShouldShowFurigana(true);
    }
  };
  const onMouseLeave = () => {
    if (mode === 'hover' && !alwaysShowFurigana) {
      setShouldShowFurigana(false);
    }
  };
  const onClick = () => {
    // When the kanji is clicked, we always show the furigana unless it's clicked again
    if (mode === 'hover') {
      setAlwaysShowFurigana((prevValue) => !prevValue);
    }
  };

  return (
    <ruby
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {kanji}
      <rp>(</rp>
      <rt
        className={
          shouldShowFurigana || mode === 'show'
            ? 'show-furigana'
            : 'hide-furigana'
        }
      >
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
    </ruby>
  );
};

const getParseFuriganaOptions: (
  furiganaMode?: FuriganaMode
) => HTMLReactParserOptions = (furiganaMode) => ({
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.name === 'ruby') {
      let kanji = '';
      let furigana = '';
      // find the kanji
      const kanjiNode = domNode.children.find(
        (node) => node.type === ElementType.Text
      );
      if (kanjiNode) {
        kanji = (kanjiNode as Text).data;
      }

      const furiganaWrapperNode = domNode.children.find(
        (node) => node instanceof Element && node.name === 'rt'
      );
      if (furiganaWrapperNode instanceof Element) {
        const furiganaNode = (furiganaWrapperNode as Element).children.find(
          (node) => node.type === ElementType.Text
        );
        if (furiganaNode) {
          furigana = (furiganaNode as Text).data;
        }
      }

      return (
        <KanjiFuriganaElement
          kanji={kanji}
          furigana={furigana}
          mode={furiganaMode}
        />
      );
    }
  },
});

export const JapaneseSentenceElement = ({
  sentence,
  furiganaMode,
}: {
  sentence: Sentence;
  furiganaMode?: FuriganaMode;
}) => {
  if (sentence.furiganaHTML) {
    const parseOptions = getParseFuriganaOptions(furiganaMode);
    return <>{parse(sentence.furiganaHTML, parseOptions)}</>;
  } else {
    return <>{sentence.ja}</>;
  }
};
