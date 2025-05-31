import { fail, json, redirect, type PageServerAction } from '@analogjs/router/server/actions';
import { readFormData } from 'h3';

export async function action({ event }: PageServerAction) {
	const body = await readFormData(event);
	console.log(body);
	const email = body.get('email') as string;

	if (!email) {
		return fail(422, { email: 'Email is required' });
	}

	if (email.length < 10) {
		return redirect('/');
	}

	return json({ type: 'success' });
}
