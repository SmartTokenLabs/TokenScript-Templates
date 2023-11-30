
import {writable} from 'svelte/store';
import {MessageClient} from "./messageClient";
import {Token} from "./types";
import {getContract} from "./data";

let messageClient:MessageClient;

const data = writable<{token: Token|undefined, contract:any}>({
	token: undefined,
	contract: undefined
});

const messagingKey = writable<string>("");
const derivedPrivateKey = writable<string>("");

async function setToken(token: Token){
	data.set({
		...data,
		token,
		contract: await getContract(token)
	});


	// Do some other stuff
}

async function getMessageClient(){

	if (messageClient)
		return messageClient;

	return new Promise((resolve, ) => {
		data.subscribe((data) => {
			// @ts-expect-error token will be set on new event  
			messageClient = new MessageClient(data.token);
			resolve(messageClient);
		})
	})
}

export default {
	data,
	setToken,
	getMessageClient,
	messagingKey,
	derivedPrivateKey
}
