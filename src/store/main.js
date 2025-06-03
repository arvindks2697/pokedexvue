import { defineStore } from "pinia";
export const usePokeStore = defineStore("pokedata", {
  state: () => ({
    pokemon: [],
    searchKey: "",
  }),
  getters: {
    pokemonData: (state) => (key) =>
      key !== ""
        ? state.pokemon.filter((a) => a.indexOf(key) > -1)
        : state.pokemon,
  },
  actions: {
    setPokemonData(data) {
      this.pokemon = data;
    },
    setSearchKey(data) {
      // if (data == "") this.filteredPokemon = null;
      // else
      this.searchKey = data;
    },
    getFilteredPokemon() {
      if (this.searchKey == "") return this.pokemon;
      return this.pokemon.filter((a) => a.name.indexOf(this.searchKey) > -1);
    },
  },
});
