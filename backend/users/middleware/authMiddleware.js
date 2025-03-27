// Full user verification via DB
module.exports = require('../../common/authMiddleware')({ requireFullUser: true });