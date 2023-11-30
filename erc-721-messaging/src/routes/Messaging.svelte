<script lang="ts">
    import Header from "../components/Header.svelte";

    import GetFriendsTab from "./GetFriendsTab.svelte";
    import Messages from "./Messages.svelte";
    import ConfirmFriendsTab from "./ConfirmFriendsTab.svelte";
    import AdminMessages from "./AdminMessages.svelte";
    import Tabs from "./Tabs.svelte";

    // List of tab items with labels, values and assigned components
let items = [
  { label: "Get Friends",
    value: 1,
    component: GetFriendsTab
    },
  { label: "Confirm Friends",
       value: 2,
       component: ConfirmFriendsTab
      },
  { label: "Messages",
       value: 3,
       component: Messages
      },
  { label: "Admin",
       value: 4,
       component: AdminMessages
      }
];
</script>

<Header/>

<Tabs {items} />

