<template>

  <div class="room" v-if="currentRoom">
    <div
      class="background"
      :style="{
        backgroundImage: `url(${
          currentSituation ? imgFolder + currentSituation.background : ''
        })`,
      }"
    >
      <img
        :src="currentSituation ? imgFolder + currentSituation.sprite : ''"
        alt="sprite"
        class="sprite"
      />
    </div>
    <DialogBox
      :message="currentMessage"
      @next="handleNext"
      v-if="showDialog"
      :dialogues="currentRoom.dialog"
      :no-more-dialog-action="noMoreDialogAction"
    />
    <QuestionBox
      :theme="currentRoom.theme"
      :situation="currentSituation"
      :responses="responses"
      :has-no-more-situation="hasNoMoreSituation"
      @answer="handleAnswer"
      @next-room="nextRoom"
      v-else-if="!showDialog && currentSituation"
    />
    <div v-else-if="loadingQuestions">Loading...</div>
  </div>

</template>

<script>
import {ref, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import DialogBox from "@/components/DialogBox.vue";
import QuestionBox from "@/components/QuestionBox.vue";
import useResponseStore from "@/store/responseStore.js";
import useRoomStore from "@/store/roomStore.js";
import jsonData from "@/data/index.json";

export default {
  components: {
    DialogBox,
    QuestionBox,
  },
  setup() {
    const {
      currentRoomId,
      currentRoom,
      addAnswer,
      userAnswers,
      setCurrentRoomId,
    } = useRoomStore();

    const route = useRoute();
    const router = useRouter();

    const paramId = route.params.id;
    const showDialog = ref(true);
    const currentMessage = ref("Chargement...");
    const imgFolder = ref("");

    const currentSituationId = ref(0);
    const currentSituation = computed(() => {
      return currentRoom(paramId).situations[currentSituationId.value];
    });

    const roomAnswers = computed(() => {
      return userAnswers.filter(
        (answer) => Number(answer.roomId) === Number(currentRoomId)
      );
    });

    const hasNoMoreSituation = computed(() => {
      return (
        roomAnswers.value.length >= currentRoom(currentRoomId).situations.length
      );
    });

    const {responses, generateResponses, loading, error} = useResponseStore();

    onMounted(async () => {
      console.log(currentRoom(paramId).dialog, paramId);
      try {
        imgFolder.value = jsonData.imagesFolder;
        currentMessage.value = "Bienvenue dans cette room !";
        if (currentSituation.value && currentSituation.value.scenario) {
          await generateResponses(currentSituation.value.scenario);
        }
      } catch (err) {
        console.error("Erreur lors de la manipulation des données:", err);
        currentMessage.value = "Erreur lors de la manipulation des données.";
      }
    });

    const handleNext = () => {
      showDialog.value = false;
    };
    const handleAnswer = (index) => {
      if (!hasNoMoreSituation.value) {
        addAnswer({
          roomId: currentRoomId,
          situationId: currentSituation.value.id,
          answerId: index,
        });
        console.log(currentRoomId, currentRoom(paramId).situations.length);

        if (currentSituationId.value < currentRoom.situations.length - 1) {
          currentSituationId.value++;
          if (currentRoom.situations[currentSituationId.value].scenario) {
            generateResponses(
              currentRoom.situations[currentSituationId.value].scenario
            );
          }
        } else {
          console.log("test goToNextSituation() else");
        }
      } else {
        console.log("test goToNextSituation() else");
      }
    };

    const nextRoom = () => {
      setCurrentRoomId(Number(paramId) + 1);
      console.log("test goToNextSituation() nextRoom");
      currentSituationId.value = 0;
      const nextId = Number(paramId) + 1;
      router.push("/room/" + nextId);
    };

    const noMoreDialogAction = () => {
      showDialog.value = false;
    };

    return {
      imgFolder,
      currentRoom: currentRoom(paramId),
      roomAnswers,
      currentMessage,
      currentSituation,
      hasNoMoreSituation,
      showDialog,
      nextRoom,
      handleNext,
      handleAnswer,
      noMoreDialogAction,
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
