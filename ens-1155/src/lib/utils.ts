
export const decimalToHex = (decimalNumber: number) => {
  // @ts-ignore
  const bigIntNumber = BigInt(decimalNumber);
  const hexString = bigIntNumber.toString(16);
  return '0x' + hexString;
}

export const hexToAscii = (inputStr: string) => {
  const hex = inputStr.toString();
  let str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export const santitiseEnsName = (inputStr: string) => {

  let subName: string | undefined;
  let baseName: string | undefined;

  let nameFromInputStr = inputStr.replace(/[^\a-zA-Z0-9 ]/g, '.').replace(/^\.+|\.+$/g, '');

  // @ts-ignore
  const ensNameIsSubName = (nameFromInputStr && nameFromInputStr.match(/\./g).length > 1);

  if (ensNameIsSubName) {
    subName = nameFromInputStr;
    baseName = nameFromInputStr.replace(/^[^\.]*\./, '');
  } else {
    baseName = nameFromInputStr
  }

  return {
    baseName,
    subName
  }

}