<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-btn
          class="q-mx-xs"
          @click="toggleDrawer"
          v-if="$q.screen.lt.sm"
          icon="menu"
          round
          dense
          color="primary"
        />
        <q-toolbar-title>
          Customer Project LSApp
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" :width="250" show-if-above>
      <q-list>
        <q-item to="/" exact>
          <q-item-section>
            Home
          </q-item-section>
        </q-item>
        <q-item to="/customers">
          <q-item-section>
            Customers
          </q-item-section>
        </q-item>
        <q-item to="/projects">
          <q-item-section>
            Projects
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  <q-footer elevated class="bg-grey-8 text-white">
  <q-toolbar>
    <q-toolbar-title>
      &copy; {{ new Date().getFullYear() }} Customer Project LSApp
    </q-toolbar-title>
    <q-btn flat href="mailto:stevekioko866@gmail.com" target="_blank" icon="email">
      stevekioko866@gmail.com
    </q-btn>
  </q-toolbar>
</q-footer>
</q-layout>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(false);


const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>

<style scoped>
.q-header {
  z-index: 1;
}
</style>


