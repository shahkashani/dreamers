const { sortBy, intersection } = require('lodash');

const IGNORE_POSTS_WITH_TAGS = ['instructions', 'faq', 'do not post', 'info'];

const getPosts = async (method, blogName) => {
  const allResults = [];
  let hasNextPage = true;
  let offset = 0;
  while (hasNextPage) {
    const { posts, _links } = await method(blogName, {
      npf: true,
      offset,
    });
    allResults.push.apply(allResults, posts);
    if (posts.length === 0 || !_links || !_links.next) {
      hasNextPage = false;
    } else {
      offset = _links.next.query_params.offset;
    }
  }
  return sortBy(allResults, 'timestamp');
};

const getAllPosts = async (client, blogName) => {
  return getPosts(client.blogPosts, blogName);
};

const getAllDrafts = async (client, blogName) => {
  return getPosts(client.blogDrafts, blogName);
};

const getNextPost = async (client, blogName, ownerBlogName) => {
  const posts = await getAllPosts(client, blogName);
  const filteredPosts = posts.filter(
    ({ tags, author }) =>
      author !== ownerBlogName &&
      intersection(tags, IGNORE_POSTS_WITH_TAGS).length === 0
  );
  return filteredPosts.length > 0 ? filteredPosts[0] : null;
};

module.exports = {
  getAllPosts,
  getAllDrafts,
  getNextPost,
};
