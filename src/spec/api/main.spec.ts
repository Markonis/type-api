import { setPaths, ApiEnpoint, resolvePath } from '../../api/main';
import { assert } from 'chai';
import { isEqual } from 'lodash';

describe('setPaths', () => {
	const api = {
		parentA: {
			childP: new ApiEnpoint(),
			parentB: {
				childQ: new ApiEnpoint(),
				childR: new ApiEnpoint()
			}
		},
		parentC: {
			childX: new ApiEnpoint()
		}
	}

	it('does not modify the original object', () => {
		setPaths(api);
		assert(isEqual(api.parentA.childP.path, []));
		assert(isEqual(api.parentA.parentB.childQ.path, []));
		assert(isEqual(api.parentA.parentB.childR.path, []));
		assert(isEqual(api.parentC.childX.path, []));
	});

	it('sets the paths correctly', () => {
		const result = setPaths(api);
		assert(isEqual(result.parentA.childP.path, ['parentA', 'childP']));
		assert(isEqual(result.parentA.parentB.childQ.path, ['parentA', 'parentB', 'childQ']));
		assert(isEqual(result.parentA.parentB.childR.path, ['parentA', 'parentB', 'childR']));
		assert(isEqual(result.parentC.childX.path, ['parentC', 'childX']));
	});

	describe('resolvePath', () => {
		it('returns an empty array given root path', () => {
			const initialized = setPaths(api);
			const result = resolvePath(initialized);
			assert(isEqual(result, []));
		});

		it('returns the correct path given object in the middle', () => {
			const initialized = setPaths(api);
			const result = resolvePath(initialized.parentA.parentB);
			assert(isEqual(result, ['parentA', 'parentB']));
		});

		it('returns the correct path given reference to the endpoint', () => {
			const initialized = setPaths(api);
			const result = resolvePath(initialized.parentA.parentB.childQ);
			assert(isEqual(result, ['parentA', 'parentB', 'childQ']));
		});

		it('throws an error given object which does not belong to the tree', () => {
			const x = { a: 1 };
			assert.throws(() => resolvePath(x));
		});
	})
});
