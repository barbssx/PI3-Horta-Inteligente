<template>
	<div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
		<UploadRegistro @upload-sucesso="atualizarRegistros" />

		<h2 class="text-2xl font-bold mb-4 mt-8 text-green-700">Registros da Composteira</h2>
		<table class="table-auto w-full text-left border border-gray-300 rounded-md shadow-sm">
			<thead class="bg-green-100 text-green-800 border-b-2 border-green-300">
				<tr>
					<th class="px-6 py-3 text-sm font-semibold">Temperatura Composteira (°C)</th>
					<th class="px-6 py-3 text-sm font-semibold">Temperatura Ambiente (°C)</th>
					<th class="px-6 py-3 text-sm font-semibold">Umidade Ambiente (%)</th>
					<th class="px-6 py-3 text-sm font-semibold">Tensão (V)</th>
					<th class="px-6 py-3 text-sm font-semibold">Data</th>
					<th class="px-6 py-3 text-sm font-semibold">Hora</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(reg, index) in registros" :key="index" class="border-t border-gray-200 hover:bg-green-50 transition-colors">
					<td class="px-6 py-4">{{ reg.t_com }}</td>
					<td class="px-6 py-4">{{ reg.t_amb }}</td>
					<td class="px-6 py-4">{{ reg.u_amb }}</td>
					<td class="px-6 py-4">{{ reg.tensao }}</td>
					<td class="px-6 py-4">{{ reg.data_hora }}</td>
					<td class="px-6 py-4">{{ reg.Hora }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { getRegistros } from "@/services/uploadService";
import UploadRegistro from "@/components/UploadRegistro.vue";

export default {
	components: { UploadRegistro },
	data() {
		return {
			registros: [],
		};
	},
	async mounted() {
		await this.atualizarRegistros();
	},
	methods: {
		async atualizarRegistros() {
			this.registros = await getRegistros();
			console.log(this.registros);
		},
	},
};
</script>

<style scoped>
table {
	border-collapse: collapse;
	width: 100%;
}

th {
	background-color: #f0fdf4;
}

td {
	border: 1px solid #e5e7eb;
}

tr:hover {
	background-color: #d1fae5;
}

h2 {
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

thead th {
	text-align: left;
	padding: 12px 16px;
}

tbody td {
	padding: 12px 16px;
}
</style>
