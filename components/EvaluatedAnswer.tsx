import { diffChars } from 'diff';
import styled from '@emotion/styled';
import { furiganaTokensToString, FuriganaTokenType } from '../lib/kuroshiro';
import { ReactNode } from 'react';
import { KanjiFuriganaElement } from './JapaneseSentenceElement';

const HighlightedChars = styled.span(({ color }) => ({
  color,
}));

export function EvaluatedUserAnswer({
  userAnswer,
  systemAnswer,
}: {
  userAnswer: string;
  systemAnswer: string;
}) {
  const differences = diffChars(systemAnswer, userAnswer);

  return (
    <>
      {differences.map(({ value, added, removed }, idx) => {
        if (added) {
          return (
            <HighlightedChars color={'red'} key={idx}>
              {value}
            </HighlightedChars>
          );
        } else if (removed) {
          return null;
        } else {
          return value;
        }
      })}
    </>
  );
}

export function EvaluatedSystemAnswer({
  userAnswer,
  systemAnswerTokens,
}: {
  userAnswer: string;
  systemAnswerTokens: FuriganaTokenType[];
}) {
  const systemAnswer = furiganaTokensToString(systemAnswerTokens);
  const differences = diffChars(userAnswer, systemAnswer).filter(
    (diff) => !diff.removed
  );

  const resultingElements: ReactNode[] = [];

  let currentCharIdx = 0;
  let currentTokenIdx = 0;
  let currentToken = systemAnswerTokens[currentTokenIdx];
  let currentTokenCharIdx = 0;
  let currentDiffIdx = 0;
  let currentDiff = differences[currentDiffIdx];
  let currentDiffCharIdx = 0;
  let currentElements: ReactNode[] = [];
  while (currentToken || currentDiff) {
    const { value, added, removed } = currentDiff;
    if (added) {
      currentElements.push(
        <HighlightedChars key={currentCharIdx} color="green">
          {value.charAt(currentDiffCharIdx)}
        </HighlightedChars>
      );
    } else if (!removed) {
      currentElements.push(
        <span key={currentCharIdx}>{value.charAt(currentDiffCharIdx)}</span>
      );
    }

    // move to next char
    currentCharIdx++;

    // move to next furigana tokens
    if (currentToken) {
      currentTokenCharIdx++;
      if (currentTokenCharIdx >= currentToken.furigana.length) {
        if (currentToken.kanji) {
          resultingElements.push(
            <KanjiFuriganaElement
              kanji={currentToken.kanji}
              furigana={currentElements}
              mode={'show'}
              key={currentTokenIdx}
            />
          );
        } else {
          resultingElements.push(
            <span key={currentTokenIdx}>{currentElements}</span>
          );
        }

        currentElements = [];
        currentTokenCharIdx = 0;
        currentTokenIdx++;
        currentToken = systemAnswerTokens[currentTokenIdx];
      }
    }

    // move to next difference
    currentDiffCharIdx++;
    if (currentDiffCharIdx >= currentDiff.value.length) {
      if (!currentToken) {
        // makes sure we append characters at the end
        currentTokenIdx++;
        resultingElements.push(
          <span key={currentTokenIdx}>{currentElements}</span>
        );
      }
      currentDiffCharIdx = 0;
      currentDiffIdx++;
      currentDiff = differences[currentDiffIdx];
    }
  }

  return <>{resultingElements}</>;
}
