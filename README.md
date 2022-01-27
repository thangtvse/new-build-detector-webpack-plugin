# New Build Detector Webpack Plugin
A simple webpack plugin which helps in detecting new build

## Installation

Install the plugin 

```sh
npm install --save-dev @uendno/new-build-detector-webpack-plugin
```

## Usage

Apply the plugin in your webpack.config.js file
```js
const NewBuildDetectorPlugin = require('new-build-detector-webpack-plugin');

module.exports = {
    plugins: [
        new NewBuildDetectorPlugin(),
    ]
}
```

In your application script:

```js
const listener = window.setOnVersionChangeListener(() => {
    window.alert("We have detected a new build. Please refresh your browser.");

    listener.remove(); // Remove the listener
});

// You can add as many listeners as you want

const anotherListener = window.setOnVersionChangeListener(() => {
    window.location.reload();
});

window.startVersionChecking(1000);
```


## License

This project is licensed under the terms of the [MIT License](/LICENSE).