import { ethers } from "hardhat";

async function main() {
	
  const [owner] = await ethers.getSigners();
  console.log(owner.address)

  // !!! its just random keys with funds in testnet, not important, but have to be syncronized with smart-token-store-backend
  
  // 0xdC1A00c3cb7f769ED0C3021A38EC7cfCB5D0631e
	const privateKey1 = "0x0123456789012345678901234567890123456789012345678901234567890000";
  // 0x973Fe93EcEA2F0A622377cC57FAb8EA596d18c63
	const privateKey2 = "0x0123456789012345678901234567890123456789012345678901234567890001";
  // 0xd43A8e0221d1EdbD23433A5af9788d66067793a8
	const privateKey3 = "0x1bbbb7711ba7c0d80e8368baaafcf8936c5142ce33872f3c4b72096eeee0455d";
	const wallet1 = new ethers.Wallet(privateKey1, owner.provider);
	const wallet2 = new ethers.Wallet(privateKey2, owner.provider);
	const wallet3 = new ethers.Wallet(privateKey3, owner.provider);

  const { chainId } = await ethers.provider.getNetwork();
  if (chainId == 31337n) {
		await owner.sendTransaction({
			to: wallet1.address,
			value: ethers.parseEther("1"),
		});
    await owner.sendTransaction({
			to: wallet2.address,
			value: ethers.parseEther("1"),
		});
    await owner.sendTransaction({
			to: wallet3.address,
			value: ethers.parseEther("1"),
		});
    await owner.sendTransaction({
			to: "0x2f21dc12dd43bd15b86643332041ab97010357d7",
			value: ethers.parseEther("1"),
		});
	}  
  
  const ERC6672 = (await ethers.getContractFactory("ERC6672")).connect(wallet3);
  // const erc6672 = await ERC6672.attach("0x074Cb53660666E3adAc1a86750dF554a77d01Ae1");
  
  const erc6672 = await ERC6672.deploy();
  await erc6672.waitForDeployment();
  
	console.log(`Deployed to ${erc6672.target}`);
  

	let allowedRedemptionIds1 = [
		ethers.zeroPadBytes(Uint8Array.from([1, 1]), 32),
		ethers.zeroPadBytes(Uint8Array.from([1, 2, 2]), 32),
		ethers.zeroPadBytes(Uint8Array.from([1, 3, 3, 3]), 32),
	];
  let allowedRedemptionIds2 = [
		ethers.zeroPadBytes(Uint8Array.from([2, 1]), 32),
		ethers.zeroPadBytes(Uint8Array.from([2, 2, 2]), 32),
		ethers.zeroPadBytes(Uint8Array.from([2, 3, 3, 3]), 32),
	];
  let allowedRedemptionIds3 = [
		ethers.zeroPadBytes(Uint8Array.from([3, 1]), 32),
		ethers.zeroPadBytes(Uint8Array.from([3, 2, 2]), 32),
		ethers.zeroPadBytes(Uint8Array.from([4, 3, 3, 3]), 32),
	];
  
  

	await erc6672.mint("0x6DDD22a9bCc22811BEc8786d2090F7381Dcd22e8");
	await erc6672.mint("0x6DDD22a9bCc22811BEc8786d2090F7381Dcd22e8");
	await erc6672.mint("0x2F21dC12dd43bd15b86643332041ab97010357D7");
	await erc6672.mint("0xbefc0255133BC817739e7B3E8b374796370561Ee");
	await erc6672.mint("0xd43A8e0221d1EdbD23433A5af9788d66067793a8");
	console.log("Minted 4 NFTs");

	await erc6672.addOperator(wallet1.address);
	await erc6672.addOperator(wallet2.address);
	await erc6672.addOperator(wallet3.address);

	console.log("Added 3 operators");
	console.log(wallet1.address);
	console.log(wallet2.address);
	console.log(wallet3.address);

	
  // await erc6672.connect(owner).setAllowedRedempltionIds(allowedRedemptionIds66)
	let tx = await erc6672.connect(wallet3).setAllowedRedempltionIds(allowedRedemptionIds1);
  await tx.wait();
  
	tx = await erc6672.connect(wallet2).setAllowedRedempltionIds(allowedRedemptionIds2);
  await tx.wait();
	tx = await erc6672.connect(wallet1).setAllowedRedempltionIds(allowedRedemptionIds3);
  await tx.wait();
	console.log("Set redemptions");

	// await erc6672.connect(wallet3).redeem(allowedRedemptionIds[1], 0, "")

	// await erc6672.connect(wallet3).redeem(allowedRedemptionIds[0], 1, "");

	// await erc6672.connect(wallet3).redeem(allowedRedemptionIds[0], 2, "");
	// // await erc6672.connect(owner).redeem(allowedRedemptionIds[1], 2, "")
	// await erc6672.connect(wallet3).redeem(allowedRedemptionIds[2], 2, "");

	// await erc6672.connect(wallet3).redeem(allowedRedemptionIds[2], 3, "");
	// console.log("Added few redemptions");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
