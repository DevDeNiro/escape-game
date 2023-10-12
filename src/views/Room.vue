<template>
	<div class="room" v-if="currentRoom">
		<div class="background"
			 :style="{
				backgroundImage: `url(${currentSituation ? imgFolder + currentSituation.background : ''})`
			 }"
		>
			<img
					:src="currentSituation ? imgFolder + sprite : ''"
					alt="sprite"
					class="sprite"
					v-if="showDialog"
			/>
		</div>
		<DialogBox
				@next="handleNext"
				@get-id="handleChangeSprite"
				v-if="showDialog"
				:dialogues="currentRoom.dialog"
				:no-more-dialog-action="noMoreDialogAction" />
		<QuestionBox
				:theme="currentRoom.theme"
				:situation="currentSituation"
				:has-no-more-situation="hasNoMoreSituation"
				@next-room="nextRoom"
				:room-answers="roomAnswers"
				v-else
		>
			<Answers
					:situation="currentSituation"
					@answer="handleAnswer"
			/>
		</QuestionBox>
	</div>
</template>

<script>
import {ref, onMounted, computed} from "vue";
import DialogBox from "@/components/DialogBox.vue";
import QuestionBox from "@/components/QuestionBox.vue";
import useRoomStore from "@/store/roomStore.js";
import jsonData from "@/data/index.json";
import {useRoute, useRouter} from "vue-router";
import Answers from "@/components/Answers.vue";

export default {
	components: {
		Answers,
		DialogBox,
		QuestionBox,
	},
	setup() {
		const {currentRoomId, currentRoom, addAnswer, userAnswers, setCurrentRoomId} = useRoomStore()
		const route = useRoute();
		const router = useRouter();
		const paramId = route.params.id;
		const showDialog = ref(true);
		const imgFolder = ref("")
		const currentSituationId = ref(0);

		const currentSituation = computed(() => {
			return currentRoom(paramId).situations[currentSituationId.value];
		});

		const sprite = ref("");

		const roomAnswers = computed(() => {
			return userAnswers.filter((answer) => Number(answer.roomId) === Number(currentRoomId));
		})
		const hasNoMoreSituation =  computed(() => {
			return roomAnswers.value.length >= currentRoom(currentRoomId).situations.length;
		});

		onMounted(() => {
			try {
				imgFolder.value = jsonData.imagesFolder;
				sprite.value = currentSituation.value.sprite
			} catch (err) {
				console.error("Erreur lors de la manipulation des données:", err);
			}
		});

		const handleNext = () => {
			showDialog.value = false;
		};

		const handleAnswer = (index) => {
			console.log("index de la réponse cliquée", index, currentSituation.value.responses[index - 1])
			if (!hasNoMoreSituation.value) {
				addAnswer({
					roomId: currentRoomId,
					situationId: currentSituation.value.id,
					answerId: index - 1,
					isCorrect: currentSituation.value.responses[index - 1].is_correct,
				})
				console.log(currentRoomId, currentRoom(paramId).situations.length)
				currentSituationId.value++;
			}
		};

		const handleChangeSprite = (index) => {
			console.log(index + 1)
			switch (Number(index) + 1) {
				case 3:
					sprite.value = "/sprites/serieux.png";
					break;
				case 4:
					sprite.value = "/sprites/wink.png";
					break;
				case 6:
				case 7:
					sprite.value = "/sprites/colere.png";
					break;
				case 8:
					sprite.value = "/sprites/wink.png";
					break;
				default:
					sprite.value = currentSituation.value.sprite
			}
		}

		const nextRoom = () => {
			setCurrentRoomId(Number(paramId) + 1)
			console.log("test goToNextSituation() nextRoom")
			currentSituationId.value = 0;
			const nextId = Number(paramId) + 1
			router.push("/room/" + nextId)
		};

		const noMoreDialogAction = () => {
			showDialog.value = false;
		};

		return {
			imgFolder,
			currentRoom: currentRoom(paramId),
			roomAnswers,
			currentSituation,
			sprite,
			hasNoMoreSituation,
			showDialog,
			nextRoom,
			handleNext,
			handleAnswer,
			noMoreDialogAction,
			handleChangeSprite
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
	height: 300px;
	bottom: 150px;
	left: 50%;
	transform: translateX(-50%);
}
</style>
