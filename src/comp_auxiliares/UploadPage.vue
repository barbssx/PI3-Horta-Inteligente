<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Registros da Composteira</h2>
    <table class="table-auto w-full text-left border">
      <thead>
        <tr>
          <th class="px-2">T_Comp</th>
          <th class="px-2">T_Amb</th>
          <th class="px-2">U_Amb</th>
          <th class="px-2">Tensão</th>
          <th class="px-2">Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reg, index) in registros" :key="index">
          <td class="px-2">{{ reg.t_comp }}</td>
          <td class="px-2">{{ reg.t_amb }}</td>
          <td class="px-2">{{ reg.u_amb }}</td>
          <td class="px-2">{{ reg.tensao }}</td>
          <td class="px-2">{{ reg.dataHora }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getRegistros } from '@/services/uploadService';

export default {
  data() {
    return {
      registros: [],
    };
  },
  async mounted() {
    this.registros = await getRegistros();
  },
};
</script>
