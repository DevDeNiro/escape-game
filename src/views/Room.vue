<template>
  <div class="room" v-if="room">
    <div
      class="background"
      :style="{
        backgroundImage: `url(${
          room.situations?.[0] ? imgFolder + room.situations[0].background : ''
        })`,
      }"
    >
      <img
        :src="room.situations?.[0] ? imgFolder + room.situations[0].sprite : ''"
        alt="sprite"
        class="sprite"
      />
    </div>

    <DialogBox
      :message="currentMessage"
      @next="handleNext"
      v-if="showDialog"
      :dialogues="roomDialogues"
    />
    <QuestionBox
      :situation="currentSituation"
      @answer="handleAnswer"
      v-else-if="showQuestion"
    />
  </div>
</template>

<script>
import {ref, onMounted, computed} from "vue";
import DialogBox from "@/components/DialogBox.vue";
import QuestionBox from "@/components/QuestionBox.vue";
import jsonData from "@/data/index.json";
import dialogues from "@/data/dialogues.json";

export default {
  components: {
    DialogBox,
    QuestionBox,
  },
  setup() {
    const room = ref({});
    const roomIndex = ref(0);
    const showQuestion = ref(false);
    const showDialog = ref(true);
    const currentMessage = ref("Chargement...");
    const currentSituation = ref(null);
    const imgFolder = ref("");
    const roomDialogues = computed(() => {
      return dialogues["welcome"];
    });

    // `url(${room.situations[0].background ? room.situations[0].background : ''})`

    onMounted(() => {
      console.log("api key", import.meta.env.OPENAI_API_KEY);
      try {
        room.value = jsonData.rooms[roomIndex.value];
        imgFolder.value = jsonData.imagesFolder;
        currentSituation.value = room.value.situations[0];
        console.log("room:", room.value);
        currentMessage.value = "Bienvenue dans cette room !";
      } catch (err) {
        console.error("Erreur lors de la manipulation des données:", err);
        currentMessage.value = "Erreur lors de la manipulation des données.";
      }
    });

    const handleNext = () => {
      showDialog.value = false;
      showQuestion.value = true;
    };

    const handleAnswer = (isCorrect) => {
      if (isCorrect) {
        currentMessage.value = "Correct ! Passons à la situation suivante.";
      } else {
        currentMessage.value = "Incorrect. Réessayez.";
      }
      showQuestion.value = false;
      showDialog.value = true;
    };

    return {
      room,
      imgFolder,
      roomDialogues,
      currentMessage,
      currentSituation,
      showDialog,
      showQuestion,
      handleNext,
      handleAnswer,
    };
  },
};
</script>

<style scoped>
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.sprite {
  position: absolute;
  width: 150px;
  height: 150px;
}
</style>
