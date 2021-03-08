const { getAllDrafts, getAllPosts } = require('./posts');

const PREVIEW_TAG = 'preview';

const getPostForId = (posts, tag) => {
  const post = posts.find(({ tags }) => tags.indexOf(tag) !== -1);
  if (post) {
    return {
      ...post,
      tags: removePreviewTags(post.tags),
    };
  }
  return null;
};

const getPreviewRequestConfig = async (client, blogName, { tags, id }) => {
  const isCreateDraft = tags.indexOf(PREVIEW_TAG) !== -1;
  if (!isCreateDraft) {
    return {};
  }
  const previewTag = `${PREVIEW_TAG}: ${id}`;
  const post = getPostForId(await getAllPosts(client, blogName), previewTag);
  const draft = getPostForId(await getAllDrafts(client, blogName), previewTag);
  if (post) {
    return {
      post,
      ids: draft ? [post.id, draft.id] : [post.id],
    };
  }
  return {
    draft,
    tags: [previewTag],
    isCreateDraft: true,
  };
};

const removePreviewTags = (tags) =>
  tags.filter(
    (tag) => tag !== PREVIEW_TAG && !tag.startsWith(`${PREVIEW_TAG}:`)
  );

module.exports = {
  removePreviewTags,
  getPreviewRequestConfig,
};
