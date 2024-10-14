
interface SwapTokenDetails {
	name: string,
	symbol: string,
	decimals: number,
	icon: string
}

export const TOKEN_DETAILS: {[address: string]: SwapTokenDetails} = {
	"0x714DB550b574b3E927af3D93E26127D15721D4C2" : {
		name: "GreenMetaverseToken",
		symbol: "GMT",
		decimals: 8,
		icon: "https://logo.moralis.io/0x89_0x714db550b574b3e927af3d93e26127d15721d4c2_ec553d9ead5e6e4e6b55eff958981467"
	},
	"0xc2132d05d31c914a87c6611c10748aeb04b58e8f": {
		name: "(PoS) Tether USD",
		symbol: "USDT",
		decimals: 6,
		icon: "https://logo.moralis.io/0x89_0xc2132d05d31c914a87c6611c10748aeb04b58e8f_408ee7bad746d93d15a89054dcaf908b"
	},
	"0x57211299bc356319ba5ca36873eb06896173f8bc": {
		name: "Super Useless Token",
		symbol: "SUT",
		decimals: 18,
		icon: "https://logo.moralis.io/0x89_0x57211299bc356319ba5ca36873eb06896173f8bc_67cb3f7210180042c0310970226cce83"
	}
};