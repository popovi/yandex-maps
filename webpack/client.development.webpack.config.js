const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const projectPaths = require("./paths.js");

const outpath = projectPaths.root + "/" + projectPaths.outpath;

module.exports = () => {

    return {
        entry: {
            main: "./src/client/index.jsx"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.(svg|png|jpg)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[sha512:hash:base64:7].[ext]",
                                outputPath: "/assets/images"
                            }
                        }
                    ]
                },
                {
                    test: /\.ico$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                                outputPath: "/assets/images"
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "stylesheets/[name].[hash].css"
            }),
            new CleanWebpackPlugin([
                outpath + "/javascripts/**/*",
                outpath + "/stylesheets/*.*"
            ],
                {
                    root: path.resolve(projectPaths.root)
                }
            )
        ],
        devtool: "source-map",
        mode: process.env.NODE_ENV,
        resolve: {
            extensions: [".js", ".jsx", ".json"]
        },
        output: {
            filename: "javascripts/[name].[hash].js",
            path: outpath
        }
    };

};