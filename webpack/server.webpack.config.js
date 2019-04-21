const CleanWebpackPlugin = require("clean-webpack-plugin");
const paths = require("./paths.js");

const outpath = paths.root + "/" + paths.outpath;

module.exports = () => {
    const server = {
        entry: {
            main: "./src/server/index.js"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin([ outpath + "/*.js" ],
                {
                    root: paths.root
                })
        ],
        target: "node",
        mode: process.env.NODE_ENV,
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
        output: {
            filename: "backend.js",
            path: outpath
        }
    };

    return server;
};