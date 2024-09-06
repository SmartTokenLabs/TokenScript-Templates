export function uint8tohex(uint8: Uint8Array): string {
	if (!uint8 || !uint8.length) return '';
	return Array.from(uint8)
		.map((i) => ('0' + i.toString(16)).slice(-2))
		.join('');
}

export function hexStringToUint8(str: string = '') {
	return Uint8Array.from(hexStringToArray(str));
}

export function hexStringToArray(str: string = '') {
	if (str.substr(0, 2).toLowerCase() === '0x') {
		str = str.substr(2);
	}
	let arr: number[] = [];
	let strArr = [...str];
	if (strArr.length % 2) strArr.unshift('0');
	let tempStr = '';
	if (!strArr || typeof strArr == 'undefined' || !strArr.length) return [];

	let tmpVal: number;

	while (strArr.length) {
		tempStr = '';
		// @ts-ignore
		tempStr += strArr.shift() + strArr.shift();
		tmpVal = parseInt(tempStr, 16);
		if (isNaN(tmpVal)) {
			throw new Error('hexStringToArray input is not a hex string.');
		}
		arr.push(tmpVal);
	}
	return arr;
}

export function hexToAscii(hexString: string) {
	let asciiString = '';
	for (let i = 0; i < hexString.length; i += 2) {
		asciiString += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
	}
	return asciiString;
}
