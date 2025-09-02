<script setup>
import { useRoute } from "vue-router";
import router from "../router";
import { capitalize, computed, onMounted, reactive } from "vue";
import axios from "axios";

const route = useRoute();
let pid = route.params.id;
let id = pid;
const data = reactive({ pokemon: {}, species: {} });
const fetchPokemonData = async (newId) => {
  const [pokemon, pokemonSpecies] = await Promise.all([
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${newId}`)
      .then((res) => res.data),
    axios
      .get(`https://pokeapi.co/api/v2/pokemon-species/${newId}`)
      .then((res) => res.data)
      .catch((err) => console.log("ERROR")),
  ]);
  data.pokemon = pokemon;
  if (pokemonSpecies) {
    data.species = pokemonSpecies;
  } else {
    axios
      .get(`${data.pokemon.species.url}`)
      .then((res) => {
        data.species = res.data;
      })
      .catch((err) => console.log("ERROR"));
  }
  console.log(data);
  id = newId;
};

onMounted(() => fetchPokemonData(pid));

// function generateGradient(color1, color2, direction = "to right") {
//   return `linear-gradient(${direction}, ${color1}, ${color2})`;
// }

function toPastelColor(inputColor) {
  // Create a temporary element to parse the input color
  const temp = document.createElement("div");
  temp.style.color = inputColor;
  document.body.appendChild(temp);

  // Get computed color in RGB
  const computedColor = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const rgb = computedColor.match(/\d+/g).map(Number);

  // Blend with white to get a pastel color
  const pastelRGB = rgb.map((channel) => Math.round((channel + 255) / 2));

  return `rgb(${pastelRGB.join(", ")})`;
}

function switchPokemon(type) {
  let cId = undefined;
  if (type == "prev") cId = parseInt(id) - 1;
  else if (type == "next" && parseInt(id) + 1 < 10000) {
    cId = parseInt(id) + 1;
  }
  if (cId) {
    router.push(`/pokemon/${cId}`);
    fetchPokemonData(cId);
  } else router.push("/");
}

const CapitalizeFirstLetter = (name) => {
  let result = name.replace("_", " ").replace("-", " ");
  return result.slice(0, 1).toUpperCase() + result.slice(1, result.length);
};

const getIdFromUrl = (url) => {
  console.log({ url: url.split("/") });
  return url.split("/")[6];
};

const bgColor = computed(() =>
  toPastelColor(data.species.color?.name ?? "red")
);

const getDescription = computed(() => {
  let str = "";
  if (data.species?.flavor_text_entries?.length > 0) {
    str = CapitalizeFirstLetter(
      data.species?.flavor_text_entries[0]?.flavor_text
        ?.replace("", " ")
        ?.toLocaleLowerCase()
    );
  } else str = "No Description Found";
  return str;
});
</script>
<template>
  <main class="detail-main" :style="`background-color: ${bgColor}`">
    <div class="w-100 absolute left-5 top-6">
      <div class="search-container">
        <a href="/" class="w-full flex justify-start mx-auto items-center">
          <div class="w-7">
            <img src="../assets/pokeball.svg" alt="" class="src mt-[0.4rem]" />
          </div>
          <div class="text-white text-4xl">Pokédex</div></a
        >
      </div>
    </div>
    <img src="../assets/poke.png" alt="back" class="backgroung-img-poke" />
    <div
      class="header grid grid-cols-3 gap-3 text-center w-100 text-2xl my-5 justify-items-center"
    >
      <div
        v-if="id - 1 > 0"
        @click="() => switchPokemon('prev')"
        class="col-start-1"
      >
        <
      </div>
      <header class="col-start-2">
        {{ CapitalizeFirstLetter(data.pokemon.name ?? "") }}
      </header>
      <div
        v-if="id < 10000"
        @click="() => switchPokemon('next')"
        class="col-start-3"
      >
        >
      </div>
    </div>
    <div class="flex flex-col gap-4 img-show-case">
      <div class="img-wrapper">
        <img
          :src="`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`"
          :alt="`pokemon-id-#${id}`"
          class="mb-5"
        />
      </div>
    </div>
    <div class="pokemon-detail text-center">
      <div class="type-wrapper">
        <ul class="flex flex-wrap gap-4 justify-center mb-5">
          <li v-for="a in data.pokemon.types">
            <!-- {{ CapitalizeFirstLetter(a.type.name) }} -->
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${getIdFromUrl(
                a.type.url
              )}.png`"
              :alt="a.type.name"
              class="type-label"
            />
          </li>
        </ul>
      </div>
      <p>About</p>
      <div class="description my-4 text-justify">{{ getDescription }}</div>
      <div class="pokemon-detail-wrapper">
        <div
          class="info-wrapper grid grid-cols-2 gap-4 align-middle justify-center"
        >
          <div class="grid grid-cols-1 info-item self-center">
            Weight: {{ data.pokemon.weight }} <br />
            Height: {{ data.pokemon.height }}
          </div>
          <!-- <div class="grid grid-cols-1 info-item">
            <div class="">Height</div>
          </div> -->
          <div class="grid grid-cols-1 info-item">
            <div>Moves :</div>
            <ul>
              <li v-for="a in data.pokemon.moves?.slice(0, 4)">
                {{ CapitalizeFirstLetter(a.move.name)?.replace("-", " ") }}
              </li>
            </ul>
          </div>
        </div>
        <div class="stats-wrapper text-left">
          <div v-for="stat in data.pokemon.stats" class="mb-2">
            <div class="mb-1">
              {{ CapitalizeFirstLetter(stat.stat?.name) }} :
              {{ stat.base_stat }}
            </div>
            <div
              class="w-full bg-gray-200 h-2.5 dark:bg-gray-700 overflow-hidden rounded-full box-shadow"
            >
              <div
                :class="`h-2.5`"
                :style="`width: ${stat.base_stat}%; background-color:${bgColor}`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
