<template>
	<div class="card shadow-sm mb-4 p-3">
		<h5 class="text-center mb-3">Evolução de Temperatura e Umidade</h5>
		<canvas ref="chartCanvas"></canvas>
	</div>
</template>

<script>
import { Chart } from "chart.js/auto";

export default {
	props: ["previsoes"],
	mounted() {
		this.renderChart();
	},
	watch: {
		previsoes() {
			this.renderChart();
		},
	},
	methods: {
		renderChart() {
			if (!this.previsoes.length) return;

			const ctx = this.$refs.chartCanvas.getContext("2d");
			if (this.chart) this.chart.destroy();

			const labels = this.previsoes.map((p) => p.data);
			const tempReal = this.previsoes.map((p) => p.temperatura_real);
			const tempPrev = this.previsoes.map((p) => p.temperatura_prevista);
			const umiReal = this.previsoes.map((p) => p.umidade_real);
			const umiPrev = this.previsoes.map((p) => p.umidade_prevista);

			this.chart = new Chart(ctx, {
				type: "line",
				data: {
					labels,
					datasets: [
						{ label: "Temp. Real", data: tempReal, borderColor: "red", tension: 0.3 },
						{ label: "Temp. Prevista", data: tempPrev, borderColor: "orange", tension: 0.3 },
						{ label: "Umid. Real", data: umiReal, borderColor: "blue", tension: 0.3 },
						{ label: "Umid. Prevista", data: umiPrev, borderColor: "green", tension: 0.3 },
					],
				},
				options: {
					responsive: true,
					scales: { y: { beginAtZero: true } },
				},
			});
		},
	},
};
</script>
