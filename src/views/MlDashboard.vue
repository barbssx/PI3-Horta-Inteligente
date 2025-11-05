<template>
	<div class="container py-4">
		<header class="text-center">
			<h2 class="mb-4 display-6 fw-bold text-primary">🌿 Painel de Controlo da Compostagem</h2>
		</header>

		<section class="actions-bar mb-4">
			<div class="d-flex justify-content-center flex-wrap gap-2">
				<button class="btn btn-primary shadow-sm" @click="treinarModelo">🧠 Treinar Modelo</button>
				<button class="btn btn-success shadow-sm" @click="gerarPrevisoes">📈 Gerar Previsões</button>
				<button class="btn btn-outline-secondary shadow-sm" @click="buscarPrevisoes">🔄 Atualizar</button>
			</div>
		</section>

		<section class="interval-selector text-center mb-4">
			<ul class="nav nav-pills justify-content-center flex-wrap">
				<li class="nav-item" v-for="(label, key) in intervalos" :key="key">
					<button class="nav-link" :class="{ active: intervaloSelecionado === key }" @click="alterarIntervalo(key)">
						{{ label }}
					</button>
				</li>
			</ul>
		</section>

		<section class="alerts-area mb-4">
			<div v-if="comandosOtimizacao?.comandos?.length" class="alert alert-danger shadow-sm d-flex align-items-center gap-3" role="alert">
				<h4 class="alert-heading mb-0">🚨 AÇÃO URGENTE NECESSÁRIA</h4>
				<div>
					<p class="mb-1 fw-bold">
						{{ comandosOtimizacao.comandos[0].acao }}
						({{ comandosOtimizacao.comandos[0].prioridade }})
					</p>
					<small>{{ comandosOtimizacao.comandos[0].justificativa }}</small>
				</div>
			</div>
			<div v-else-if="comandosOtimizacao?.mensagem && !loading" class="alert alert-success shadow-sm text-center">✅ {{ comandosOtimizacao.mensagem }}</div>
		</section>

		<section v-if="loading" class="loading-state text-center text-muted py-5">
			<div class="spinner-border" role="status"></div>
			<p class="mt-2">Carregando dados de inteligência...</p>
		</section>

		<section v-else-if="!previsoes.length" class="empty-state">
			<div class="alert alert-info text-center shadow-sm">Nenhuma previsão recente encontrada no intervalo. Gere previsões ou treine o modelo para começar!</div>
		</section>

		<main v-else>
			<nav class="content-tabs mb-3">
				<ul class="nav nav-tabs justify-content-center">
					<li class="nav-item">
						<button class="nav-link" :class="{ active: abaSelecionada === 'cards' }" @click="abaSelecionada = 'cards'">Métricas Atuais</button>
					</li>
					<li class="nav-item">
						<button class="nav-link" :class="{ active: abaSelecionada === 'chart' }" @click="abaSelecionada = 'chart'">Gráficos de Tendência</button>
					</li>
					<li class="nav-item">
						<button class="nav-link" :class="{ active: abaSelecionada === 'table' }" @click="abaSelecionada = 'table'">Tabela de Dados</button>
					</li>
				</ul>
			</nav>

			<section class="tab-content">
				<div v-if="abaSelecionada === 'cards'" class="row g-3 mb-4">
					<PrevisaoCard
						title="Temperatura Atual"
						:real="tempAtual"
						prev=""
						icon="🌡️"
						unidade="°C"
						descricao="A última temperatura real medida pela sonda dentro do composto."
					/>
					<PrevisaoCard
						title="Próxima Previsão (Temp.)"
						:real="tempPrevista"
						prev=""
						icon="🔮"
						unidade="°C"
						descricao="A previsão de temperatura para o próximo intervalo, calculada pelo modelo."
					/>
					<PrevisaoCard title="Humidade Atual" :real="umidAtual" prev="" icon="💧" unidade="%" descricao="A última humidade real medida no ambiente." />
					<PrevisaoCard
						title="Acurácia (RMSE)"
						:real="rmse ? parseFloat(rmse).toFixed(2) : 'N/A'"
						prev=""
						icon="🎯"
						:unidade="rmse && rmse !== 'N/A' ? '°C' : ''"
						descricao="RMSE (Erro Quadrático Médio): Indica a margem de erro média das previsões do modelo. Quanto menor, melhor."
					/>
				</div>

				<div v-if="abaSelecionada === 'chart'">
					<PrevisaoChart :previsoes="previsoes" :intervalo="intervaloSelecionado" />
				</div>

				<div v-if="abaSelecionada === 'table'">
					<PrevisaoTable :previsoes="previsoes" />
				</div>
			</section>
		</main>
	</div>
</template>

<script>
import axios from "axios";
import PrevisaoCard from "../components/PrevisaoCard.vue";
import PrevisaoChart from "../components/PrevisaoChart.vue";
import PrevisaoTable from "../components/PrevisaoTable.vue";
import * as bootstrap from "bootstrap";

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
			rmse: null,
			comandosOtimizacao: null,
			intervalos: {
				"6h": "Últimas 6h",
				"1d": "Último Dia",
				"1w": "Última Semana",
			},
		};
	},

	computed: {
		ultimoRegistro() {
			if (!this.previsoes || this.previsoes.length === 0) {
				return { temperatura_real: 0, temperatura_prevista: 0, umidade_real: 0, umidade_prevista: 0 };
			}
			return this.previsoes[this.previsoes.length - 1];
		},
		tempAtual() {
			return parseFloat(this.ultimoRegistro.temperatura_real).toFixed(1);
		},
		tempPrevista() {
			return parseFloat(this.ultimoRegistro.temperatura_prevista).toFixed(1);
		},
		umidAtual() {
			return parseFloat(this.ultimoRegistro.umidade_real).toFixed(1);
		},
		umidPrevista() {
			return parseFloat(this.ultimoRegistro.umidade_prevista).toFixed(1);
		},
	},

	methods: {
		alterarIntervalo(novo) {
			this.intervaloSelecionado = novo;
			this.buscarPrevisoes(novo);
		},

		initTooltips() {
			const oldTooltips = document.querySelectorAll(".tooltip");
			oldTooltips.forEach((tooltip) => tooltip.remove());

			const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
			tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new bootstrap.Tooltip(tooltipTriggerEl);
			});
		},

		async buscarComandos() {
			try {
				const res = await axios.get(`${API_URL}/ml/comandos-otimizacao`);
				this.comandosOtimizacao = res.data;
			} catch (error) {
				console.error("Erro ao buscar comandos de otimização:", error);
				this.comandosOtimizacao = { mensagem: "Erro ao carregar comandos." };
			}
		},

		async buscarAcuracia() {
			try {
				const res = await axios.get(`${API_URL}/ml/acuracia`);
				this.rmse = res.data.RMSE || "N/A";
			} catch (error) {
				console.error("Erro ao buscar acurácia do modelo:", error);
				this.rmse = "Erro";
			}
		},

		async buscarPrevisoes(intervalo = this.intervaloSelecionado) {
			this.loading = true;
			this.previsoes = [];
			try {
				const res = await axios.get(`${API_URL}/ml/ultimos-intervalo`, { params: { intervalo } });
				this.previsoes = res.data;

				await Promise.all([this.buscarComandos(), this.buscarAcuracia()]);

				this.verificarAlertas();
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false;
				this.$nextTick(() => {
					this.initTooltips();
				});
			}
		},

		async treinarModelo() {
			try {
				await axios.post(`${API_URL}/ml/treinar`);
				alert("Modelo treinado com sucesso!");
				await this.buscarAcuracia();
				await this.gerarPrevisoes();
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
.alert-danger {
	border-left: 5px solid #dc3545;
}
.alert-success {
	border-left: 5px solid #28a745;
}
.alert-warning {
	border-left: 5px solid #ffc107;
}
.btn {
	border-radius: 10px;
}
</style>
