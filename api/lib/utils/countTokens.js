const { encode, decode } = require('gpt-3-encoder');

function countTokens (text) {
  const str = text;
  const encoded = encode(str);

  // for (let token of encoded) {
  //   console.log({ token, string: decode([token]) });
  // }

  const decoded = decode(encoded);
  return { decoded, encoded, length: encoded.length };
}

module.exports = countTokens;
