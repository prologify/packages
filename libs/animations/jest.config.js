module.exports = {
  name: 'animations',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/animations',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
