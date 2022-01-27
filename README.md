# New Build Detector Webpack Plugin
A simple webpack plugin which helps in detecting new build

## Installation

Install the plugin 

```sh
npm install --save-dev new-build-detector-webpack-plugin
```

## Usage

1. Apply the plugin in your webpack.config.js file
```js
const NewBuildDetectorPlugin = require('new-build-detector-webpack-plugin');

module.exports = {
    plugins: [
        new NewBuildDetectorPlugin(),
    ]
}
```

2. In your application script:

```js
const listener = window.setOnVersionChangeListener(() => {
    window.alert("We have detected a new build. Please refresh your browser.");

    listener.remove(); // Remove the listener
});

// You can add as many listeners as you want

const anotherListener = window.setOnVersionChangeListener(() => {
    window.location.reload();
});

window.startVersionChecking(1000); // Start checking once per second
```

3. Make version.txt ignored by any types of cache

After you build your app, a file named "version.txt" is created at the dist folder. Please configure your hosting service/DNS/Web server to ignore this file from any types of cache (browser cache, DNS cache, web server cache,...)

For example, if you are hosting your web site using s3 and cloudfront

```sh
aws s3 sync --delete --cache-control max-age=2592000,public build/ s3://your-bucket/app-folder

aws s3 cp s3://your-bucket/app-folder/version.txt s3://your-bucket/app-folder/version.txt --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/plain
```

## License

This project is licensed under the terms of the [MIT License](/LICENSE).
