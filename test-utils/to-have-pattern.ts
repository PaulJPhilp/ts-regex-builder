import { buildPattern } from '../src/builders';
import type { RegexElement } from '../src/components/types';
import { isRegexElementOrString } from '../src/utils';

export function toHavePattern(
  this: jest.MatcherContext,
  elements: Array<RegexElement | string> | RegexElement | string,
  expected: string
) {
  if (!Array.isArray(elements)) {
    elements = [elements];
  }

  elements.forEach((e) => {
    if (!isRegexElementOrString(e)) {
      throw new Error(
        `\`toHavePattern()\` received an array of RegexElements and strings.`
      );
    }
  });

  const received = buildPattern(...elements);

  const options = {
    isNot: this.isNot,
  };

  return {
    pass: expected === received,
    message: () =>
      this.utils.matcherHint('toHavePattern', undefined, undefined, options) +
      '\n\n' +
      `Expected: ${this.isNot ? 'not ' : ''}${this.utils.printExpected(
        expected
      )}\n` +
      `Received: ${this.utils.printReceived(received)}`,
  };
}

expect.extend({ toHavePattern });

declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T = {}> {
      toHavePattern(expected: string): R;
    }
  }
}
