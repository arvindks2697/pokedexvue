<script setup>
import { usePokeStore } from "../store/main";

const store = usePokeStore();

const filterData = (event) => {
  let value = event.target.value.trim();
  store.setSearchKey(value);
};

const clearData = () => {
  store.setSearchKey("");
};
</script>
<template>
  <header class="search-header">
    <div class="search-container flex justify-start mx-auto">
      <div class="logo">
        <img src="../assets/pokeball.svg" alt="" class="src mt-[0.4rem]" />
      </div>
      <div class="logo-title">Pokédex</div>
      <div class="search-bar ml-2 flex">
        <input
          class="shadow appearance-none border-none rounded-full w-100 py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white"
          id="search"
          type="text"
          placeholder="Search By Pokemon Name"
          @change="filterData"
          v-model="store.searchKey"
        />
        <span v-if="store.searchKey !== ''" class="clear" @click="clearData"
          >X</span
        >
      </div>
    </div>
  </header>
</template>
