<script lang="ts">

	import { notify } from '../lib/storage';
	$: {
		if ($notify.message){
			setTimeout(()=>{
				$notify = {message:"", status: true};
			}, 7000)
		}
	}
</script>

<div class="box {$notify.status ? 'success' : 'error'} {$notify.message ? "active" : ""}">
	{$notify.message}
</div>

<style lang=scss>
	.box {
		background-color: #eee;
		padding: 10px;
		word-wrap: break-word;
		position: fixed;
		right: 30px;
		top: 15px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;
		max-width: calc(100% - 60px);
		&.active {
			opacity: 1;
		}
		&.success {
			color: green;
		}
		&.error {
			color: red;
		}
	}
</style>
