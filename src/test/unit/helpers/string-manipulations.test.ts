import * as assert from 'assert';

import {
  removeFirstSlashInString,
  removeLastSlashInString,
} from '../../../helpers/string-manipulations';

const STRING_TEST = '/Folder/internal/file.js/';

suite('String Manipulation Helper', () => {
  test('should remove first slash in the string', () => {
    assert.equal(
      removeFirstSlashInString(STRING_TEST),
      'Folder/internal/file.js/'
    );
  });

  test('should remove first slash in the string', () => {
    assert.equal(
      removeLastSlashInString(STRING_TEST),
      '/Folder/internal/file.js'
    );
  });
});
