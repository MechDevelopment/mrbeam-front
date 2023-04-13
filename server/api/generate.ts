import generate from "../src/generate";

export default defineEventHandler(() => {
  return JSON.stringify(generate(), null, 4);
});
