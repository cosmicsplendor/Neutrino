const path = require("path")
const cwd = process.cwd()
module.exports = {
    entry: "/src/index.js",
    output: {
        filename: "app.bundle.js",
        path: path.join(cwd, "/dist")
    },
    mode: "development",
    resolve: {
        alias: {
            "@lib": path.join(cwd, "./lib"),
            "@config": path.join(cwd, "./src/config"),
            "@entities": path.join(cwd, "./src/entities"),
            "@components": path.join(cwd, "./src/components"),
            "@root": path.join(cwd, "./src")
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
                        plugins: [ "@babel/plugin-proposal-class-properties" ],
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