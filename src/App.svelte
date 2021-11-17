<script lang="ts">
  import kebabcase from 'lodash.kebabcase';
  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import { TextSize } from './models';
  import EpisodeDetail from './routes/EpisodeDetail.svelte';
  import Filter from './routes/Filter.svelte';
  import Home from './routes/Home.svelte';
  import PodcastDetail from './routes/PodcastDetail.svelte';
  import PodcastPreview from './routes/PodcastPreview.svelte';
  import Podcasts from './routes/Podcasts.svelte';
  import Search from './routes/Search.svelte';
  import { settings } from './stores/settings';
  import { themes } from './themes';

  onMount(() => {
    console.log('app mounted', $settings);

    const theme = themes.find((a) => a.id === $settings.theme) || themes[0];
    for (const id in theme.values) {
      document.documentElement.style.setProperty(`--${kebabcase(id)}`, theme.values[id]);
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme.values.headerBgColor);

    const fontSize = {
      [TextSize.Smallest]: 9,
      [TextSize.Small]: 10,
      [TextSize.Medium]: 11,
      [TextSize.Large]: 12,
      [TextSize.Largest]: 13,
    };
    document.documentElement.style.setProperty(
      '--base-font-size',
      `${fontSize[$settings.textSize]}px`
    );
  });

  const routes = {
    '/': Home,
    '/podcasts': Podcasts,
    '/podcasts/preview': PodcastPreview,
    '/podcasts/:podcastId': PodcastDetail,
    '/episodes/filter/:filterId': Filter,
    '/episodes/:episodeId': EpisodeDetail,
    '/search': Search,
  };
</script>

<Router {routes} />

<style>
</style>
