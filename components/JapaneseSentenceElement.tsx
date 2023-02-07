import { useState } from 'react';
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

export const JapaneseSentenceElement = ({
  sentence,
  furiganaMode,
}: {
  sentence: Sentence;
  furiganaMode?: FuriganaMode;
}) => {
  if (sentence.furiganaTokens) {
    return (
      <>
        {sentence.furiganaTokens.map(({ kanji, furigana }, idx) => {
          if (kanji) {
            return (
              <KanjiFuriganaElement
                key={idx}
                kanji={kanji}
                furigana={furigana}
                mode={furiganaMode}
              />
            );
          } else {
            return furigana;
          }
        })}
      </>
    );
  } else {
    return <>{sentence.ja}</>;
  }
};
