<script lang="ts">
  import Loader from "../components/Loader.svelte"
  import context from "../lib/context"
  import { ethers } from "ethers"
  let token: any
  let loading = true
  let collectionName: string
  let receivingAccountAddress: string
  let numberOfTokensToSend: number
  let cardBackground: string | undefined
  let imageFailedToLoad = false

  context.data.subscribe(async (value) => {
    if (!value.token) return
    token = value.token

    init()

    // You can load other data before hiding the loader
    loading = false
  })

  function setCollectionName() {
    if (token.name.includes("#")) {
      collectionName = token.name.substring(0, token.name.indexOf("#"))
    } else {
      collectionName = token.name
    }
  }

  function init() {
    setCollectionName()
  }

  function setReceivingAccountAddress(event: Event) {
    // @ts-ignore
    receivingAccountAddress = event.target.value
    web3.action.setProps({
      sendingAccountAddress: token.ownerAddress,
      receivingAccountAddress,
      tokenId: token.tokenId,
    })
  }

  function setAmountOfTokensToSend(event: Event) {
    // @ts-ignore
    numberOfTokensToSend = event.target.value
    web3.action.setProps({
      numberOfTokens: numberOfTokensToSend,
      tokenId: token.tokenId,
    })
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
    {#if token.external_link_open_graph_image}
      <img
        style="width:100%; border-radius: 7px;"
        src={token.external_link_open_graph_image}
        alt={"hero image"}
      />
    {/if}
    <div
      style="margin: 14px 0px 18px 0; display: flex; justify-content: space-between; align-items: center; background-color: white; border-radius: 7px; height: 142px; width: 100%;"
    >
      <div style="margin: 15px; width: 50%;">
        <h3 style="font-size: 18px; margin-bottom: 7px; word-wrap: break-word;">
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
						margin: 38px 0 14px 0;
						"
        >
          Transfer
        </p>
      </div>

      <div
        style="display: flex; justify-content: space-between; margin: 10px 0;"
      >
        <p style="font-size: 14px;font-weight: 400;color: #707070;">Send</p>
      </div>

      <div style="margin: 14px 0;">
        {#if token.image_preview_url && !imageFailedToLoad}
          <img
            style="border-radius: 7px;width: 68px; margin-right: 15px;"
            src={token.image_preview_url}
            alt={token.name}
          />
        {/if}

        <p
          style="font-size: 14px;padding: 0;margin: 7px 0;font-weight: 400; word-wrap: break-word;"
        >
          #{token.tokenId}
        </p>
      </div>

      <p style="font-size: 14px;font-weight: 400; color: #707070;">To</p>

      <div
        style="margin-bottom: 18px;background-color: #F5F5F5;border-radius: 20px;font-weight: 300;padding: 18px;"
      >
        <p style="margin: 7px 0;font-weight: 400;font-size: 14px;">
          Account Address
        </p>
        <input
          minlength="42"
          maxlength="42"
          on:change={(event) => {
            setReceivingAccountAddress(event)
          }}
          placeholder=""
          id="recieving-account"
          style="padding: 12px 14px;width: 100%;border-radius: 4px;border: 1px solid #B6B6BF;border-radius: 14px;margin: 5px 0;"
          type="text"
        />
        {#if receivingAccountAddress && !ethers.isAddress(receivingAccountAddress)}
          <div style="font-size: 14px; color: red; padding: 12px 0;">
            Please enter a valid account address.
          </div>
        {/if}

        <p style="margin: 7px 0;font-weight: 400;font-size: 14px;">
          Amount ({token.tokenInfo?.data?.balance
            ? token.tokenInfo?.data?.balance + " tokens available"
            : ""})
        </p>
        <input
          on:change={(event) => {
            setAmountOfTokensToSend(event)
          }}
          placeholder=""
          id="tokens-to-send"
          style="padding: 12px 14px;width: 100%;border-radius: 4px;border: 1px solid #B6B6BF;border-radius: 14px;margin: 5px 0;"
          type="number"
        />
        {#if token.tokenInfo?.data?.balance && token.tokenInfo?.data?.balance < numberOfTokensToSend}
          <div style="font-size: 14px; color: red; padding: 12px 0;">
            Please enter a number of tokens equal to or less than the owned
            balance.
          </div>
        {/if}
      </div>

      {#if numberOfTokensToSend && receivingAccountAddress}
        <div
          style="margin-bottom: 18px;background-color: #F5F5F5;border-radius: 20px;font-weight: 300;padding: 18px;"
        >
          <p
            style="margin: 7px 0;font-weight: 500;font-size: 14px;color: #707070;"
          >
            Transaction Details
          </p>

          <p style="color: #888;font-weight: 400;font-size: 14px;">Chain Id</p>
          <p style="color: black; word-wrap: break-word;font-size: 14px;">
            {token.chainId}
          </p>

          <p style="color: #888;font-weight: 400;font-size: 14px;">Send</p>
          <p style="color: black;word-wrap: break-word;font-size: 14px;">
            {token.name}
          </p>

          <p style="color: #888;font-weight: 400;font-size: 14px;">
            Number of tokens
          </p>
          <p style="color: black;word-wrap: break-word;font-size: 14px;">
            {numberOfTokensToSend}
          </p>

          <p style="color: #888;font-weight: 400;font-size: 14px;">From</p>
          <p style="color: black;word-wrap: break-word;font-size: 14px;">
            {token.ownerAddress}
          </p>

          <p style="color: #888;font-weight: 400;font-size: 14px;">To</p>
          <p style="color: black;word-wrap: break-word;font-size: 14px;">
            {receivingAccountAddress}
          </p>
        </div>
      {/if}
    </div>
    <Loader show={loading} />
  </div>
{:else}
  <!-- else content here -->
{/if}
