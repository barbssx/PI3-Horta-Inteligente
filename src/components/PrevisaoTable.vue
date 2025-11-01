<template>
	<div class="card shadow-sm">
		<div class="card-body">
			<h5 class="card-title text-center mb-3">Últimas Previsões</h5>
			<div class="table-responsive">
				<table class="table table-striped table-hover align-middle">
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
						<tr v-for="p in previsoes" :key="p.id">
							<td>{{ p.data }}</td>
							<td>{{ p.hora }}</td>
							<td>{{ p.temperatura_real }}</td>
							<td>{{ p.temperatura_prevista }}</td>
							<td>{{ p.umidade_real }}</td>
							<td>{{ p.umidade_prevista }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["previsoes"],
};
</script>
