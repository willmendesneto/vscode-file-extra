import * as assert from 'assert';

import { buildFilepath } from '../../../helpers/files';

const WORKSPACE_DIR = '/Workspace/example';

suite('Files Helper', () => {
    test('should build file path based on workspace root and file location', () => {
        const error = new Error('Dummy message');

        // TODO: check if mock for mock `showErrorMessage` was called with the message
        assert.equal(buildFilepath('folder/test/file.ts', WORKSPACE_DIR), '/Workspace/example/folder/test/file.ts');
    });
});
