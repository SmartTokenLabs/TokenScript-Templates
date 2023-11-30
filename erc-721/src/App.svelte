<script lang="ts">
  import Route from "./_core/Route.svelte"
  import Router from "./_core/Router.svelte"
  import Info from "./routes/Info.svelte"
  import Transfer from "./routes/transfer.svelte"
</script>

<Router>
  <Route path="info">
    <Info />
  </Route>

  <Route path="transfer">
    <Transfer />
  </Route>
</Router>
