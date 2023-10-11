<template>
  <div class="room flex justify-center items-center min-h-screen bg-blue-200">
    <Box>
      <template v-if="hasNoMoreSituation">
        <p>Plus de situations</p>
        <div class="flex items-center gap-3">
          <ButtonComponent classes="flex-1 h-full" :action="onNextRoom">
            Room suivante
          </ButtonComponent>
          <ButtonComponent classes="flex-1 h-full" :is-secondary="true">
            Voir les résultats
          </ButtonComponent>
        </div>
      </template>
      <template v-else>
        <h2
          class="text-lg font-bold w-fit bg-black text-white rounded-full py-1 px-3 mx-auto"
        >
          {{ theme }}
        </h2>
        <p class="text-center">
          {{ situation.scenario }} {{ hasNoMoreSituation ? "No More" : "More" }}
        </p>
        <ul class="grid grid-cols-2 gap-3">
          <li
            v-for="(response, index) in situation.responses.sort(() =>
              Math.random() > 0.5 ? 1 : -1
            )"
            :key="index"
            class="h-full"
          >
            <ButtonComponent
              :classes="buttonClass(index) + ' w-full h-full'"
              :action="() => $emit('answer', response.id)"
            >
              {{ response.text }}
            </ButtonComponent>
          </li>
        </ul>
      </template>
    </Box>
  </div>

</template>

<script>
import {computed, ref} from "vue";
import Box from "./Box.vue";
import ButtonComponent from "./Button.vue";
import useRoomStore from "@/store/roomStore.js";
import Answers from "@/components/Answers.vue";
import ResultDisplay from "@/components/ResultDisplay.vue";

export default {
  components: {Box, ButtonComponent},
  props: {
    situation: Object,
    theme: String,
    hasNoMoreSituation: Boolean,
    onNextRoom: Function,
  },
  setup(props) {
    const selectedAnswerIndex = ref(null); // pour stocker l'index de la réponse sélectionnée
    const wasAnswerCorrect = ref(false); // pour stocker si la réponse sélectionnée est correcte ou non
    const {currentRoomId, addAnswer} = useRoomStore();

    const handleClick = (isCorrect, index) => {
      selectedAnswerIndex.value = index;
      wasAnswerCorrect.value = isCorrect;
      addAnswer({
        room: currentRoomId.value,
        situation: props.situation.id,
        answer: index,
      });
    };

    const buttonClass = (index) => {
      if (index !== selectedAnswerIndex.value) return "";
      return wasAnswerCorrect.value ? "bg-green-500" : "bg-red-500";
    };

    return {
      handleClick,
      buttonClass,
    };
  },

};
</script>

<style scoped></style>