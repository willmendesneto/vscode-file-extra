//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

import { activate } from '../../extension';

// TODO: Use `ExtensionContext` type for context
const context: any = {
    subscriptions: [],
};

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', () => {

    // Defines a Mocha unit test
    test('Should have only 4 commands', () => {
        activate(context);

        assert.equal(context.subscriptions.length, 4);
    });
});