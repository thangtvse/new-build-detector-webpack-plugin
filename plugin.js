const fs = require('fs');
const path = require('path');

const injectClientEntry = (entry, clientEntry) => {
  if (typeof entry === 'string') {
    return [clientEntry, entry];
  } else if (Array.isArray(entry)) {
    return [clientEntry, ...entry];
  } else if (typeof entry === 'object') {
    const entries = Object.entries(entry);

    return entries.reduce(
      (acc, [curKey, curEntry]) => ({
        ...acc,
        [curKey]:
          typeof curEntry === 'object' && curEntry.import
            ? {
              ...curEntry,
              import: injectClientEntry(curEntry.import, clientEntry),
            }
            : injectClientEntry(curEntry, clientEntry),
      }),
      {}
    );
  } else if (typeof entry === 'function') {
    return (...args) =>
      Promise.resolve(entry(...args)).then((resolvedEntry) =>
        injectClientEntry(resolvedEntry, clientEntry)
      );
  }

  throw new Error('Unsupported type of entry');
}

class NewBuildDetectorPlugin {
  apply(compiler) {
    const ts = Date.now();

    let clientContent = fs.readFileSync(path.resolve(__dirname, 'client-template.js'));
    clientContent = `window.__BUILD_VERSION__ = "${ts}";
      window.__PUBLIC_URL__ = "${compiler.options.output.publicPath || ''}";
      ${clientContent}
      `
    fs.writeFileSync(path.resolve(__dirname, 'client.js'), clientContent);

    compiler.options.entry = injectClientEntry(compiler.options.entry, path.resolve(__dirname, 'client.js'));

    compiler.hooks.done.tap(
      'NewBuildDetectorPlugin',
      (stats) => {
        fs.writeFileSync(path.resolve(compiler.options.output.path, 'version.txt'), ts)
      }
    )


  }
}

module.exports = NewBuildDetectorPlugin;