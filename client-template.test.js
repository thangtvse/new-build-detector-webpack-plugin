global.window = {
  location: {
    origin: 'http://localhost:3000',
  },
  __PUBLIC_URL__: '/',
  __BUILD_VERSION__: '123'
}

require('./client-template');

jest.useFakeTimers();

describe('client-template', () => {
  beforeEach(() => {

  })

  it('should invoke callback when version changes', async () => {
    fetch.mockResponse('123');
    const callback = jest.fn();
    window.setOnVersionChangeListener(callback);
    window.startVersionChecking(1000);
    jest.runOnlyPendingTimers();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/version.txt');
    fetch.mockResponse('456')
    jest.runOnlyPendingTimers();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(callback).toHaveBeenCalled();
  });

  it('should handle public url which starts with slash correctly', () => {
    global.window.__PUBLIC_URL__ = '/public';
    fetch.mockResponse('123');
    const callback = jest.fn();
    window.setOnVersionChangeListener(callback);
    window.startVersionChecking(1000);
    jest.runOnlyPendingTimers();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/public/version.txt');
  })

  it('should handle public url which ends with slash correctly', () => {
    global.window.__PUBLIC_URL__ = '/public/';
    fetch.mockResponse('123');
    const callback = jest.fn();
    window.setOnVersionChangeListener(callback);
    window.startVersionChecking(1000);
    jest.runOnlyPendingTimers();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/public/version.txt');
  })
  
  it('should handle public url which starts with http correctly', () => {
    global.window.__PUBLIC_URL__ = 'http://localhost:4000/public/';
    fetch.mockResponse('123');
    const callback = jest.fn();
    window.setOnVersionChangeListener(callback);
    window.startVersionChecking(1000);
    jest.runOnlyPendingTimers();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/public/version.txt');
  })
})