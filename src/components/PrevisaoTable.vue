<template>
	<div class="card shadow-sm mb-4">
		<div class="card-body">
			<h5 class="card-title text-center mb-3 text-primary">Últimas Previsões</h5>
			<div class="table-responsive">
				<table class="table table-striped table-hover align-middle text-center">
					<thead class="table-dark">
						<tr>
							<th>Data</th>
							<th>Hora</th>
							<th>Temp. Real (°C)</th>
							<th>Temp. Prevista (°C)</th>
							<th>Umid. Real (%)</th>
							<th>Umid. Prevista (%)</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="p in previsoes"
							:key="p.id"
							:class="{
								'alerta-alto': p.temperatura_prevista > 40,
								'alerta-baixo': p.temperatura_prevista < 10,
								'umidade-baixa': p.umidade_prevista < 30,
							}"
						>
							<td>{{ p.data }}</td>
							<td>{{ p.hora }}</td>
							<td>{{ formatValue(p.temperatura_real) }}</td>
							<td>{{ formatValue(p.temperatura_prevista) }}</td>
							<td>{{ formatValue(p.umidade_real) }}</td>
							<td>{{ formatValue(p.umidade_prevista) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="text-muted text-center mt-2">🔹 Cores destacam valores críticos para facilitar a leitura.</p>
		</div>
	</div>
</template>

<script>
export default {
	props: ["previsoes"],
	methods: {
		formatValue(value) {
			if (value === null || value === undefined) return "N/A";
			return parseFloat(value).toFixed(2);
		},
	},
};
</script>

<style scoped>
.alerta-alto {
	background-color: #ffe5e5 !important;
	color: #d9534f;
	font-weight: 500;
}
.alerta-baixo {
	background-color: #e6f0ff !important;
	color: #0275d8;
	font-weight: 500;
}
.umidade-baixa {
	background-color: #fffbe6 !important;
	color: #f0ad4e;
	font-weight: 500;
}
.table th,
.table td {
	vertical-align: middle;
}
.table-striped tbody tr:nth-of-type(odd) {
	background-color: #f8f9fa;
}
.table-hover tbody tr:hover {
	background-color: #e2f0ff;
}
</style>
