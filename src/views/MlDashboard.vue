<template>
	<div class="container py-4">
		<header class="text-center">
			<h2 class="mb-4 display-6 fw-bold text-primary">🌿 Painel de Previsões</h2>
			<p class="page-desc mx-auto mb-3">
				Monitoramento e controle preditivo do processo de compostagem. Treine o modelo, gere previsões e receba recomendações para otimizar temperatura e umidade.
			</p>
		</header>

		<section class="control-bar mb-3">
			<div class="controls-left">
				<div class="action-toolbar">
					<button class="btn btn-primary" @click="treinarModelo">🧠 Treinar Modelo</button>
					<button class="btn btn-success" @click="gerarPrevisoes">📈 Gerar Previsões</button>
					<button class="btn btn-outline-secondary" @click="buscarPrevisoes">🔄 Atualizar</button>
				</div>
			</div>
			<div class="controls-right">
				<ul class="nav nav-pills interval-pills">
					<li class="nav-item" v-for="(label, key) in intervalos" :key="key">
						<button class="nav-link" :class="{ active: intervaloSelecionado === key }" @click="alterarIntervalo(key)">
							{{ label }}
						</button>
					</li>
				</ul>
			</div>
		</section>

		<section class="alerts-area mb-4">
			<div v-if="comandosOtimizacao?.comandos?.length" class="alert alert-danger shadow-sm d-flex align-items-center gap-3" role="alert">
				<div class="me-3">
					<span class="fs-4">🚨</span>
				</div>
				<div>
					<h5 class="mb-1">AÇÃO URGENTE NECESSÁRIA</h5>
					<p class="mb-0 fw-bold">{{ comandosOtimizacao.comandos[0].acao }} ({{ comandosOtimizacao.comandos[0].prioridade }})</p>
					<small class="text-muted">{{ comandosOtimizacao.comandos[0].justificativa }}</small>
				</div>
			</div>
			<div v-else-if="comandosOtimizacao?.mensagem && !loading" class="alert alert-success shadow-sm text-center">✅ {{ comandosOtimizacao.mensagem }}</div>
		</section>

		<section v-if="loading" class="loading-state text-center text-muted py-5">
			<div class="spinner-border" role="status"></div>
			<p class="mt-2">Carregando dados...</p>
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

		<div class="modal fade" id="mlResultModal" tabindex="-1" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ mlModalTitle }}</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
					</div>
					<div class="modal-body" v-html="mlModalBody"></div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
					</div>
				</div>
			</div>
		</div>
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
			mlModalTitle: "",
			mlModalBody: "",
			mlModalInstance: null,
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
				const resTrain = await axios.post(`${API_URL}/ml/treinar`);
				const trainMsg = resTrain.data?.mensagem || "Modelo treinado com sucesso!";

				await this.buscarAcuracia();

				const resPrevisao = await this.gerarPrevisoes();

				let body = `<p><strong>Treinamento:</strong> ${trainMsg}</p>`;
				if (!resPrevisao) {
					body += `<p><strong>Previsões:</strong> Nenhuma resposta do servidor.</p>`;
				} else if (resPrevisao.error) {
					body += `<p><strong>Previsões:</strong> Erro ao gerar previsões: ${resPrevisao.mensagem || resPrevisao.error}</p>`;
				} else {
					body += `<p><strong>Previsões:</strong> ${resPrevisao.mensagem || JSON.stringify(resPrevisao)}</p>`;
				}

				this.showMlModal("Resultado do Treinamento e Previsões", body);
			} catch (err) {
				const errMsg = err.response?.data?.erro || err.message || "Erro ao treinar modelo.";
				this.showMlModal("Erro no Treinamento", `<p>${errMsg}</p>`);
			}
		},

		async gerarPrevisoes() {
			try {
				const res = await axios.post(`${API_URL}/ml/prever`);
				this.buscarPrevisoes();
				return res.data;
			} catch (err) {
				const mensagem = err.response?.data?.erro || "Erro ao gerar previsões.";
				return { error: true, mensagem };
			}
		},

		showMlModal(title, bodyHtml) {
			this.mlModalTitle = title;
			this.mlModalBody = bodyHtml;

			this.$nextTick(() => {
				const modalEl = document.getElementById("mlResultModal");
				if (!modalEl) return;
				if (!this.mlModalInstance) this.mlModalInstance = new bootstrap.Modal(modalEl);
				modalEl.querySelector(".modal-body").innerHTML = bodyHtml;
				this.mlModalInstance.show();
			});
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
/* Layout container mais estreito para melhor leitura */
.container {
	max-width: 1100px;
}

/* Ações principais (botões) — agrupados e consistentes */
.actions-bar {
	display: flex;
	justify-content: center;
	margin-bottom: 0.75rem;
}
.actions-bar .btn {
	min-width: 160px;
	padding: 0.6rem 1rem;
	margin: 0.25rem;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

/* Seletor de intervalo separado visualmente */
.interval-selector {
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
}
.interval-selector .nav {
	background: #ffffff;
	padding: 0.35rem;
	border-radius: 999px;
	box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

/* Nova barra de controle: agrupa ações e seletor */
.control-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;
}
.controls-left .action-toolbar {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}
.controls-right {
	display: flex;
	justify-content: flex-end;
}
.interval-pills {
	background: #fff;
	padding: 0.35rem;
	border-radius: 999px;
	box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
}

@media (max-width: 768px) {
	.control-bar {
		flex-direction: column;
		align-items: stretch;
	}
	.controls-right {
		justify-content: center;
		margin-top: 0.5rem;
	}
	.controls-left .action-toolbar {
		justify-content: center;
	}
}

/* Alerts agrupadas abaixo do seletor para não quebrar a linha de ações */
.alerts-area {
	max-width: 920px;
	margin: 0.5rem auto 1.25rem;
}
.alerts-area .alert {
	border-radius: 12px;
	padding: 0.9rem 1rem;
	margin-bottom: 0;
}

/* Tabs e conteúdo */
.content-tabs {
	margin-bottom: 0.75rem;
}
.nav-pills .nav-link,
.nav-tabs .nav-link {
	border-radius: 20px;
	padding: 0.45rem 1.1rem;
	margin: 0.25rem;
	transition: all 0.16s ease;
	font-weight: 600;
	color: #334155;
}
.nav-pills .nav-link.active,
.nav-tabs .nav-link.active {
	background-color: #0d6efd;
	color: white !important;
	box-shadow: 0 6px 18px rgba(13, 110, 253, 0.18);
}
.nav-pills .nav-link:hover,
.nav-tabs .nav-link:hover {
	background-color: #e9f2ff;
}

/* Estados: loading / vazio */
.loading-state,
.empty-state {
	padding: 2rem 1rem;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
	margin-bottom: 1rem;
}

/* Ajustes para o main e cartões */
main {
	background: transparent;
}
.tab-content {
	padding-top: 0.5rem;
}

/* Modal mais leve */
.modal-content {
	border-radius: 12px;
	overflow: hidden;
}
.modal-header {
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.modal-body p {
	margin: 0.25rem 0;
}

.page-desc {
	max-width: 820px;
	color: #586b7a;
	font-size: 0.98rem;
}

/* Pequeños refinamentos nas cores de alerta */
.alert-danger {
	border-left: 4px solid #dc3545;
	background: linear-gradient(90deg, rgba(255, 243, 244, 0.6), rgba(255, 255, 255, 0.02));
}
.alert-success {
	border-left: 4px solid #28a745;
}
.alert-info {
	border-left: 4px solid #17a2b8;
}

.btn-close {
	filter: grayscale(0.2);
}
</style>
