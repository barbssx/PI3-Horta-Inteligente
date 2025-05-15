<template>
	<div>
		<line-chart :data="chartData" :options="chartOptions" />
	</div>
</template>

<script>
import { Line } from "vue-chartjs";
import { Chart as ChartJs, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJs.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
	name: "DashboardView",
	components: {
		"line-chart": Line,
	},
	props: {
		data: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			selectedMetrics: ["composteira", "ambiente", "umidade"],
		};
	},
	computed: {
		chartData() {
			const datasets = [];

			if (this.selectedMetrics.includes("composteira")) {
				datasets.push({
					label: "Temperatura da Composteira (°C)",
					backgroundColor: "rgba(255, 99, 132, 0.2)",
					borderColor: "rgba(255, 99, 132, 1)",
					data: this.data.map((item) => item.temperaturaComposteira),
					tension: 0.3,
				});
			}

			if (this.selectedMetrics.includes("ambiente")) {
				datasets.push({
					label: "Temperatura Ambiente (°C)",
					backgroundColor: "rgba(54, 162, 235, 0.2)",
					borderColor: "rgba(54, 162, 235, 1)",
					data: this.data.map((item) => item.temperaturaAmbiente),
					tension: 0.3,
				});
			}

			if (this.selectedMetrics.includes("umidade")) {
				datasets.push({
					label: "Umidade Ambiente (%)",
					backgroundColor: "rgba(75, 192, 192, 0.2)",
					borderColor: "rgba(75, 192, 192, 1)",
					data: this.data.map((item) => item.umidadeAmbiente),
					tension: 0.3,
				});
			}

			return {
				labels: this.data.map((item) => {
					const date = new Date(item.data);
					return !isNaN(date) ? date.toLocaleDateString() : "Data inválida";
				}),
				datasets,
			};
		},
		chartOptions() {
			return {
				responsive: true,
				plugins: {
					legend: {
						position: "top",
					},
					title: {
						display: true,
						text: "Variação de Temperatura",
					},
				},
			};
		},
	},
};
</script>

<style scoped>
div {
	width: 100%;
	max-width: 1200px;
	height: 680px;
	margin: 100px auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

h2 {
	text-align: center;
}
</style>
