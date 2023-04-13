import { defineStore } from "pinia";

export const usePredictStore = defineStore("predict-store", () => {
  const boxes = ref<null | PredictData[]>(null);
  const loading = ref(false);

  const fetchPredictData = async (formData: FormData) => {
    loading.value = true;
    const { data } = await useFetch("https://vktrpnzrv.fvds.ru/predict", {
      method: "post",
      body: formData,
    });

    boxes.value = data.value as PredictData[];
    loading.value = false;
  };

  const changeBoxes = (newBoxes: PredictData[] | null) => {
    boxes.value = newBoxes;
  };

  return { loading, boxes, fetchPredictData, changeBoxes };
});
