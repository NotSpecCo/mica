<script lang="ts">
  import { DisplayType, TextSize } from '../models';
  import { settings, updateSetting } from '../stores/settings';
  import InlineRange from '../ui-components/InlineRange.svelte';
  import InlineSelect from '../ui-components/InlineSelect.svelte';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';
</script>

<View headerText="Settings">
  <Typography type="titleSmall">Appearance</Typography>
  <InlineRange
    label="Warmth"
    value={$settings.warmth}
    min={0}
    max={20}
    increment={1}
    selectable={{
      id: 'warmth',
    }}
    onChange={(val) => updateSetting('warmth', val)}
  />
  <InlineSelect
    label="Text size"
    value={$settings.textSize}
    options={[
      { id: TextSize.Smallest, label: 'Smallest' },
      { id: TextSize.Small, label: 'Small' },
      { id: TextSize.Medium, label: 'Medium' },
      { id: TextSize.Large, label: 'Large' },
      { id: TextSize.Largest, label: 'Largest' },
    ]}
    selectable={{
      id: 'textSize',
    }}
    onChange={(id) => updateSetting('textSize', id)}
  />
  <InlineSelect
    label="Header"
    value={$settings.headerDisplay}
    options={[
      { id: DisplayType.Normal, label: 'Normal' },
      { id: DisplayType.Compact, label: 'Compact' },
      { id: DisplayType.Hidden, label: 'Hidden' },
    ]}
    selectable={{
      id: 'headerDisplay',
    }}
    onChange={(id) => updateSetting('headerDisplay', id)}
  />
  <InlineSelect
    label="Footer"
    value={$settings.footerDisplay}
    options={[
      { id: DisplayType.Normal, label: 'Normal' },
      { id: DisplayType.Compact, label: 'Compact' },
      { id: DisplayType.Hidden, label: 'Hidden' },
    ]}
    selectable={{
      id: 'footerDisplay',
    }}
    onChange={(id) => updateSetting('footerDisplay', id)}
  />
  <Typography type="titleSmall">Player</Typography>
  <InlineRange
    label="Speed"
    valueLabel=" x"
    value={$settings.playbackSpeed}
    min={0.6}
    max={4}
    increment={0.1}
    selectable={{
      id: 'playbackSpeed',
    }}
    onChange={(val) => updateSetting('playbackSpeed', val)}
  />
  <InlineRange
    label="Skip back"
    valueLabel="s"
    value={$settings.playbackSkipBack}
    min={1}
    max={120}
    increment={1}
    selectable={{
      id: 'playbackSkipBack',
    }}
    onChange={(val) => updateSetting('playbackSkipBack', val)}
  />
  <InlineRange
    label="Skip forward"
    valueLabel="s"
    value={$settings.playbackSkipForward}
    min={1}
    max={120}
    increment={1}
    selectable={{
      id: 'playbackSkipForward',
    }}
    onChange={(val) => updateSetting('playbackSkipForward', val)}
  />
</View>

<style>
</style>
