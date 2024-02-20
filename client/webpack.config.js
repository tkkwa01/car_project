const path = require('path')

module.exports = {
    resolve: {
        fallback: {
            "assert": require.resolve("assert/")
        }
    }
};
