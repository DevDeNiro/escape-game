<template>
	<div class="room flex justify-center items-center min-h-screen bg-blue-200">
		<Box v-if="currentDialogue" classes="absolute bottom-[5%]">
			<h2
				class="text-xl font-bold w-fit bg-black text-white rounded-full py-1 px-3 absolute left-5 -translate-y-1/2 top-0"
			>
				{{ currentDialogue.speaker }}
			</h2>
			<p class="text-md mt-2.5 min-h-[50px]">{{ displayedText }}</p>
			<ButtonComponent :action="advanceDialogue" classes="self-end mt-5">
				Suivant
			</ButtonComponent>
		</Box>
	</div>
</template>

<script>
import {ref, computed, onMounted, onUnmounted} from "vue";
import ButtonComponent from "./Button.vue";
import Box from "./Box.vue";

export default {
	components: {
		ButtonComponent,
		Box,
	},
	props: {
		dialogues: Array,
		noMoreDialogAction: Function,
	},
	setup(props, _) {
		const currentIndex = ref(0);
		const displayLength = ref(1);
		const maxDisplayLength = 5; // A augmenter pour un effet de machine à écrire plus rapide

		let interval;

		const advanceDialogue = () => {
			clearInterval(interval);
			// Si le message n'est pas encore entièrement affiché, on l'affiche en entier
			if (
				displayLength.value < props.dialogues[currentIndex.value].message.length
			) {
				interval = setInterval(() => {
					displayLength.value = Math.min(
						displayLength.value + maxDisplayLength,
						props.dialogues[currentIndex.value].message.length
					);

					if (
						displayLength.value >=
						props.dialogues[currentIndex.value].message.length
					) {
						clearInterval(interval);
					}
				}, 50);
				// Sinon, si on est au dernier message, on ne fait rien
			} else if (currentIndex.value < props.dialogues.length - 1) {
				currentIndex.value++;
				displayLength.value = 1;
				_.emit("getId", currentIndex.value)
				// Appel récursif pour passer au message suivant
				advanceDialogue();
			} else {
				props.noMoreDialogAction();
			}
		};

		onMounted(() => {
			advanceDialogue();
		});

		onUnmounted(() => {
			clearInterval(interval);
		});

		const currentDialogue = computed(() => props.dialogues[currentIndex.value]);

		const displayedText = computed(() =>
			currentDialogue.value.message.substring(0, displayLength.value)
		);

		return {currentDialogue, displayedText, advanceDialogue};
	},
};
</script>

<style scoped></style>
