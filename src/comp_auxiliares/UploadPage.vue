<template>
	<div class="p-4 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
		<UploadRegistro @upload-sucesso="filtrarRegistros" />

		<div class="bg-green-50 p-3 rounded-lg shadow-inner border border-green-200 max-w-sm mx-auto mt-4">
			<label for="filter" class="block text-lg font-bold text-green-900 mb-2">Filtrar por Data:</label>
			<div class="d-flex">
				<input type="date" id="filter" v-model="filter" class="form-control me-2" placeholder="Selecione uma data" />
				<button :disabled="!filter" @click="filtrarRegistros" class="btn btn-success">Filtrar</button>
			</div>
		</div>

		<table class="table table-bordered table-hover mt-5" v-if="registros.length">
			<thead class="table-success text-dark">
				<tr>
					<th>Temp. Composteira (°C)</th>
					<th>Temp. Ambiente (°C)</th>
					<th>Umidade (%)</th>
					<th>Tensão (V)</th>
					<th>Data</th>
					<th>Hora</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(reg, index) in registros" :key="index">
					<td>{{ reg.t_com }}</td>
					<td>{{ reg.t_amb }}</td>
					<td>{{ reg.u_amb }}</td>
					<td>{{ reg.tensao }}</td>
					<td>{{ formatarData(reg.data) }}</td>
					<td>{{ reg.hora }}</td>
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
			filter: "",
		};
	},
	watch: {
		filter(novaData) {
			if (!novaData) this.registros = [];
		},
	},
	methods: {
		async filtrarRegistros() {
			if (!this.filter) {
				alert("Por favor, selecione uma data.");
				return;
			}

			try {
				const registros = await getRegistros(this.filter);
				this.registros = registros;
			} catch (err) {
				console.error("Erro ao buscar registros:", err);
				alert("Erro ao buscar registros.");
			}
		},
		formatarData(dataISO) {
			if (!dataISO) return "";
			const [ano, mes, dia] = dataISO.split("T")[0].split("-");
			return `${dia}/${mes}/${ano}`;
		},
	},
};
</script>

<style scoped>
table {
	border-collapse: collapse;
	width: 100%;
	font-size: 0.9rem;
}

th,
td {
	padding: 8px 12px;
	border: 1px solid #ddd;
	text-align: center;
}

th {
	background-color: #d9f0de;
}

tr:hover td {
	background-color: #c6efc3;
}
</style>
