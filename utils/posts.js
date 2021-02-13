const { sortBy, intersection } = require('lodash');

const IGNORE_POSTS_WITH_TAGS = ['example post', 'instructions'];

const getAllPosts = async (client, blogName) => {
  const allResults = [];
  let hasNextPage = true;
  let offset = 0;
  while (hasNextPage) {
    const { posts, _links } = await client.blogPosts(blogName, {
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

const getOldestPost = async (client, blogName) => {
  const posts = await getAllPosts(client, blogName);
  const filteredPosts = posts.filter(
    ({ tags }) => intersection(tags, IGNORE_POSTS_WITH_TAGS).length === 0
  );
  return filteredPosts.length > 0 ? filteredPosts[0] : null;
};

module.exports = {
  getAllPosts,
  getOldestPost,
};
