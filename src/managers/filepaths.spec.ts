import * as assert from 'assert';
import * as path from 'path';

import * as manager from './filepaths';

const WORKSPACE_ROOT_PATH = '/Users/name/Documents/';
function getBuildedFilepath(oldName: string, newName: string, isFile: boolean, keep: boolean): string {
    const oldPath = path.parse(`${WORKSPACE_ROOT_PATH}${oldName}`);

    return manager.buildFilepath(
        oldPath,
        { isFile: () => isFile } as any, /* tslint:disable-line no-any */
        newName,
        WORKSPACE_ROOT_PATH,
        { openFileAfterCopy: false }
    );
}

describe('Managers → Filepaths', () => {
    describe('.buildFilepath', () => {
        it('should build path to file', () => {
            const expected = `${WORKSPACE_ROOT_PATH}test.ts`;

            const actual = getBuildedFilepath('test.js', 'test.ts', true, true);

            assert.equal(actual, expected);
        });

        it('should build path to directory', () => {
            const expected = `${WORKSPACE_ROOT_PATH}test-copy`;

            const actual = getBuildedFilepath('test', 'test-copy', false, true);

            assert.equal(actual, expected);
        });

        it('should add original extension for new path of non-dot file', () => {
            const expected = `${WORKSPACE_ROOT_PATH}test.js`;

            const actual = getBuildedFilepath('test.js', 'test', true, true);

            assert.equal(actual, expected);
        });

        it('should not add original extension for new path of non-dot file', () => {
            const expected = `${WORKSPACE_ROOT_PATH}test`;

            const actual = getBuildedFilepath('test.js', 'test', false, true);

            assert.equal(actual, expected);
        });

        it('should add original extension for new path of dot file', () => {
            const expected = `${WORKSPACE_ROOT_PATH}.env.sample`;

            const actual = getBuildedFilepath('.env.sample', '.env', true, true);

            assert.equal(actual, expected);
        });

        it('should not add original extension for new path of dot file', () => {
            const expected = `${WORKSPACE_ROOT_PATH}.env`;

            const actual = getBuildedFilepath('.env.sample', '.env', true, false);

            assert.equal(actual, expected);
        });

        it('should not add original extension for new path of dot file with !!ext marker', () => {
            const expected = `${WORKSPACE_ROOT_PATH}.env`;

            const actual = getBuildedFilepath('.env.sample', '.env!!ext', true, true);

            assert.equal(actual, expected);
        });

        it('should add original extension for new path of dot file with &&ext marker', () => {
            const expected = `${WORKSPACE_ROOT_PATH}.env.sample`;

            const actual = getBuildedFilepath('.env.sample', '.env&&ext', true, false);

            assert.equal(actual, expected);
        });
    });
});
