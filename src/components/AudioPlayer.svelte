<script context="module" lang="ts">
  import { PlaybackStatus } from 'foxcasts-core/lib/enums';
  import throttle from 'lodash.throttle';
  import type { PlaybackProgress } from '../models/PlaybackProgress';
  import { Core } from '../services/core';
  import { player } from '../stores/player';
  import { clamp } from '../utils';

  let audio = new Audio();
  (audio as any).mozAudioChannelType = 'content';

  audio.onloadedmetadata = () => {
    updateStatus({ duration: audio.duration });
  };

  audio.ontimeupdate = throttle(() => {
    updateStatus({ currentTime: audio.currentTime });
  }, 1000);

  export async function load(episodeId: number, resume = false) {
    const episode = await Core.episodes.get({ id: episodeId });

    audio.src = episode.remoteFileUrl;
    audio.currentTime = resume ? episode.progress : 0;

    player.set({
      episode,
      currentTime: resume ? episode.progress : 0,
      duration: episode.duration || 0,
      playing: true,
    });

    audio.play();
  }

  export function play() {
    audio.play();
    updateStatus({ playing: true });
  }

  export function pause() {
    audio.pause();
    updateStatus({ playing: false });
  }

  export function stop() {
    audio.src = '';
    audio.currentTime = 0;
    player.set({
      episode: undefined,
      playing: false,
      currentTime: 0,
      duration: 0,
    });
  }

  export function skip(seconds: number) {
    const newTime = clamp(audio.currentTime + seconds, 0, audio.duration);
    audio.currentTime = audio.currentTime + seconds;
    updateStatus({ currentTime: newTime });
  }

  function updateStatus(changes: Partial<PlaybackProgress>) {
    player.update((a) => ({
      ...a,
      ...changes,
    }));
  }
</script>

<script lang="ts">
  $: {
    console.log('update episode', $player);
    if ($player.episode) {
      Core.episodes.update($player.episode.id, {
        duration: audio.duration,
        progress: audio.currentTime,
        playbackStatus:
          audio.currentTime > 0 && audio.currentTime === audio.duration
            ? PlaybackStatus.Played
            : PlaybackStatus.InProgress,
      });
    }
  }
</script>
