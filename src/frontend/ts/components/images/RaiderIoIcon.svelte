<script lang="ts">
  export let size: string
  export let border: string = "0"

  const actualSize = parseInt(size) + (parseInt(border) * 2)
</script>

<img src="https://img.wowthing.org/misc/raider_io.svg" width="{actualSize}" height="{actualSize}" alt="RaiderIO icon" loading="lazy">
