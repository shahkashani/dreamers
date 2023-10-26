const tumblr = require('tumblr.js');
const { getNextPost } = require('./utils/posts');
const { getCaption, getTextBlocks } = require('./utils/parsers');
const { removeEffectTags, getEffects } = require('./utils/effects');
const {
  getPreviewRequestConfig,
  removePreviewTags,
} = require('./utils/preview');

class Dreamers {
  constructor({
    consumerKey,
    consumerSecret,
    accessTokenKey,
    accessTokenSecret,
    blogName,
    ownerBlogName,
  }) {
    this.client = tumblr.createClient({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      token: accessTokenKey,
      token_secret: accessTokenSecret,
    });
    this.blogName = blogName;
    this.ownerBlogName = ownerBlogName;
  }

  getCaptions({ content }) {
    const blocks = getTextBlocks(content)
      .map((block) => getCaption(block))
      .filter((c) => c.length > 0);
    const noNewlines = blocks.reduce(
      (memo, block) => [...memo, ...block.split('\n')],
      []
    );
    return noNewlines.slice(0, 10);
  }

  getConfig(post, previewConfig) {
    const { tags, author, id } = post;
    const effects = getEffects(post);
    const {
      isCreateDraft,
      post: passthrough,
      tags: previewTags = [],
      ids: previewIds = [],
    } = previewConfig;
    const postTags = removePreviewTags(removeEffectTags(tags));
    const captions = this.getCaptions(post);
    return {
      id,
      tags: [...previewTags, ...postTags],
      deleteIds: isCreateDraft ? [] : [...previewIds, id],
      captions,
      passthrough,
      author,
      effects,
      isCreateDraft,
    };
  }

  async getNextPost() {
    const post = await getNextPost(
      this.client,
      this.blogName,
      this.ownerBlogName
    );
    if (!post) {
      return null;
    }
    const previewConfig = await getPreviewRequestConfig(
      this.client,
      this.blogName,
      post
    );
    if (previewConfig.isCreateDraft && previewConfig.draft) {
      return null;
    }
    const config = this.getConfig(post, previewConfig);
    return config;
  }

  async deletePost(id) {
    return this.client.deletePost(this.blogName, id);
  }
}

module.exports = Dreamers;
