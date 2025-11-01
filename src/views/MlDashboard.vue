<template>
	<div class="container py-4">
		<h2 class="text-center mb-4 display-6 fw-bold text-primary">🌿 Painel de Previsões</h2>

		<!-- Controles principais -->
		<div class="d-flex justify-content-center flex-wrap gap-2 mb-4">
			<button class="btn btn-primary shadow-sm" @click="treinarModelo">🧠 Treinar Modelo</button>
			<button class="btn btn-success shadow-sm" @click="gerarPrevisoes">📈 Gerar Previsões</button>
			<button class="btn btn-outline-secondary shadow-sm" @click="buscarPrevisoes">🔄 Atualizar</button>
		</div>

		<!-- Intervalos de tempo -->
		<div class="text-center mb-4">
			<ul class="nav nav-pills justify-content-center flex-wrap">
				<li class="nav-item" v-for="(label, key) in intervalos" :key="key">
					<button class="nav-link" :class="{ active: intervaloSelecionado === key }" @click="alterarIntervalo(key)">
						{{ label }}
					</button>
				</li>
			</ul>
		</div>

		<!-- Alertas globais -->
		<div v-if="alertas.length" class="mb-3">
			<div v-for="(alerta, i) in alertas" :key="i" class="alert alert-warning shadow-sm d-flex align-items-center gap-2" role="alert">⚠️ {{ alerta }}</div>
		</div>

		<!-- Carregando -->
		<div v-if="loading" class="text-center text-muted py-5">
			<div class="spinner-border" role="status"></div>
			<p class="mt-2">Carregando dados...</p>
		</div>

		<!-- Nenhum dado -->
		<div v-if="!previsoes.length && !loading" class="alert alert-info text-center shadow-sm">
			Nenhuma previsão encontrada. Gere previsões ou treine o modelo para começar!
		</div>

		<div v-else>
			<ul class="nav nav-tabs mb-3 justify-content-center">
				<li class="nav-item">
					<button class="nav-link" :class="{ active: abaSelecionada === 'cards' }" @click="abaSelecionada = 'cards'">Métricas</button>
				</li>
				<li class="nav-item">
					<button class="nav-link" :class="{ active: abaSelecionada === 'chart' }" @click="abaSelecionada = 'chart'">Gráficos</button>
				</li>
				<li class="nav-item">
					<button class="nav-link" :class="{ active: abaSelecionada === 'table' }" @click="abaSelecionada = 'table'">Tabela</button>
				</li>
			</ul>

			<div v-if="abaSelecionada === 'cards'" class="row g-3 mb-4">
				<PrevisaoCard title="Temperatura Média (°C)" :real="mediaTempReal" :prev="mediaTempPrev" icon="🌞" />
				<PrevisaoCard title="Umidade Média (%)" :real="mediaUmiReal" :prev="mediaUmiPrev" icon="💧" />
				<PrevisaoCard title="Total de Previsões" :real="previsoes.length" :prev="0" icon="📊" />
			</div>

			<!-- Aba Gráfico -->
			<div v-if="abaSelecionada === 'chart'">
				<PrevisaoChart :previsoes="previsoes" :intervalo="intervaloSelecionado" />
			</div>

			<div v-if="abaSelecionada === 'table'">
				<PrevisaoTable :previsoes="previsoes" />
			</div>
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
			intervaloSelecionado: "1d",
			abaSelecionada: "cards",
			intervalos: {
				"6h": "Últimas 6h",
				"1d": "Último Dia",
				"1w": "Última Semana",
			},
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

		alterarIntervalo(novo) {
			this.intervaloSelecionado = novo;
			this.buscarPrevisoes(novo);
		},

		async buscarPrevisoes(intervalo = this.intervaloSelecionado) {
			this.loading = true;
			try {
				const res = await axios.get(`${API_URL}/ml/ultimos-intervalo`, { params: { intervalo } });
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
	},
};
</script>

<style scoped>
.nav-pills .nav-link,
.nav-tabs .nav-link {
	border-radius: 20px;
	padding: 0.5rem 1.3rem;
	margin: 0.3rem;
	transition: all 0.2s ease;
	font-weight: 500;
}
.nav-pills .nav-link.active,
.nav-tabs .nav-link.active {
	background-color: #007bff;
	color: white;
	box-shadow: 0 2px 8px rgba(0, 123, 255, 0.4);
}
.nav-pills .nav-link:hover,
.nav-tabs .nav-link:hover {
	background-color: #e7f1ff;
}
.alert {
	border-left: 5px solid #ffc107;
}
.btn {
	border-radius: 10px;
}
</style>
