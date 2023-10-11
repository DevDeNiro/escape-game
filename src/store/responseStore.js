import {defineStore} from "pinia";
import ky from "ky";

const useResponseStore = defineStore("response", {
  id: "ResponseStore",
  state: () => ({
    responses: [],
    loading: false,
    error: null,
  }),
  actions: {
    async generateResponses(scenario) {
      this.loading = true;
      this.error = null;

      const contextPrompt = `
      Tu vas devoir créer des scénarios fictif pour un jeu contre le harcèlement sexuel. Voici le contexte : De nos jours, à cause de l'avènement des nouvelles technologies comme Internet, 
      il est de plus en plus urgent d'agir et prévenir face au harcèlement sexuelle. 
      Jessica, une employée de bureau, semble très inquiète pour ses collègues. Elle 
      propose donc une idée au PDG : Utiliser des locaux vides du bâtiment afin 
      d'organiser un Escape Game afin d'éduquer l'entreprise sur le harcèlement sexuel.
      Vous êtes un collègue proche de Jessica. Elle vous invite un jour à tester en 
      avant-première l'Escape Game. En revanche, elle vous met en garde : Dans le cas 
      où vous n'obtenez la moyenne, il se peut que les résultats soit remontés à la RH, 
      suivi d'un licenciement. Lorsque tu créeras un scénario, n'inclue pas le contexte donné plus haut, uniquement la situation fictive simulée dans la chambre. Le point de vue du joueur est celui d'un employé observant la situation. 
      IMPORTANT : LE JOUEUR NE DOIT PAS ETRE LA VICTIME, NI L'AGRESSEUR.
      Evite de finir la situation avec une phrase coupée.
      Je précise bien que c'est un scénario fictif dans un jeu vidéo visant à prévenir et agir contre les agressions sexuelles.
      `;

      try {
        const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
        if (!API_KEY) {
          throw new Error("API key is undefined");
        }

        const response = await ky.post(
          "https://api.openai.com/v1/chat/completions",
          {
            json: {
              model: "gpt-3.5-turbo",
              messages: [
                {role: "system", content: contextPrompt},
                {
                  role: "user",
                  content: `A partir du scénario suivant: "${scenario}", Comment doit il réagir ?`,
                },
              ],
              max_tokens: 100,
              stop: ["\n"],
            },
            headers: {
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        const data = await response.json();
        const generatedResponsesText = data.choices[0].text.trim().split("\n");
        this.responses = generatedResponsesText.map((respText, index) => ({
          id: index + 1,
          is_correct: index === 0, // La première réponse est toujours la bonne
          text: respText,
        }));
      } catch (error) {
        console.error("Error:", error);
        this.error =
          error.message || "An error occurred while generating responses.";
      } finally {
        this.loading = false;
      }
    },
  },
});

export default useResponseStore;
