<template>
	<div class="card shadow-sm mb-4 p-3">
		<h5 class="text-center mb-3">🌡️ Evolução de Temperatura e Umidade</h5>
		<div ref="chart" style="width: 100%; height: 400px"></div>
	</div>
</template>

<script>
import * as echarts from "echarts";

export default {
	props: ["previsoes", "intervalo"],
	data() {
		return {
			chartInstance: null,
		};
	},
	watch: {
		previsoes: {
			handler() {
				this.renderChart();
			},
			deep: true,
		},
		intervalo() {
			this.renderChart();
		},
	},
	mounted() {
		this.chartInstance = echarts.init(this.$refs.chart);
		this.renderChart();
		window.addEventListener("resize", this.resizeChart);
	},
	beforeUnmount() {
		window.removeEventListener("resize", this.resizeChart);
		this.chartInstance?.dispose();
	},
	methods: {
		resizeChart() {
			this.chartInstance?.resize();
		},

		formatDateTime(p) {
			if (!p.data) return "";
			const date = new Date(p.data);
			if (isNaN(date)) return p.data;

			const dia = String(date.getDate()).padStart(2, "0");
			const mes = String(date.getMonth() + 1).padStart(2, "0");
			const hora = p.hora ? p.hora.substring(0, 5) : `${date.getHours()}:${date.getMinutes()}`;
			return `${dia}/${mes} ${hora}`;
		},

		renderChart() {
			if (!this.previsoes || !this.previsoes.length) {
				this.chartInstance?.clear();
				return;
			}

			const labels = this.previsoes.map((p) => this.formatDateTime(p));

			const tempReal = this.previsoes.map((p) => p.temperatura_real ?? null);
			const tempPrev = this.previsoes.map((p) => p.temperatura_prevista ?? null);
			const umiReal = this.previsoes.map((p) => p.umidade_real ?? null);
			const umiPrev = this.previsoes.map((p) => p.umidade_prevista ?? null);

			const option = {
				animationDuration: 800,
				animationEasing: "cubicOut",
				tooltip: {
					trigger: "axis",
					backgroundColor: "#fff",
					borderColor: "#ccc",
					borderWidth: 1,
					textStyle: { color: "#333" },
					formatter: (params) => {
						let texto = `<strong>${params[0].axisValue}</strong><br/>`;
						params.forEach((p) => {
							let unidade = p.seriesName.includes("Temp.") ? "°C" : "%";
							let valor = p.data !== null ? p.data.toFixed(2) : "N/A";
							texto += `${p.marker} ${p.seriesName}: <strong>${valor}${unidade}</strong><br/>`;
						});
						return texto;
					},
				},
				legend: {
					data: ["Temp. Real", "Temp. Prevista", "Umid. Real", "Umid. Prevista"],
					top: 0,
				},
				grid: {
					left: "3%",
					right: "3%",
					bottom: "3%",
					containLabel: true,
				},
				xAxis: {
					type: "category",
					data: labels,
					boundaryGap: false,
					axisLabel: {
						rotate: 30,
						interval: this.previsoes.length > 50 ? 5 : 0,
					},
				},
				yAxis: [
					{
						type: "value",
						name: "Temperatura (°C)",
						position: "left",
						min: 0,
						max: 75,
						splitArea: {
							show: true,
							areaStyle: {
								color: ["#e6f0ff", "#fff"],
							},
						},
						markArea: {
							silent: true,
							data: [
								[{ yAxis: 40, itemStyle: { color: "rgba(255,0,0,0.08)" } }, { yAxis: 75 }],
								[{ yAxis: 0, itemStyle: { color: "rgba(0,123,255,0.08)" } }, { yAxis: 10 }],
							],
						},
					},
					{
						type: "value",
						name: "Umidade (%)",
						position: "right",
						min: 0,
						max: 100,
						markArea: {
							silent: true,
							data: [[{ yAxis: 0, itemStyle: { color: "rgba(255,215,0,0.08)" } }, { yAxis: 30 }]],
						},
					},
				],
				series: [
					{
						name: "Temp. Real",
						type: "line",
						data: tempReal,
						smooth: true,
						yAxisIndex: 0,
						lineStyle: { color: "#FF5733", width: 3 },
						itemStyle: { color: "#FF5733" },
						symbol: "circle",
						symbolSize: 4,
					},
					{
						name: "Temp. Prevista",
						type: "line",
						data: tempPrev,
						smooth: true,
						yAxisIndex: 0,
						lineStyle: { color: "#FFC300", width: 3, type: "dashed" },
						itemStyle: { color: "#FFC300" },
						symbol: "none",
					},
					{
						name: "Umid. Real",
						type: "line",
						data: umiReal,
						smooth: true,
						yAxisIndex: 1,
						lineStyle: { color: "#3498DB", width: 3 },
						itemStyle: { color: "#3498DB" },
						symbol: "circle",
						symbolSize: 4,
					},
					{
						name: "Umid. Prevista",
						type: "line",
						data: umiPrev,
						smooth: true,
						yAxisIndex: 1,
						lineStyle: { color: "#2ECC71", width: 3, type: "dashed" },
						itemStyle: { color: "#2ECC71" },
						symbol: "none",
					},
				],
			};

			this.chartInstance.setOption(option, true);
		},
	},
};
</script>

<style scoped>
.card {
	border-radius: 12px;
	transition: box-shadow 0.3s ease;
}
.card:hover {
	box-shadow: 0 0 15px rgba(0, 123, 255, 0.2);
}
</style>
