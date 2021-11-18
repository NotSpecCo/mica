<script lang="ts">
  import { onDestroy } from 'svelte';
  import { querystring } from 'svelte-spa-router';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  let selectedId: string;
  const queryUnsub = querystring.subscribe((val) => {
    const params = new URLSearchParams(val);
    selectedId = params.get('selected');
  });
  onDestroy(queryUnsub);
</script>

<View headerText="About">
  <Typography>About</Typography>
</View>

<style>
</style>
