let listeners = [];

window.setOnVersionChangeListener = (listener) => {
  listeners= [...listeners, listener];

  return () => {
    listeners = listeners.filter(l => l !== listener);
  }
}

window.startVersionChecking = (interval) => {
  setInterval(() => {
    fetch(window.__PUBLIC_URL__ + '/version.txt')
      .then(res => res.text())
      .then(res => {
        if (res !== window.__BUILD_VERSION__) {
          listeners.forEach(listeners => listeners());
        }
      })
  }, interval);
}