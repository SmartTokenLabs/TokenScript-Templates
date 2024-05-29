import {BASE_URL} from "./constant"

export async function request(url: string, method: "get"|"post", requestData?: any){

    const headers: any = {
        "Content-type": "application/json",
        "Accept": "application/json",
    };

    const res = await fetch(BASE_URL + url, {
        method,
        headers,
        body: requestData ? JSON.stringify(requestData): undefined
    });

    let data: any;

    try {
        data = await res.json();
    } catch (e: any){
        console.log("Respose JSON decode failed")
    }

    if (res.status > 299 || res.status < 200){
        throw new Error("HTTP Request failed:" + (data?.message ?? res.statusText ));
    }

    return data;
}