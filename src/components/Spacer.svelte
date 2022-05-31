<script lang="ts">
    import { convertSize, Size } from "../utils/style";

    export let width: Size = 0;
    export let height: Size = 0;
    export let flex: number = 0;

    $: style = `
        width: ${convertSize(width)};
        height: ${convertSize(height)};
        flex: ${flex};
    `;
</script>

<div {style} />
