/* global jest */
global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));
