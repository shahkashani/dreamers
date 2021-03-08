require('dotenv').config();

const Dreamers = require('./index');

const {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_SECRET,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  BLOG_NAME,
} = process.env;

const dreamers = new Dreamers({
  accessTokenKey: ACCESS_TOKEN_KEY,
  accessTokenSecret: ACCESS_TOKEN_SECRET,
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  blogName: BLOG_NAME
});

(async function() {
  const post = await dreamers.getNextPost();
  console.log(post);
})();
