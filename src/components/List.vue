<script setup>
import { watch, onMounted, ref, reactive } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { usePokeStore } from "../store/main";
import router from "../router";
const store = usePokeStore();
const { pokemon } = storeToRefs(store);
const data = reactive({ pokemon: [] });
watch(
  () => store.searchKey,
  (newValue) => {
    let searchValue = newValue.trim().toLocaleLowerCase();
    if (searchValue == "") data.pokemon = pokemon.value;
    data.pokemon = getFilteredPokemon(searchValue);
  }
);

const fetchAllPokemonStore = async () => {
  await axios
    .get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
    .then((res) => res?.data?.results ?? [])
    .then((a) => {
      store.pokemon = a;
      data.pokemon = a;
    })
    .catch((err) => console.error({ err }));
};

onMounted(fetchAllPokemonStore);

const pokemonId = (url) => {
  return url.split("/")[6];
};

const pokemonName = (name) => {
  let result = name.replace("_", " ").replace("-", " ");
  return result.slice(0, 1).toUpperCase() + result.slice(1, result.length);
};

function getFilteredPokemon(key) {
  return pokemon.value.filter((a) => a.name.indexOf(key) > -1);
}

function loadPokemon(id) {
  router.push(`/pokemon/${id}`);
}
</script>
<template>
  <section class="pokemon-list">
    <ul
      v-if="data.pokemon.length > 0"
      class="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 items-center justify-center text-center"
    >
      <li
        v-for="pokemon in data.pokemon"
        class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
        @click="loadPokemon(pokemonId(pokemon.url))"
      >
        <img
          :src="`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId(
            pokemon.url
          )}.png`"
          :alt="pokemon.name"
        />
        {{ pokemonName(pokemon.name) ?? "No Name" }}
        <span class="pokeId">#{{ pokemonId(pokemon.url) }}</span>
      </li>
    </ul>
    <div v-else id="not-found-message">Pokemon not found</div>
  </section>
</template>
