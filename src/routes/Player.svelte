<script lang="ts">
  import { formatTime } from 'foxcasts-core/lib/utils';
  import { pause, play, skip } from '../components/AudioPlayer.svelte';
  import { onKeyPress } from '../hooks/onKeyPress';
  import { KaiOS } from '../services/kaios';
  import { player } from '../stores/player';
  import { settings } from '../stores/settings';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  onKeyPress({
    ArrowLeft: () => skip(-$settings.playbackSkipBack),
    ArrowRight: () => skip($settings.playbackSkipForward),
    ArrowUp: () => KaiOS.system.volumeUp(),
    ArrowDown: () => KaiOS.system.volumeDown(),
    Enter: () => ($player.playing ? pause() : play()),
  });
</script>

<View headerText="Player" centerText={$player.playing ? 'Pause' : 'Play'}>
  {#if $player.episode}
    <div class="player">
      <Typography type="title" padding="horizontal" align="center"
        >{$player.episode.title}</Typography
      >
      <Typography padding="horizontal" align="center">{$player.episode.podcastTitle}</Typography>
      <Typography type="bodyLarge" align="center"
        >{`${formatTime($player.currentTime)} / ${formatTime($player.duration || 0)}`}</Typography
      >
    </div>
  {:else}
    <Typography>Nothing playing</Typography>
  {/if}
</View>

<style>
  .player {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
