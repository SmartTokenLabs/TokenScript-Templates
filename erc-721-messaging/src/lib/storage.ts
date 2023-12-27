import { writable } from 'svelte/store';

export const showLoader = writable<boolean>(false);

export const notify = writable<{message:string,
    status:boolean}>({
        message:"",
        status:true,
    });

export const metadataCache = writable<{ [key: string]: string }>({})
