<script lang="ts">
  import kebabcase from 'lodash.kebabcase';
  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import { TextSize } from './models';
  import EpisodeDetail from './routes/EpisodeDetail.svelte';
  import Home from './routes/Home.svelte';
  import PodcastDetail from './routes/PodcastDetail.svelte';
  import Podcasts from './routes/Podcasts.svelte';
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
    '/podcasts/:podcastId': PodcastDetail,
    '/episodes/:episodeId': EpisodeDetail,
  };
</script>

<Router {routes} />

<style>
</style>
