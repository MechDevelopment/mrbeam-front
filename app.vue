<template>
  <div>
    <form @submit.prevent="submitHandler">
      <label for="file">Choose image to upload</label>
      <input
        type="file"
        id="file"
        accept=".png,.jpg,.jpeg,.webp"
        @change="changeHandler"
        required
      />
      <button type="submit" :disabled="loading">Отправить</button>
    </form>

    <div class="image-container">
      <img :src="image" />
      <div
        class="boxes"
        v-for="box in boxes"
        :key="box.confidence"
        :style="`
          left: ${box.xmin * 100}%;
          top: ${box.ymin * 100}%;
          width: ${(box.xmax - box.xmin) * 100}%;
          height: ${(box.ymax - box.ymin) * 100}%
        `"
      />
    </div>

    <div class="list" v-for="point in points" :key="point.x">
      <span>{{ point.name }}</span> <span>{{ point.x }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const image = ref();
const file = ref();
const boxes = ref();
const loading = ref(false);

const points = computed(() => {
  if (!boxes.value || !boxes.value.length) {
    return [];
  }

  const pointList: Point[] = boxes.value.map((box: PredictData) => ({
    name: box.name,
    x: (box.xmax + box.xmin) / 2,
  }));

  const sortedPoints = pointList.sort((a: Point, b: Point) => a.x - b.x);
  const first = sortedPoints[0].x;
  const last = sortedPoints[sortedPoints.length - 1].x;
  const multiplyier = 1 / (last - first);

  return sortedPoints.map((point: Point) => {
    const normalizedX = (point.x - first) * multiplyier;
    return { ...point, x: Number(normalizedX.toFixed(2)) };
  });
});

const changeHandler = (event: Event) => {
  const files = (<HTMLInputElement>event.target).files;

  if (files?.length) {
    const firstFile = files[0];
    file.value = firstFile;
    boxes.value = null;

    const loadFile = (event: ProgressEvent<FileReader>) => {
      image.value = event.target?.result;
      reader.removeEventListener("load", loadFile);
    };

    const reader = new FileReader();
    reader.addEventListener("load", loadFile);
    reader.readAsDataURL(firstFile);
  }
};

const submitHandler = async () => {
  const formData = new FormData();
  formData.append("file", file.value);

  loading.value = true;
  const { data } = await useFetch("https://vktrpnzrv.fvds.ru/predict", {
    method: "post",
    body: formData,
  });

  loading.value = false;
  boxes.value = data.value as PredictData[];
};
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  max-width: fit-content;
  gap: 20px;
}

.image-container {
  position: relative;
  margin-top: 20px;
  width: fit-content;
}

.boxes {
  position: absolute;
  border: 2px dashed red;
}
</style>
