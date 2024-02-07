require('dotenv').config();
const express = require('express');
const basicAuth = require('express-basic-auth');
const { createProxyMiddleware } = require('http-proxy-middleware');

const server = express();

server.use(basicAuth({
  users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD },
  challenge: true,
  realm: 'Imb4T3st4pp',
}));

server.use(express.static('public'));

const proxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
});

module.exports = function (eleventyConfig) {
  eleventyConfig.setBrowserSyncConfig({
    server: {
      baseDir: 'public',
    },
    middleware: [proxy],
    port: 3001,
  });

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'app',
      output: 'public',
      layouts: '_layouts',
      includes: '_components'
    }
  };
};

server.listen(3000, () => {
  console.log('Express server is running on port 3000');
});