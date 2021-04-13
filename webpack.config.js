const path = require("path")
module.exports = {
    entry: "/src/index.js",
    output: {
        filename: "app.bundle.js",
        path: path.join(process.cwd(), "/dist")
    },
    mode: "development",
    resolve: {
        alias: {
            "@lib": path.join(process.cwd(), "./lib")
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|mp3)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "images"
                    }
                }
            },
            {
                test: /.js$/,
                exclude: "/node_modules",
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env"
                        ]
                    }
                }
            }
        ]
    },
    plugins: [],
    devtool: "source-map",
    devServer: {
        port: 3000,
        contentBase: "./dist"
    }
}