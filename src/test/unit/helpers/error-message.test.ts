import * as assert from 'assert';

import { errorMessage } from '../../../helpers/error-message';

suite('Error Helper', () => {
    test('should build path to file', () => {
        const error = new Error('Dummy message');

        // TODO: check if mock for mock `showErrorMessage` was called with the message
        // assert.equal(showErrorMessage, `Error: ${errMsg}`);
    });
});
