<script lang="ts">
    import NftIcon from '../components/NftIcon.svelte';
    import OwnerAddress from '../components/OwnerAddress.svelte';
    import { ThreadItem, NftCardTypes } from '../lib/types';

    export let nft:ThreadItem ;
    export let clickable:boolean = false;
    export let accountType = NftCardTypes.Friends;
    export let selected: string;
</script>

{#if !nft.wrongOwner }
    <div on:click
        class="{clickable? "clickable" : ""} {nft.unread ? "unread" : ""} {nft.tokenId == selected ? "selected" : ""} cat-list-item" 
        title="{nft.friendsSharedKey? 'Enabled Encryption' : 'Not enabled Encrypted'}">
        <NftIcon tokenId={nft.tokenId} />
        <div class="cat-list-info">
            {#if accountType == NftCardTypes.Admin}
                <h4>{ nft.tokenIdName}
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3111 6.68316C14.1055 7.21165 14.1055 7.798 14.3111 8.32649L14.4316 8.67357C14.8704 9.81959 14.339 11.1088 13.22 11.6132L12.9011 11.7548C12.3781 11.9802 11.955 12.388 11.7107 12.9023L11.569 13.2211C11.0645 14.3397 9.77485 14.871 8.62847 14.4323L8.30253 14.3119C7.77386 14.1063 7.18733 14.1063 6.65866 14.3119L6.33272 14.4323C5.18634 14.871 3.89667 14.3397 3.39219 13.2211L3.25048 12.9023C3.02507 12.3795 2.61706 11.9565 2.1026 11.7123L1.78375 11.5707C0.664719 11.0663 0.133314 9.77709 0.572109 8.63107L0.692564 8.30524C0.898191 7.77675 0.898191 7.1904 0.692564 6.66191L0.572109 6.33607C0.133314 5.19006 0.664719 3.90081 1.78375 3.39649L2.1026 3.25482C2.60967 3.02111 3.01669 2.61422 3.25048 2.10732L3.41344 1.78857C3.91849 0.658674 5.22282 0.125256 6.37524 0.577324L6.70118 0.697741C7.22984 0.903301 7.81638 0.903301 8.34504 0.697741L8.67098 0.577324C9.81736 0.138672 11.107 0.669904 11.6115 1.78857L11.7532 2.10732C11.987 2.61422 12.394 3.02111 12.9011 3.25482L13.22 3.41774C14.339 3.92206 14.8704 5.21131 14.4316 6.35732L14.3111 6.68316ZM6.60336 9.87769L10.5855 5.89686C10.716 5.76004 10.716 5.54492 10.5855 5.40811L10.2099 5.03269C10.0722 4.8977 9.85172 4.8977 9.71395 5.03269L6.35537 8.39019L5.29252 7.33477C5.22823 7.26629 5.13847 7.22745 5.04453 7.22745C4.95058 7.22745 4.86082 7.26629 4.79653 7.33477L4.42099 7.71019C4.35392 7.77669 4.3162 7.86722 4.3162 7.96165C4.3162 8.05608 4.35392 8.14661 4.42099 8.21311L6.10737 9.87769C6.17166 9.94617 6.26142 9.98502 6.35537 9.98502C6.44931 9.98502 6.53907 9.94617 6.60336 9.87769Z" fill="#2082E2"/>
                    </svg>
                </h4>
                
            {:else}
                <h4 data-owner-changed="{nft.wrongOwner ? 'Owner changed' : ''}">{ nft.tokenIdName ? nft.tokenIdName : ("#" + nft.tokenId)}</h4>
            {/if}
            {#if accountType != NftCardTypes.Friends}
                <span class="unread-box {nft.unread ? "has-unread" : ""}">{nft.unread} Unread</span>
            {/if}
            <OwnerAddress accountType={accountType} address={nft.owner} />
        </div>
    </div>
{/if}

<style lang=scss>
    .cat-list-item {
		width: 100%;
		margin: 4px 0;
		display: flex;
		border: darkgray 1px solid;
		border-radius: 10px;
		overflow: hidden;
		min-height: 75px;
		position: relative;
        &.clickable {
            cursor: pointer;
        }
        &.unread, &.selected {
            background-color: #e5e8ff;
        }
        h4 {
            display: flex;
            align-items: center;
            svg {
                margin-left: 10px;
            }
        }
        .cat-list-info {
            flex-grow: 1;
            text-align: left;
            padding: 10px;
            overflow: hidden;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            h4 {
                margin-top: 0;
                margin-bottom: 5px;
            }
        }
        .unread-box {
            position: absolute; 
            right: 15px; 
            top: 15px;
            display: flex;
            align-items: center;
            font-weight: 500;
            &.has-unread {
                &:before {
                    content: "";
                    display: block;
                    width: 8px;
                    height: 8px;
                    border-radius: 8px;
                    margin-right: 5px;
                    background: linear-gradient(234.79deg, #001AFF 37.73%, #4F95FF 118.69%);
                }
            }
        }
	}
</style>