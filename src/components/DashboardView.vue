<template>
	<div>
		<h2>Gráfico de Temperatura</h2>
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
	computed: {
		chartData() {
			return {
				labels: this.data.map((item) => item.date.toLocaleString()),
				datasets: [
					{
						label: "Temperatura (C)",
						backgroundColor: "rgba(75,192,192,0.2)",
						borderColor: "rgba(75,192,192,1)",
						data: this.data.map((item) => item.temperature),
					},
				],
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
	width: 90%;
	height: 480px;
	margin: 100px auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	h2 {
		text-align: center;
	}
}
</style>
