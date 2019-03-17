import * as assert from 'assert';

import {
  removeFirstSlashInString,
  removeLastSlashInString,
} from '../../../helpers/string-manipulations';

const STRING_TEST = '/Folder/internal/file.js/';

describe('String Manipulation Helper', () => {
  it('should remove first slash in the string', () => {
    assert.equal(
      removeFirstSlashInString(STRING_TEST),
      'Folder/internal/file.js/'
    );
  });

  it('should remove first slash in the string', () => {
    assert.equal(
      removeLastSlashInString(STRING_TEST),
      '/Folder/internal/file.js'
    );
  });
});
