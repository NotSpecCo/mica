<script lang="ts">
  import { onDestroy } from 'svelte';
  import { querystring } from 'svelte-spa-router';
  import pkg from '../../package.json';
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
  <Typography>A minimalistic podcast app developed by Garrett Downs for KaiOS.</Typography>
  <Typography align="center">mica v{pkg.version}</Typography>
</View>

<style>
</style>
