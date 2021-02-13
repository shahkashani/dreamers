const tumblr = require('tumblr.js');
const { getOldestPost } = require('./utils/posts');
const { getCaption, getTextBlocks } = require('./utils/parsers');
const { removeEffectTags, getEffects } = require('./utils/effects');

class Dreamers {
  constructor({
    consumerKey,
    consumerSecret,
    accessTokenKey,
    accessTokenSecret,
    blogName,
  }) {
    this.client = tumblr.createClient({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      token: accessTokenKey,
      token_secret: accessTokenSecret,
      returnPromises: true,
    });
    this.blogName = blogName;
  }

  getCaptions({ content }) {
    return getTextBlocks(content)
      .map((block) => getCaption(block))
      .slice(0, 10);
  }

  getConfig(post) {
    const { tags, author, id } = post;
    const effects = getEffects(post);
    return {
      tags: removeEffectTags(tags),
      captions: this.getCaptions(post),
      author,
      id,
      effects,
    };
  }

  async getNextPost() {
    const post = await getOldestPost(this.client, this.blogName);
    if (!post) {
      return null;
    }
    const config = this.getConfig(post);
    return config;
  }

  async deletePost(id) {
    return this.client.deletePost(this.blogName, id);
  }
}

module.exports = Dreamers;
