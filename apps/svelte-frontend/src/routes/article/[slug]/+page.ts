import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	if (params.slug) {
		return {
			title: params.slug
		};
	}

	throw error(404, 'Not found');
};
