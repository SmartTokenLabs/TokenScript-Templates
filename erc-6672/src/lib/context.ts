
import {writable} from 'svelte/store';
import { Token } from './types';

// let messageClient = null;

const data = writable({
	token: null
} as {token:Token|null});

function setToken(token: Token){
	data.set({
		...data,
		token
	});

	// Do some other stuff
}

export default {
	data,
	setToken
}
