export default {
  "transform": {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  "moduleNameMapper": {
    '^#sweet(.*)$': '<rootDir>/src/$1'
  }
};
