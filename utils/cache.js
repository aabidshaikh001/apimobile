// utils/cache.js
const NodeCache = require("node-cache");
const cache = new NodeCache({stdTTL:1000}); // no global TTL
module.exports = cache;
