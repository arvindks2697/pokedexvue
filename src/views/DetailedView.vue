<script setup>
import { useRoute } from "vue-router";
import router from "../router";
import { onMounted, reactive } from "vue";
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
      .then((res) => res.data),
  ]);
  data.pokemon = pokemon;
  data.species = pokemonSpecies;
  console.log(data);
  id = newId;
};

onMounted(() => fetchPokemonData(pid));

function generateGradient(color1, color2, direction = "to right") {
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
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

const pokemonName = (name) => {
  let result = name.replace("_", " ").replace("-", " ");
  return result.slice(0, 1).toUpperCase() + result.slice(1, result.length);
};

const getIdFromUrl = (url) => {
  console.log({ url: url.split("/") });
  return url.split("/")[6];
};
</script>
<template>
  <main
    class="detail-main"
    :style="`background-color: ${data.species.color?.name}`"
  >
    <!-- <div class="text-1xl">View All</div> -->
    <img src="../assets/poke.png" alt="back" class="backgroung-img-poke" />
    <div
      class="header grid grid-cols-3 gap-3 text-center w-100 text-2xl my-5 justify-items-center"
    >
      <div v-if="id - 1 > 0" @click="() => switchPokemon('prev')" class="">
        <
      </div>
      <header class="">{{ pokemonName(data.pokemon.name ?? "") }}</header>
      <div v-if="id < 10000" @click="() => switchPokemon('next')" class="">
        >
      </div>
    </div>
    <div class="flex flex-col gap-4 img-show-case">
      <div class="img-wrapper">
        <img
          :src="`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`"
          alt="rattata"
          class="mb-5"
        />
      </div>
    </div>
    <div class="pokemon-detail text-center">
      <div class="type-wrapper">
        <ul class="flex flex-wrap gap-4 justify-center mb-5">
          <li v-for="a in data.pokemon.types">
            <!-- {{ pokemonName(a.type.name) }} -->
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
      <div class="description my-4 text-justify">
        {{
          data.species?.flavor_text_entries?.length > 0
            ? data.species?.flavor_text_entries[0]?.flavor_text?.replace(
                "",
                " "
              )
            : "No Description Found"
        }}
      </div>
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
                {{ pokemonName(a.move.name)?.replace("-", " ") }}
              </li>
            </ul>
          </div>
        </div>
        <div class="stats-wrapper text-left">
          <div v-for="stat in data.pokemon.stats" class="mb-2">
            <div class="mb-1">{{ stat.stat?.name }}</div>
            <div
              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden"
            >
              <div
                class="bg-blue-600 h-2.5 rounded-full"
                :style="`width: ${stat.base_stat}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
