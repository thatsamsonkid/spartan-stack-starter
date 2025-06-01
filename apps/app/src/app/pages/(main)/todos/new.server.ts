import { fail, json, type PageServerAction } from '@analogjs/router/server/actions';
import { readFormData } from 'h3';

export async function action({ event }: PageServerAction) {
	const body = await readFormData(event);
	const title = body.get('title') as string;
	// const description = body.get('description') as string;
	// const status = body.get('status') as string;

	if (!title) {
		return fail(422, { title: 'Title is required' });
	}

	// if (email.length < 10) {
	// 	return redirect('/');
	// }

	return json({ type: 'success' });
}
