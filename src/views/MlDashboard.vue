<template>
	<div class="container py-4">
		<h2 class="text-center mb-4">🌡️ Painel de Previsões</h2>

		<div class="d-flex justify-content-center flex-wrap gap-2 mb-3">
			<button class="btn btn-primary" @click="treinarModelo">Treinar Modelo</button>
			<button class="btn btn-success" @click="gerarPrevisoes">Gerar Previsões</button>
			<button class="btn btn-secondary" @click="buscarPrevisoes">Atualizar Dados</button>
		</div>

		<div v-if="alertas.length" class="mb-3">
			<div v-for="(alerta, i) in alertas" :key="i" class="alert alert-warning d-flex align-items-center" role="alert">⚠️ {{ alerta }}</div>
		</div>

		<div v-if="loading" class="text-center text-muted py-5">
			<div class="spinner-border" role="status"></div>
			<p>Carregando dados...</p>
		</div>
		<div v-if="!previsoes.length && !loading" class="alert alert-info">Nenhuma previsão encontrada. Gere previsões ou treine o modelo para começar!</div>

		<div v-else>
			<div class="row g-3 mb-4">
				<PrevisaoCard title="Temperatura Média (°C)" :real="mediaTempReal" :prev="mediaTempPrev" icon="🌞" />
				<PrevisaoCard title="Umidade Média (%)" :real="mediaUmiReal" :prev="mediaUmiPrev" icon="💧" />
				<PrevisaoCard title="Total de Previsões" :real="previsoes.length" :prev="0" icon="📊" />
			</div>

			<PrevisaoChart :previsoes="previsoes" />
			<PrevisaoTable :previsoes="previsoes" />
		</div>
	</div>
</template>

<script>
import axios from "axios";
import PrevisaoCard from "../components/PrevisaoCard.vue";
import PrevisaoChart from "../components/PrevisaoChart.vue";
import PrevisaoTable from "../components/PrevisaoTable.vue";
const API_URL = process.env.VUE_APP_API_URL || "https://dashboard-production-4d11e.up.railway.app/api";

export default {
	name: "MlDashboard",
	components: { PrevisaoCard, PrevisaoChart, PrevisaoTable },

	data() {
		return {
			previsoes: [],
			loading: false,
			alertas: [],
		};
	},
	computed: {
		mediaTempReal() {
			return this.calcMedia("temperatura_real");
		},
		mediaTempPrev() {
			return this.calcMedia("temperatura_prevista");
		},
		mediaUmiReal() {
			return this.calcMedia("umidade_real");
		},
		mediaUmiPrev() {
			return this.calcMedia("umidade_prevista");
		},
	},
	methods: {
		calcMedia(campo) {
			if (!this.previsoes.length) return 0;
			const soma = this.previsoes.reduce((acc, p) => acc + (p[campo] || 0), 0);
			return (soma / this.previsoes.length).toFixed(1);
		},
		async buscarPrevisoes() {
			this.loading = true;
			try {
				const res = await axios.get(`${API_URL}/ml/ultimos`);
				this.previsoes = res.data;
				this.verificarAlertas();
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false;
			}
		},
		async treinarModelo() {
			try {
				await axios.post(`${API_URL}/ml/treinar`);
				alert("Modelo treinado com sucesso!");
			} catch {
				alert("Erro ao treinar modelo.");
			}
		},
		async gerarPrevisoes() {
			try {
				const res = await axios.post(`${API_URL}/ml/prever`);
				alert(res.data.mensagem || "Previsões geradas com sucesso!");
				this.buscarPrevisoes();
			} catch {
				alert("Erro ao gerar previsões.");
			}
		},
		verificarAlertas() {
			this.alertas = [];
			this.previsoes.forEach((p) => {
				if (p.temperatura_prevista > 40) this.alertas.push(`Temperatura alta prevista em ${p.data}: ${p.temperatura_prevista}°C`);
				if (p.temperatura_prevista < 10) this.alertas.push(`Temperatura muito baixa prevista em ${p.data}: ${p.temperatura_prevista}°C`);
				if (p.umidade_prevista < 30) this.alertas.push(`Umidade crítica em ${p.data}: ${p.umidade_prevista}%`);
			});
		},
	},
	mounted() {
		this.buscarPrevisoes();
		console.log(API_URL);
	},
};
</script>

<style scoped>
.container {
	max-width: 1100px;
}
</style>
