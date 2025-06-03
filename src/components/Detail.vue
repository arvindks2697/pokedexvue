<script setup>
import axios from "axios";
const fetchPokemonData = async (id) => {
  const [pokemon, pokemonSpecies] = await Promise.all([
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => res.data),
    axios
      .get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
      .then((res) => res.data),
  ]);
  console.log({ pokemon, pokemonSpecies });
};
</script>
<template>
  <main>
    <div class="detail-bg">
      <img src="./assets/pokedex.svg" alt="" />
    </div>
  </main>
</template>
<style>
.detail-bg {
  position: absolute;
  z-index: 1;
  right: 8px;
  top: 8px;
  opacity: 0.1;
}
</style>
