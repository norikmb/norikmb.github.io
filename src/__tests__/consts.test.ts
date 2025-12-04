import { describe, it, expect } from 'vitest';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

describe('Site Constants', () => {
	it('should have SITE_TITLE defined', () => {
		expect(SITE_TITLE).toBeDefined();
		expect(typeof SITE_TITLE).toBe('string');
		expect(SITE_TITLE.length).toBeGreaterThan(0);
	});

	it('should have SITE_DESCRIPTION defined', () => {
		expect(SITE_DESCRIPTION).toBeDefined();
		expect(typeof SITE_DESCRIPTION).toBe('string');
		expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
	});

	it('should have correct values', () => {
		expect(SITE_TITLE).toBe('Kambe Blog');
	});
});
