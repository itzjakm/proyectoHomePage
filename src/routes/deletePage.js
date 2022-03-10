import { BACKEND_GITHUB } from '$lib/env';

export async function patch({ request }) {
	const data = await request.json();
	if (data.password != '613') return { status: 401, body: 'Wrong password' };
	const { pageNum } = data;
	const headers = {
		authorization: `token ${BACKEND_GITHUB}`
	};
	const res = await fetch('https://api.github.com/gists/6d713dcec6ff42d8e0645a6fb3ce6a00');
	const resData = await res.json();
	const { files } = resData;
	if (Number.isNaN(+pageNum)) return { status: 400, body: 'Page number must be a number' };
	if (
		!Object.entries(files)
			.map((e) => e[0])
			.includes(pageNum)
	)
		return { status: 400, body: 'Page does not exist' };
	await fetch(`https://api.github.com/gists/6d713dcec6ff42d8e0645a6fb3ce6a00`, {
		headers,
		method: 'PATCH',
		body: JSON.stringify({
			files: {
				[pageNum]: { content: '' }
			}
		})
	});
	return { status: 200, body: 'Finished' };
}
