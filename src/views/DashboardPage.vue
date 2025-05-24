<template>
	<div>
		<h3 class="text-xl font-semibold mb-2">📄 Insira o arquivo gerado pelo Arduino</h3>
		<div class="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-md text-blue-700 text-center max-w-xl mx-auto">
			<p class="paragraph">
				Para visualizar os dados no dashboard, envie o arquivo CSV ou XLSX gerado pelo Arduino. Ele deve conter as informações de temperatura e umidade
				organizadas na mesma sequência original da coleta. Assim, os gráficos e indicadores funcionarão corretamente com base nesses dados.
			</p>
		</div>
		<UploadFile @file-read="processFile" @clear-input="clearData" />

		<div v-if="processedData.length">
			<transition name="card">
				<div class="cards-container">
					<MetricCard title="Temperatura Máxima" :value="tempMax" />
					<MetricCard title="Temperatura Mínima" :value="tempMin" />
					<MetricCard title="Temperatura Média" :value="tempMed" />
				</div>
			</transition>

			<transition name="card">
				<div class="cards-container">
					<MetricCard title="Umidade Máxima" :value="umidadeMax" />
					<MetricCard title="Umidade Mínima" :value="umidadeMin" />
					<MetricCard title="Umidade Média" :value="umidadeMed" />
				</div>
			</transition>

			<transition name="card">
				<div class="cards-container">
					<MetricCard title="Data Inicial" :value="dataInicial" />
					<MetricCard title="Data Final" :value="dataFinal" />
				</div>
			</transition>

			<div class="bg-gray-50 border border-gray-300 rounded-md shadow-md p-4">
				<DashboardView :data="processedData" />
			</div>
		</div>
	</div>
</template>

<script>
import DashboardView from "@/components/DashboardView.vue";
import MetricCard from "@/components/MetricCard.vue";
import UploadFile from "@/components/UploadFile.vue";

export default {
	name: "DashboardPage",
	components: { DashboardView, UploadFile, MetricCard },
	data() {
		return {
			processedData: [],
			labels: [],
			temperaturaComposteira: [],
			umidadeComposteira: [],
		};
	},
	methods: {
		processFile(parsedData) {
			console.log("Dados recebidos:", parsedData);
			this.processedData = parsedData;
			this.labels = [];
			this.temperaturaComposteira = [];
			this.umidadeComposteira = [];

			this.processedData.forEach((data) => {
				this.labels.push(`${data.dia}/${data.mes}`);
				this.temperaturaComposteira.push(data.temperaturaComposteira);
				this.umidadeComposteira.push(data.umidadeAmbiente);
			});
		},
		clearData() {
			this.processedData = [];
			this.labels = [];
			this.temperaturaComposteira = [];
			this.umidadeComposteira = [];
		},
	},
	computed: {
		tempMax() {
			if (!this.processedData.length) return 0;
			return Math.max(...this.processedData.map((d) => d.temperaturaComposteira));
		},
		tempMin() {
			if (!this.processedData.length) return 0;
			return Math.min(...this.processedData.map((d) => d.temperaturaComposteira));
		},
		tempMed() {
			if (!this.processedData.length) return 0;
			const sum = this.processedData.reduce((total, d) => total + d.temperaturaComposteira, 0);
			return (sum / this.processedData.length).toFixed(2);
		},
		umidadeMax() {
			if (!this.processedData.length) return 0;
			return Math.max(...this.processedData.map((d) => d.umidadeAmbiente));
		},
		umidadeMin() {
			if (!this.processedData.length) return 0;
			return Math.min(...this.processedData.map((d) => d.umidadeAmbiente));
		},
		umidadeMed() {
			if (!this.processedData.length) return 0;
			const sum = this.processedData.reduce((total, d) => total + d.umidadeAmbiente, 0);
			return sum / this.processedData.length;
		},
		dataInicial() {
			if (!this.processedData.length) return "";
			const firstData = this.processedData[0];
			return firstData ? `${firstData.dia}/${firstData.mes}/${firstData.ano}` : "";
		},
		dataFinal() {
			if (!this.processedData.length) return "";
			const lastData = this.processedData[this.processedData.length - 1];
			return lastData ? `${lastData.dia}/${lastData.mes}/${lastData.ano}` : "";
		},
	},
};
</script>

<style scoped>
* {
	font-family: "Roboto", sans-serif;
}
.panel-body {
	@apply p-4 bg-white rounded-md shadow-sm;
}

.paragraph {
	font-size: 1.2rem;
	line-height: 1.5;
	color: #333;
	margin: 50px 100px;
}

.dashboard-title {
	text-align: center;
	font-size: 2.5rem;
	font-weight: 700;
	margin-top: 30px;
	color: #2c3e50;
	animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.cards-container {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-top: 20px;
	flex-wrap: wrap;
}

.card-enter-active {
	animation: fadeInUp 0.6s ease forwards;
}
.card-leave-active {
	animation: fadeOutDown 0.4s ease forwards;
}
.card-enter-from {
	opacity: 0;
	transform: translateY(20px);
}
.card-enter-to {
	opacity: 1;
	transform: translateY(0);
}
.card-leave-from {
	opacity: 1;
	transform: translateY(0);
}
.card-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

@keyframes fadeInUp {
	0% {
		opacity: 0;
		transform: translateY(20px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeOutDown {
	0% {
		opacity: 1;
		transform: translateY(0);
	}
	100% {
		opacity: 0;
		transform: translateY(20px);
	}
}

.btn-voltar {
	display: flex;
	align-items: center;
	gap: 6px;
	background: none;
	border: none;
	color: #2e7d32;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	margin-bottom: 20px;
	transition: color 0.2s;
}
.btn-voltar:hover {
	color: #1b5e20;
}
</style>
