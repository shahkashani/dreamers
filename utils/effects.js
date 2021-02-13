const { getImageBlocks } = require('./parsers');

const EFFECT_OVERLAY_TAG = 'overlay';
const EFFECT_TAGS = [EFFECT_OVERLAY_TAG];
const DEFAULT_OVERLAY_OPACITY = 40;

const getEffectParams = (tag) => {
  const [_base, params] = tag.split(/:\s*/);
  return (params || '').split(',');
};

const getOverlayEffect = (content, tag) => {
  const imageBlocks = getImageBlocks(content);
  if (imageBlocks.length === 0) {
    return null;
  }
  const params = getEffectParams(tag);
  const paramOpacity = params.length > 0 ? parseInt(params[0], 10) : null;
  const opacity =
    Number.isFinite(paramOpacity) && paramOpacity > 0
      ? paramOpacity
      : DEFAULT_OVERLAY_OPACITY;
  const [image] = imageBlocks;
  const { url: overlayFile } = image.media[0];
  return {
    opacity,
    overlayFile,
    sizePercentWidth: 1,
    gravity: 'center',
  };
};

const EFFECTS_MAP = {
  [EFFECT_OVERLAY_TAG]: getOverlayEffect,
};

const getEffects = ({ content, tags }) => {
  return tags.reduce((memo, tag) => {
    Object.keys(EFFECTS_MAP).forEach((effect) => {
      if (tag.startsWith(effect)) {
        const fn = EFFECTS_MAP[effect];
        const effectConfig = fn(content, tag);
        if (effectConfig) {
          memo.push({
            type: effect,
            params: {
              ...effectConfig,
            },
          });
        }
      }
    });
    return memo;
  }, []);
};

const removeEffectTags = (tags) =>
  tags.filter((tag) => !EFFECT_TAGS.find((effect) => tag.startsWith(effect)));

module.exports = {
  removeEffectTags,
  getEffects,
};
