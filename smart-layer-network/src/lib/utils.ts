export function formatWithByDecimalPlaces(num: number, decimalPlaces = 2) {
  return num.toFixed(decimalPlaces);
}

export function previewAddr(inputString: string) {
  if (inputString.length < 10) {
    return inputString;
  } else {
    const firstChars = inputString.substring(0, 6);
    const lastChars = inputString.substring(inputString.length - 4);
    return `${firstChars}...${lastChars}`;
  }
}

export async function fetchENSImage(ensName: string) {
  try {
    const response = await fetch(`https://metadata.ens.domains/mainnet/avatar/${ensName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ENS image');
    }
    return response.blob();
  } catch (error) {
    console.error('Error fetching ENS image:', error);
    return undefined;
  }
}
