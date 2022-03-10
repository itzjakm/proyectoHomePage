import { FRONTEND_GITHUB } from '$lib/env';

export async function get() {
	const res = await fetch('https://api.github.com/gists/6d713dcec6ff42d8e0645a6fb3ce6a00', {
		headers: {
			authorization: `token ${FRONTEND_GITHUB}`
		}
	});
	const data = await res.json();
	return { status: 200, body: { data } };
}
