let listeners = [];

window.setOnVersionChangeListener = (listener) => {
  listeners = [...listeners, listener];

  return () => {
    listeners = listeners.filter(l => l !== listener);
  }
}

window.startVersionChecking = (interval) => {
  setInterval(() => {
    let url = `${window.location.origin}/version.txt`;
    let publicUrl = __PUBLIC_URL__;

    if (publicUrl.startsWith('/')) {
      publicUrl = publicUrl.slice(1);
    }

    if (publicUrl.endsWith('/')) {
      publicUrl = publicUrl.slice(0, -1);
    }

    if (publicUrl.startsWith('http')) {
      url = `${publicUrl}/version.txt`;
    } else {
      url = `${window.location.origin}/${publicUrl}/version.txt`;
    }
    
    fetch(url)
      .then(res => res.text())
      .then(res => {
        if (res !== window.__BUILD_VERSION__) {
          listeners.forEach(listeners => listeners());
        }
      })
  }, interval);
}
