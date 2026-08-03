import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
});
