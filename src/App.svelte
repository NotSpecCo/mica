<script lang="ts">
  import Router from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';
  import AudioPlayer from './components/AudioPlayer.svelte';
  import { TextSize } from './models';
  import Home from './routes/Home.svelte';
  import Podcasts from './routes/Podcasts.svelte';
  import Import from './routes/Import.svelte';
  import PodcastPreview from './routes/PodcastPreview.svelte';
  import PodcastDetail from './routes/PodcastDetail.svelte';
  import Filter from './routes/Filter.svelte';
  import EpisodeDetail from './routes/EpisodeDetail.svelte';
  import Search from './routes/Search.svelte';
  import Player from './routes/Player.svelte';
  import Settings from './routes/Settings.svelte';
  import About from './routes/About.svelte';
  import { settings } from './stores/settings';

  $: {
    const warmth = $settings.warmth * 5;
    document.documentElement.style.setProperty(`--theme-bg-luminance`, `${100 - warmth}%`);
    if (warmth < 20) {
      document.documentElement.style.setProperty(`--theme-text-luminance`, `${0}%`);
    } else if (warmth < 50) {
      document.documentElement.style.setProperty(`--theme-text-luminance`, `${20}%`);
    } else if (warmth < 70) {
      document.documentElement.style.setProperty(`--theme-text-luminance`, `${10}%`);
    } else if (warmth < 99) {
      document.documentElement.style.setProperty(`--theme-text-luminance`, `${80}%`);
    } else {
      document.documentElement.style.setProperty(`--theme-text-luminance`, `${100}%`);
    }

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
  }

  const routes = {
    '/': Home,
    '/podcasts': Podcasts,
    '/podcasts/import': Import,
    '/podcasts/preview': PodcastPreview,
    '/podcasts/:podcastId': PodcastDetail,
    '/episodes/filter/:filterId': Filter,
    '/episodes/:episodeId': EpisodeDetail,
    '/search': Search,
    '/player': Player,
    '/settings': Settings,
    '/about': About,
  };
</script>

<Router {routes} />
<AudioPlayer />
