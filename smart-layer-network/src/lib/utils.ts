import { ethers } from 'ethers';
import { slnContractABI } from './../abi/sln';

export function formatWithByDecimalPlaces(num: number, decimalPlaces = 2) {
  return num.toFixed(decimalPlaces);
}

function previewAddr(inputString: string) {
  if (inputString.length < 10) {
    return inputString; // If the input string is less than 10 characters, return it as is
  } else {
    const firstChars = inputString.substring(0, 5); // Extract the first 5 characters
    const lastChars = inputString.substring(inputString.length - 5); // Extract the last 5 characters
    return `${firstChars}...${lastChars}`; // Concatenate and return the formatted string
  }
}