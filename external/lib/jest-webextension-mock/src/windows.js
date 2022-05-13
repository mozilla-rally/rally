// https://developer.chrome.com/extensions/windows

export const windows = {
  get: jest.fn((id = '', cb = () => { }) => cb({})),
  getCurrent: jest.fn((cb) => cb({})),
  getLastFocused: jest.fn((cb) => cb({})),
  getAll: jest.fn((cb) => cb({})),
  create: jest.fn((props = {}, cb) => {
    if (cb !== undefined) {
      return cb(props);
    }
    return Promise.resolve(props);
  }),
  update: jest.fn((id = '', props = {}, cb = () => { }) =>
    cb(Object.assign({}, props, { id }))
  ),
  remove: jest.fn((tabIds, cb) => {
    if (cb !== undefined) {
      return cb();
    }
    return Promise.resolve();
  }),
  onCreated: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    hasListener: jest.fn(),
  },
  onRemoved: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    hasListener: jest.fn(),
  },
  onFocusChanged: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    hasListener: jest.fn(),
  },
};
