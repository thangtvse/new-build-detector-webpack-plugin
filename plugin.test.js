const fs = require('fs');
const path = require('path');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const NewBuildDetectorPlugin = require('./plugin');


jest.mock('fs', () => {
  return ({
    readFileSync: jest.fn(() => 'content'),
    writeFileSync: jest.fn(() => {})
  });
})

describe('plugin', () => {
  let compiler;
  const clientPath =  path.resolve(__dirname, 'client.js')

  const setup = () => {
    const plugin = new NewBuildDetectorPlugin();
    plugin.apply(compiler);
  }

  beforeEach(() => {
    Date.now = () => 123
    compiler = {
      options: {
        output: {
          publicPath: '/',
          path: 'dist'
        },
        entry: 'index.js'
      },
      hooks: {
        done: {
          tap: jest.fn((name, fn) => fn())
        }
      }
    }
    fs.writeFileSync.mockClear()
  })

  it('should modify string entry correctly', () => {  
    setup();
    expect(compiler.options.entry).toEqual([
      clientPath,
      'index.js'
    ])
  })

  it('should modify array entry correctly', () => {
    compiler.options.entry = ['index1.js', 'index2.js']
    setup();
    expect(compiler.options.entry).toEqual([
      clientPath,
      'index1.js',
      'index2.js'
    ])
  });

  it('should modify object entry correctly', () => {
    compiler.options.entry = {
      index1: 'index1.js',
      index2: 'index2.js'
    }
    setup();
    expect(compiler.options.entry).toEqual({
      index1: [
        clientPath,
        'index1.js'
      ],
      index2: [
        clientPath,
        'index2.js'
      ]
    });
  })

  it('should modify object entry with import field correctly', () => {
    compiler.options.entry = {
      import: 'index.js'
    }
    setup();
    expect(compiler.options.entry).toEqual({
      import: [
        clientPath,
        'index.js'
      ]
    });
  });

  it('should modify function entry correctly', async () => {
    compiler.options.entry = async () => 'index.js'
    setup();
    expect(await compiler.options.entry()).toEqual([clientPath, 'index.js'])
  })

  it('should write client file content correctly', () => {
    setup();
    const content = fs.writeFileSync.mock.calls[0][1];
    expect(content).toContain('window.__BUILD_VERSION__ = "123"');
    expect(content).toContain('window.__PUBLIC_URL__ = "/"');
    expect(content).toContain('content');
  });

  it('should write version file correctly', () => {
    setup();
    expect(fs.writeFileSync).toBeCalledWith(path.resolve(compiler.options.output.path, 'version.txt'), 123);
  })
})