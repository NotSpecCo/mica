<script lang="ts">
  import { onMount } from 'svelte';
  import { pop } from 'svelte-spa-router';
  import type { OpmlFile, StorageFile } from '../models';
  import { Core } from '../services/core';
  import { OPML } from '../services/opml';
  import ListItem from '../ui-components/ListItem.svelte';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  let files: StorageFile[] = [];
  let workingFile: OpmlFile;

  onMount(async () => {
    files = await OPML.listFiles();
  });
</script>

<View
  headerText="Import OPML"
  menuItems={[
    {
      id: 'menu_subscribe',
      label: 'Subscribe to all',
      hidden: !workingFile,
      action: async () => {
        for (const feed of workingFile.feeds) {
          await Core.podcasts
            .subscribe({ feedUrl: feed.xmlUrl })
            .then(() => console.log(`Subscribed to ${feed.text}`))
            .catch((err) => console.log(`Failed to subscribe to ${feed.text}`, err));
        }

        // Return to podcasts
        pop();
      },
    },
  ]}
>
  {#if !workingFile}
    <Typography type="titleSmall" transform="uppercase">Files</Typography>
    {#each files as file (file.id)}
      <ListItem
        title={file.name}
        subtitle={file.path}
        selectable={{
          id: file.id.toString(),
          onSelect: () =>
            OPML.openFile(file.path).then(({ data }) => {
              workingFile = data;
            }),
        }}
      />
    {/each}
  {:else}
    {#each workingFile.feeds as feed (feed.id)}
      <ListItem
        title={feed.text}
        selectable={{
          id: feed.id.toString(),
        }}
      />
    {/each}
  {/if}
</View>
