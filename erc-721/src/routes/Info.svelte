<script lang="ts">
  import { ethers } from "ethers"
  import Loader from "../components/Loader.svelte"
  import context from "../lib/context"
  import { chainConfig, getPixelColor } from "./../utils/index"

  let token: any
  let loading = true
  let collectionName: string
  let creatorRoyaltiesForSale: number
  let explorer: string
  let cardBackground: string | undefined
  let imageFailedToLoad = false

  context.data.subscribe(async (value) => {
    if (!value.token) return
    token = value.token

    init()

    // You can load other data before hiding the loader
    loading = false
  })

  function setExplorer() {
    explorer = chainConfig[Number(token.chainId)]?.explorer
  }

  function setCollectionName() {
    if (token.name.includes("#")) {
      collectionName = token.name.substring(0, token.name.indexOf("#"))
    } else {
      collectionName = token.name
    }
  }

  async function checkCalculateRoyalty() {
    const rpc = chainConfig[Number(token.chainId)]?.rpc

    if (!rpc) return

    const provider = new ethers.JsonRpcProvider(rpc)
    const contract = new ethers.Contract(
      token.contractAddress,
      [
        {
          constant: true,
          name: "royaltyInfo",
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "salePrice",
              type: "uint256",
            },
          ],
          outputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "royaltyAmount",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      provider
    )

    try {
      const calculateRoyalty = await contract.royaltyInfo(token.tokenId, 100)
      if (calculateRoyalty[1]) creatorRoyaltiesForSale = calculateRoyalty[1]
    } catch (error) {
      // no contract method or failed query.
    }
  }

  function setRoyalties() {
    checkCalculateRoyalty()
  }

  function setPixelColor(event: Event) {
    cardBackground = getPixelColor(event)
  }

  function init() {
    setCollectionName()
    setRoyalties()
    setExplorer()
  }

  function handleImageError() {
    imageFailedToLoad = true
  }
</script>

{#if token}
  <div
    style="background-color: {cardBackground
      ? cardBackground
      : '#f5f5f5'}; padding: 20px; border-radius: 6px;"
  >
    <!--
		example external_link_open_graph_image
		<img style="width:100%; border-radius: 7px;" src="https://coolcats.com/images/og-image.png" alt={'hero image'} />
	-->
    {#if token.external_link_open_graph_image}
      <img
        crossorigin="anonymous"
        style="width:100%; border-radius: 7px;"
        src={token.external_link_open_graph_image}
        alt={"hero image"}
      />
    {/if}
    {#if token}
      <div
        style="margin: 14px 0px 18px 0; display: flex; justify-content: space-between; align-items: center; background-color: white; border-radius: 7px; height: 142px; width: 100%;"
      >
        <div style="margin: 15px; width: 50%;">
          <h3
            style="font-size: 18px; margin-bottom: 7px; word-wrap: break-word;"
          >
            {token.name}
          </h3>
          <p style="color: #989898; margin: 0; font-size: 14px">
            {collectionName} Collection
          </p>
        </div>
        <div>
          {#if !token.image_preview_url || imageFailedToLoad}
            <div
              style="border-radius: 7px; margin-top: 5px; margin-right: 15px; color: rgb(112, 112, 112); border: 1px solid; height: 98px; width: 98px; padding: 32px 16px; font-size: 14px;"
            >
              No image found.
            </div>
          {/if}
          {#if token.image_preview_url && imageFailedToLoad === false}
            <img
              on:load|once={setPixelColor}
              crossorigin="anonymous"
              style="display: none; border-radius: 7px; width: 98px; margin-top: 5px; margin-right: 15px;"
              src={token.image_preview_url}
              alt={token.name}
            />
            <img
              src={token.image_preview_url}
              alt={token.name}
              on:error={handleImageError}
              style="border-radius: 7px; width: 98px; margin-top: 5px; margin-right: 15px;"
            />
          {/if}
        </div>
      </div>
      <div
        style="background-color: white; border-radius: 7px; width: 100%; display: flex; justify-content: space-between; flex-direction: column; padding: 0 18px;"
      >
        <div style="width: 100%;">
          <p
            style="
						font-size: 19px;
						font-weight: 500;
						text-align: center;
						margin: 38px 0 14px 0;
						"
          >
            Info
          </p>
        </div>
        {#if token?.tokenInfo?.attributes?.length > 0}
          <div
            style="margin-bottom: 18px; background-color: #F5F5F5; color: #989898; font-weight: 300; border-radius: 20px; padding: 12px 22px;"
          >
            <p
              style="color: rgb(112, 112, 112); font-weight: 500; font-size: 14px;"
            >
              Traits
            </p>
            <div
              style="display: flex; justify-content: space-evenly; align-items: baseline; flex-direction: row; flex-wrap: wrap;"
            >
              {#each token?.tokenInfo?.attributes as trait}
                <div
                  style="margin-bottom: 18px; width: 148px; background-color: white; font-size: 12px; text-align: center; border-radius: 20px; font-weight: 300; padding: 12px; border: 1px solid rgb(182, 182, 191);"
                >
                  <p
                    style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;"
                  >
                    {trait.trait_type}
                  </p>
                  <p style="font-size: 14px; color: black;">{trait.value}</p>
                  <!-- <p style="font-weight: 300; color: #ff0086e0">{trait.rarity ? trait.rarity : '(rarity percentage unknown)'}</p> -->
                </div>
              {/each}
            </div>
          </div>
        {/if}
        <div
          style="margin-bottom: 18px; background-color: #F5F5F5; border-radius: 20px; font-weight: 300; padding: 24px;"
        >
          <p
            style="color: rgb(112, 112, 112); font-weight: 500; font-size: 14px;"
          >
            Details
          </p>
          {#if token.description}
            <p
              style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;"
            >
              Description
            </p>
            <p style="font-size: 14px; color:black; word-wrap: break-word;">
              {token.description}
            </p>
          {/if}
          {#if token.contractAddress}
            <p
              style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;"
            >
              Contract
            </p>
            <p
              style="font-size: 14px; color: rgb(136, 136, 136); word-wrap: break-word;"
            >
              {#if explorer}
                <div
                  style="font-size: 14px; color:black; word-wrap: break-word;"
                >
                  {token.contractAddress}
                  <a
                    href={explorer + "address/" + token.contractAddress}
                    target="_blank"
                  >
                    <svg
                      style="width: 18px; position: relative; top: 4px; left: 2px;"
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xml:space="preserve"
                    >
                      <g
                        transform="matrix(2.56187,0,0,2.56187,-3302.82,-4886.51)"
                      >
                        <path
                          d="M1308.92,1911.91L1308.92,1914.41L1300.89,1914.41C1297.78,1914.41 1295.26,1916.93 1295.26,1920.04C1295.26,1920.04 1295.26,1933.79 1295.26,1933.79C1295.26,1936.9 1297.78,1939.42 1300.89,1939.42C1300.89,1939.42 1316.59,1939.42 1316.59,1939.42C1319.7,1939.42 1322.22,1936.9 1322.22,1933.79L1322.22,1928.52L1324.72,1928.52L1324.72,1933.79C1324.72,1938.28 1321.08,1941.92 1316.59,1941.92L1300.89,1941.92C1296.4,1941.92 1292.76,1938.28 1292.76,1933.79L1292.76,1920.04C1292.76,1915.56 1296.4,1911.91 1300.89,1911.91L1308.92,1911.91ZM1324.52,1913.16L1323.27,1911.91L1313.75,1911.91L1313.75,1914.41L1320.26,1914.41L1308.04,1926.63L1309.8,1928.4L1322.04,1916.17C1322.04,1916.17 1322.07,1923.54 1322.07,1923.54L1324.57,1923.53L1324.52,1913.16Z"
                        />
                      </g>
                    </svg>
                  </a>
                </div>
              {/if}
              {#if !explorer}
                {token.contractAddress}
              {/if}
            </p>
          {/if}
          {#if token.tokenInfo.type}
            <p
              style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;"
            >
              Token Standard
            </p>
            <p style="font-size: 14px; color: black;">{token.tokenInfo.type}</p>
          {/if}
          {#if token.chainId}
            <p
              style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;"
            >
              Chain
            </p>
            <p style="font-size: 14px; color: black; word-wrap: break-word;">
              {token.chainId}
            </p>
          {/if}
          {#if token.symbol}
            <p
              style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;"
            >
              Symbol
            </p>
            <p style="font-size: 14px; color: black; word-wrap: break-word;">
              {token.symbol}
            </p>
          {/if}
          {#if creatorRoyaltiesForSale}
            <p
              style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;"
            >
              Creator Earnings Per Sale
            </p>
            <p style="font-size: 14px; color: black; word-wrap: break-word;">
              {creatorRoyaltiesForSale + "%"}
            </p>
          {/if}
          {#if token.external_link}
            <p
              style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;"
            >
              Website
            </p>
            <p style="font-size: 14px; color: black; word-wrap: break-word;">
              {token.external_link}
            </p>
          {/if}
        </div>
      </div>
    {/if}
    <Loader show={loading} />
  </div>
{:else}
  <!-- else content here -->
{/if}
