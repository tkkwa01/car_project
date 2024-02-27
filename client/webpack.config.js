const path = require('path')
const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            "assert": require.resolve("assert/"),
            "buffer": require.resolve("buffer/")

        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};
