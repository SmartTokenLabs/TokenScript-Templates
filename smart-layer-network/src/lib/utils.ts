import { ethers } from 'ethers';
import { slnContractABI, stakeContractABI } from './../abi/sln';

export async function getStakedData(stakeAddress: string, ownerAddress: string) {
  // @ts-ignore
  const provider = new ethers.JsonRpcProvider(rpcURL);
  // let estimation;
  const contract = new ethers.Contract(
    stakeAddress,
    stakeContractABI,
    provider
  );

  try {
    // @ts-ignore
    const stakedData = await contract._stake(ownerAddress);
    const stakedDataAsArr = stakedData.toArray();
    return {
      stakeAmount: stakedDataAsArr[0],
      stakeWithdrawn: stakedDataAsArr[1],
      stakeReward: stakedDataAsArr[2],
      stakeLastUpdated: stakedDataAsArr[3]
    };
  } catch (error) {
    console.log('could not retrieve staking contract data: ', error);
    return {
      stakeAmount: undefined,
      stakeWithdrawn: undefined,
      stakeReward: undefined,
      stakeLastUpdated: undefined
    };
  }
}

export async function getApprovedStakeAllowance(tokenAddress: string, spenderAddress: string, ownerAddress: string) {
  // @ts-ignore
  const provider = new ethers.JsonRpcProvider(rpcURL);
  const contract = new ethers.Contract(
    tokenAddress,
    slnContractABI,
    provider
  );

  try {
    // @ts-ignore
    const stakeAllowance = await contract.allowance(ownerAddress, spenderAddress);
    return {
      ether: Number(ethers.formatEther(stakeAllowance)),
      wei: Number(stakeAllowance)
    };
  } catch (error) {
    console.log('could not retrieve stake allowance: ', error);
    return {
      ether: 0,
      wei: 0
    };
  }
}