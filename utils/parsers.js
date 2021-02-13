const BLOCK_TYPE_TEXT = 'text';
const BLOCK_TYPE_IMAGE = 'image';
const TOKEN_BOLD = '*';
const FORMATTING_TYPE_BOLD = 'bold';

const getTokens = (formatting, formattingType, token) => {
  const matches = (formatting || []).filter(({ type }) => type === formattingType);
  return matches.reduce(
    (memo, { start, end }) => ({
      ...memo,
      [start]: token,
      [end]: token,
    }),
    {}
  );
};

const getCaption = ({ text, formatting }) => {
  const tokenMap = getTokens(formatting, FORMATTING_TYPE_BOLD, TOKEN_BOLD);
  return text
    .split('')
    .map((c, index) => `${tokenMap[index] || ''}${c}`)
    .join('');
};

const getBlockType = (content, type) =>
  content.reduce((memo, block) => {
    if (block.type === type) {
      memo.push(block);
    }
    return memo;
  }, []);

const getTextBlocks = (content) => getBlockType(content, BLOCK_TYPE_TEXT);
const getImageBlocks = (content) => getBlockType(content, BLOCK_TYPE_IMAGE);

module.exports = {
  getCaption,
  getTextBlocks,
  getImageBlocks,
};
