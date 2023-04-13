<template>
  <div
    ref="divRef"
    class="boxes"
    :style="`
      left: ${box.xmin * 100}%;
      top: ${box.ymin * 100}%;
      width: ${(box.xmax - box.xmin) * 100}%;
      height: ${(box.ymax - box.ymin) * 100}%
    `"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  box: {
    type: Object as () => Box,
    default: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 },
  },
  imageSize: {
    type: Object as () => ImageSize,
    default: { width: 0, height: 0 },
  },
});

const box = reactive(props.box);

const divRef = ref();
let pointerId: number | null = null;
let offset = { x: 0, y: 0 };

const updateBox = (x: number, y: number) => {
  box.xmin += x;
  box.xmax += x;
  box.ymin += y;
  box.ymax += y;
};

const onStart = (event: PointerEvent) => {
  pointerId = event.pointerId;
  offset = { x: event.x, y: event.y };

  const onMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    const { width, height } = props.imageSize;

    const x = event.x - offset.x;
    const y = event.y - offset.y;

    offset = { x: event.x, y: event.y };

    updateBox(x / width, y / height);
  };

  const onEnd = () => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onEnd);
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerup", onEnd, { passive: true });
};

onMounted(() => {
  divRef.value.addEventListener("pointerdown", onStart, {
    passive: true,
  });
});

onBeforeUnmount(() => {
  divRef.value.removeEventListener("pointerdown", onStart);
});
</script>

<style>
.boxes {
  position: absolute;
  border: 2px dashed red;
  cursor: grab;
  touch-action: none;
}
</style>
