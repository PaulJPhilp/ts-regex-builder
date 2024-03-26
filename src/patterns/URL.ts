//
//  A Regular Expression to validate URLs and to match URL components.
//  This regular expression is based on the RFC 3986 standard which defines the URL format.
//  URL = Scheme ":"["//" Authority]Path["?" Query]["#" Fragment]
//  Source: https://en.wikipedia.org/wiki/URL#External_links
//  Source: https://datatracker.ietf.org/doc/html/rfc1738
//

import { buildRegExp } from '../builders';
import { endOfString, startOfString } from '../constructs/anchors';
import { anyOf, charClass, charRange, digit } from '../constructs/character-class';
import { choiceOf } from '../constructs/choice-of';
import { repeat } from '../constructs/repeat';
import { capture } from '../constructs/capture';
import { oneOrMore, optional } from '../constructs/quantifiers';

//
// The building blocks of the URL regex.
//
const lowercase = charRange('a', 'z');
const uppercase = charRange('A', 'Z');
const at = '@';
const equals = '=';
const period = '.';
const hyphen = '-';
const alphabetical = charClass(lowercase, uppercase);
const specialChars = anyOf('._%+-');
const portSeperator = ':';
const schemeSeperator = ':';
const doubleSlash = '//';
const pathSeparator = '/';
const querySeparator = '?';
const fragmentSeparator = '#';
const usernameChars = charClass(lowercase, digit, specialChars);
const hostnameChars = charClass(charRange('a', 'z'));
const pathSpecialChars = anyOf(':@%._+~#=');
const queryDelimiter = anyOf('&;');

//
// Combining these building blocks into the following URL regex components:
//

//    Scheme:
//      The scheme is the first part of the URL and defines the protocol to be used.
//      Examples of popular schemes include http, https, ftp, mailto, file, data and irc.
//      A URL string must be a scheme, followed by a colon, followed by a scheme-specific part.
//

export const urlScheme = [
  repeat(charClass(anyOf(hyphen), alphabetical), { min: 3, max: 6 }),
  optional('s'),
  schemeSeperator,
];

export const urlSchemeFinder = buildRegExp([capture(urlScheme)], {
  ignoreCase: true,
  global: true,
});

export const urlSchemeValidator = buildRegExp([startOfString, capture(urlScheme), endOfString], {
  ignoreCase: true,
});

//    Authority:
//      The authority part of a URL consists of three sub-parts:
//        1. An optional username, followed by an at symbol (@)
//        2. A hostname (e.g. www.google.com)
//        3. An optional port number, preceded by a colon (:)
//    Authority = [userinfo "@"] host [":" port]

const userinfo = oneOrMore(usernameChars);
const port = repeat(digit, { min: 1, max: 5, greedy: false });
const urlPort = [portSeperator, port];
const host = repeat(hostnameChars, { min: 1, max: 255, greedy: false });
const hostname = [host, optional(repeat([period, host], { min: 1, max: 255 }))];

export const urlAuthority = [optional([userinfo, at]), choiceOf(hostname), optional(urlPort)];

export const urlAuthorityFinder = buildRegExp(urlAuthority, {
  ignoreCase: true,
  global: true,
});

export const urlAuthorityValidator = buildRegExp(
  [startOfString, choiceOf(urlAuthority), endOfString],
  {
    ignoreCase: true,
  },
);

//
//    Convenience Pattern - Host:
//        A hostname (e.g. www.google.com)
//

export const urlHost = choiceOf(hostname);

export const urlHostFinder = buildRegExp(hostname, {
  ignoreCase: true,
  global: true,
});

export const urlHostValidator = buildRegExp(urlHost, { ignoreCase: true });

//    Path:
//      The path is the part of the URL that comes after the authority and before the query.
//      It consists of a sequence of path segments separated by a forward slash (/).
//      A path string must begin with a forward slash (/).

const pathSegment = [
  pathSeparator,
  optional(oneOrMore(charClass(lowercase, uppercase, digit, pathSpecialChars))),
];

export const urlPath = oneOrMore(pathSegment);

export const urlPathFinder = buildRegExp(urlPath, {
  ignoreCase: true,
  global: true,
});

export const urlPathValidator = buildRegExp(urlPath, { ignoreCase: true });

//    Query:
//      The query part of a URL is optional and comes after the path.
//      It is separated from the path by a question mark (?).
//      The query string consists of a sequence of field-value pairs separated by an ampersand (&).
//      Each field-value pair is separated by an equals sign (=).

const queryKey = oneOrMore(charClass(lowercase, uppercase, digit, anyOf('_-')));
const queryValue = oneOrMore(charClass(lowercase, uppercase, digit, anyOf('_-')));
const queryKeyValuePair = buildRegExp([queryKey, equals, queryValue]);

export const urlQuery = [querySeparator, oneOrMore([queryKeyValuePair, optional(queryDelimiter)])];

export const urlQueryFinder = buildRegExp(urlQuery, {
  ignoreCase: true,
  global: true,
});

export const urlQueryValidator = buildRegExp(urlQuery, { ignoreCase: true });

//    Fragment:
//      The fragment part of a URL is optional and comes after the query.
//      It is separated from the query by a hash (#).
//      The fragment string consists of a sequence of characters.

export const urlFragment = [
  fragmentSeparator,
  oneOrMore(charClass(lowercase, uppercase, digit, pathSpecialChars)),
];

export const urlFragmentFinder = buildRegExp(urlFragment, {
  ignoreCase: true,
  global: true,
});

export const urlFragmentValidator = buildRegExp(urlFragment, {
  ignoreCase: true,
});

export const url = [
  optional(urlScheme),
  schemeSeperator,
  optional([doubleSlash, choiceOf(urlAuthority)]),
  urlPath,
  optional(urlQuery),
  optional(urlFragment),
];

/***
 ***  Find URL strings in a text.
 ***/

export const urlFinder = buildRegExp(url, {
  ignoreCase: true,
  global: true,
});

/***
 ***  Check that given text is a valid URL.
 ***/

export const urlValidator = buildRegExp([startOfString, choiceOf(url), endOfString], {
  ignoreCase: true,
});