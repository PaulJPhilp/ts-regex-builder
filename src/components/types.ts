export type RegexElement =
  | string
  | CharacterClass
  | Anchor
  | ChoiceOf
  | Quantifier
  | Capture;

export type Quantifier = One | OneOrMore | Optionally | ZeroOrMore | Repeat;

/**
 * Character range from start to end (inclusive).
 */
export type CharacterRange = {
  start: string;
  end: string;
};

// Components
export type CharacterClass = {
  type: 'characterClass';
  characters: string[];
  ranges: CharacterRange[];
  isInverted: boolean;
};

export type Anchor = {
  type: 'anchor';
  symbol: string;
};

export type ChoiceOf = {
  type: 'choiceOf';
  children: RegexElement[][];
};

// Quantifiers
export type One = {
  type: 'one';
  children: RegexElement[];
};

export type OneOrMore = {
  type: 'oneOrMore';
  children: RegexElement[];
};

export type Optionally = {
  type: 'optionally';
  children: RegexElement[];
};

export type ZeroOrMore = {
  type: 'zeroOrMore';
  children: RegexElement[];
};

export type Repeat = {
  type: 'repeat';
  children: RegexElement[];
  config: RepeatConfig;
};

export type RepeatConfig = { count: number } | { min: number; max?: number };

// Captures
export type Capture = {
  type: 'capture';
  children: RegexElement[];
};
