import {defineStore} from "pinia";
import ky from "ky";

export const useStore = defineStore({
  id: "mainStore",

  state: () => ({
    responses: [],
    generatedQuestion: "",
    loading: false,
    error: null,
  }),

  actions: {
    async generateQuestion(promptText) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: use an intermediate server to hide the API key
        const API_KEY = import.meta.env.OPENAI_API_KEY;

        const response = await ky.post(
          "https://api.openai.com/v1/engines/davinci-codex/completions",
          {
            json: {
              prompt: promptText,
              max_tokens: 100,
            },
            headers: {
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        this.generatedQuestion = data.choices[0].text.trim();
      } catch (error) {
        console.error("Error:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    setResponses(responses) {
      this.responses = responses;
    },
  },
});
