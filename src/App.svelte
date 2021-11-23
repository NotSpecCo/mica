<script lang="ts">
  import Router from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';
  import AudioPlayer from './components/AudioPlayer.svelte';
  import { TextSize } from './models';
  import Home from './routes/Home.svelte';
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
    '/podcasts': wrap({
      asyncComponent: () => import('./routes/Podcasts.svelte'),
    }),
    '/podcasts/import': wrap({
      asyncComponent: () => import('./routes/Import.svelte'),
    }),
    '/podcasts/preview': wrap({
      asyncComponent: () => import('./routes/PodcastPreview.svelte'),
    }),
    '/podcasts/:podcastId': wrap({
      asyncComponent: () => import('./routes/PodcastDetail.svelte'),
    }),
    '/episodes/filter/:filterId': wrap({
      asyncComponent: () => import('./routes/Filter.svelte'),
    }),
    '/episodes/:episodeId': wrap({
      asyncComponent: () => import('./routes/EpisodeDetail.svelte'),
    }),
    '/search': wrap({
      asyncComponent: () => import('./routes/Search.svelte'),
    }),
    '/player': wrap({
      asyncComponent: () => import('./routes/Player.svelte'),
    }),
    '/settings': wrap({
      asyncComponent: () => import('./routes/Settings.svelte'),
    }),
    '/about': wrap({
      asyncComponent: () => import('./routes/About.svelte'),
    }),

    // '/podcasts': Podcasts,
    // '/podcasts/import': Import,
    // '/podcasts/preview': PodcastPreview,
    // '/podcasts/:podcastId': PodcastDetail,
    // '/episodes/filter/:filterId': Filter,
    // '/episodes/:episodeId': EpisodeDetail,
    // '/search': Search,
    // '/player': Player,
    // '/settings': Settings,
    // '/about': About,
  };
</script>

<Router {routes} />
<AudioPlayer />
