<script lang="ts">
  import pkg from '../../package.json';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';
</script>

<View headerText="About">
  <Typography>A minimalistic podcast app developed by Garrett Downs for KaiOS.</Typography>
  <Typography align="center">mica v{pkg.version}</Typography>
</View>

<style>
</style>
