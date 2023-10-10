<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-8"
  >
    <p class="text-4xl bg-red-300">Bienvenue dans l'Escape Room !</p>
    <p class="w-[700px] mx-auto text-justify">
      L'expérience que vous vous apprêtez à expérimenter est à prendre au
      sérieux. Ici, vous apprendrez à identifier et gérer le harcèlement au
      travail. Nous vous présenterons plusieurs situations qu'on peut retrouver
      dans le monde professionnel et vous devrez y répondre en choisissant la
      meilleure réponse selon vous.
    </p>
    <ButtonComponent :action="goToRoom"> Commencer </ButtonComponent>
  </div>
</template>

<script>
import {ref} from "vue";
import {useRouter} from "vue-router";
import ButtonComponent from "@/components/Button.vue";
import {useStore} from "@/store/index.js";

export default {
  name: "Home",
  components: {
    ButtonComponent,
  },
  setup() {
    const msg = ref("Bienvenue dans l'Escape Room !");
    const router = useRouter();
    const store = useStore();

    const {text} = store;

    const goToRoom = () => {
      router.push("/room");
    };

    return {msg, goToRoom, text};
  },
};
</script>
