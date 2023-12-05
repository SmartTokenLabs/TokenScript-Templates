<script lang="ts">
  import { Meta, Root } from "./_core/TokenScript"
  import Card from "./_core/TokenScript/Card.svelte"
  import Cards from "./_core/TokenScript/Cards.svelte"
  import Contract from "./_core/TokenScript/Contract.svelte"
  import Info from "./routes/Info.svelte"
  import Transfer from "./routes/transfer.svelte"
</script>

<Root>
  <Meta
    name="erc-721"
    description="erc-721 baseline tokenscript for any ERC721 token"
    aboutUrl="https://www.smartlayer.network/smartcat"
    iconUrl="https://smart-layer-d12f1ja6t-smart-token-labs.vercel.app/smartcat/opengraph-image-3urawq.png?708f218c0ad1b4d7"
  />
  <Contract
    id="Token"
    interface="erc721"
    address="0xd5ca946ac1c1f24eb26dae9e1a53ba6a02bd97fe"
    chain="137"
  />

  <Cards>
    <Card type="token" name="Info" contractId="Token">
      <Info />
    </Card>
    <Card
      type="action"
      name="Transfer"
      contractId="Token"
      function="safeTransferFrom"
    >
      <Transfer />
    </Card>
  </Cards>
</Root>
