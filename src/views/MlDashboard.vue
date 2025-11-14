<template>
	<div class="container py-4">
		<button class="btn-voltar" @click="$router.back()">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
				<path
					fill-rule="evenodd"
					d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
				/>
			</svg>
			<span>Voltar</span>
		</button>
		<header class="text-center">
			<h2 class="mb-4 display-6 fw-bold text-primary">🌿 Painel de Previsões</h2>
			<p class="page-desc mx-auto mb-3">
				Monitoramento e controle preditivo do processo de compostagem. Treine o modelo, gere previsões e receba recomendações para otimizar temperatura e umidade.
			</p>
		</header>

		<section class="control-bar mb-3">
			<div class="controls-left">
				<div class="action-toolbar">
					<button
						class="btn btn-primary"
						@click="treinarModelo"
						data-bs-toggle="tooltip"
						data-bs-placement="top"
						:title="`Ensina o modelo com os dados históricos. RMSE atual: ${rmse || 'N/A'}`"
						:disabled="isTraining || isPredicting"
					>
						<span v-if="isTraining" class="d-inline-flex align-items-center gap-2">
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
							<span>Treinando modelo...</span>
						</span>
						<span v-else>🧠 Treinar Modelo</span>
					</button>
					<button
						class="btn btn-success"
						@click="gerarPrevisoes()"
						data-bs-toggle="tooltip"
						data-bs-placement="top"
						title="Faz previsões para os próximos intervalos usando o modelo atual"
						:disabled="isPredicting || isTraining"
					>
						<span v-if="isPredicting" class="d-inline-flex align-items-center gap-2">
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
							<span>Gerando previsões...</span>
						</span>
						<span v-else>📈 Gerar Previsões</span>
					</button>
					<button
						class="btn btn-outline-secondary btn-update"
						@click="atualizarDados"
						data-bs-toggle="tooltip"
						data-bs-placement="top"
						title="Recarrega os dados e atualiza a tela"
						:disabled="isRefreshing || isPredicting || isTraining"
					>
						<span v-if="isRefreshing" class="d-inline-flex align-items-center gap-2">
							<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
							<span>Atualizando...</span>
						</span>
						<span v-else>🔄 Atualizar</span>
					</button>
					<button
						type="button"
						class="btn-help ms-1"
						@click="showHelpModal"
						data-bs-toggle="tooltip"
						data-bs-placement="top"
						:title="helpTooltip"
						aria-label="Ajuda"
					>
						?
					</button>
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
						title="Temperatura Média"
						:real="tempAtual"
						prev=""
						icon="🌡️"
						unidade="°C"
						:descricao="`Temperatura média no intervalo de ${intervaloSelecionado}.`"
					/>
					<PrevisaoCard
						title="Previsão Média (Temp.)"
						:real="tempPrevista"
						prev=""
						icon="🔮"
						unidade="°C"
						:descricao="`Média das previsões de temperatura no intervalo de ${intervaloSelecionado}.`"
					/>
					<PrevisaoCard 
						title="Umidade Média" 
						:real="umidAtual" 
						prev="" 
						icon="💧" 
						unidade="%" 
						:descricao="`Umidade média no intervalo de ${intervaloSelecionado}.`" 
					/>
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
					<PrevisaoTable :previsoes="previsoes" :rmse="rmse" />
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

		<div class="modal fade" id="mlHelpModal" tabindex="-1" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header modal-header-help">
						<h5 class="modal-title">🌿 O que significa cada botão?</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
					</div>
					<div class="modal-body">
						<p><strong>Treinar Modelo</strong></p>
						<p>
							Este botão "Treinar Modelo" faz com que o sistema aprenda com os dados históricos já coletados. É como mostrar muitos exemplos para o
							computador e assim ele ajusta seus cálculos para entender melhor a relação entre temperatura, umidade e o comportamento da composteira.
						</p>
						<p><strong>Gerar Previsões</strong></p>
						<p>
							Depois que o modelo foi treinado, ao clicar em "Gerar Previsões" o sistema estima como estarão a temperatura e a umidade nos próximos
							períodos. Essas previsões ajudam a identificar problemas antes de aparecerem e a planejar ações (por exemplo, regar ou arejar).
						</p>
						<p><strong>Atualizar</strong></p>
						<p>
							O botão "Atualizar" recarrega os dados do servidor e atualiza a tela. Use quando quiser ver as previsões e medições mais recentes sem treinar
							ou gerar novamente.
						</p>
					</div>
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
			isTraining: false,
			isPredicting: false,
			isRefreshing: false,
			lastFetchError: null,
			intervalos: {
				"6h": "Últimas 6h",
				"1d": "Último Dia",
				"1w": "Última Semana",
			},
			mlModalTitle: "",
			mlModalBody: "",
			mlModalInstance: null,
			mlHelpModalInstance: null,
			helpTooltip: "Ajuda sobre o funcionamento dos botões de ML",
		};
	},

	computed: {
		ultimoRegistro() {
			if (!this.previsoes || this.previsoes.length === 0) {
				return { temperatura_real: 0, temperatura_prevista: 0, umidade_real: 0, umidade_prevista: 0 };
			}
			return this.previsoes[this.previsoes.length - 1];
		},
		
		mediaTemperaturaReal() {
			if (!this.previsoes || this.previsoes.length === 0) return 0;
			const valores = this.previsoes.filter(p => p.temperatura_real !== null).map(p => parseFloat(p.temperatura_real));
			if (valores.length === 0) return 0;
			return valores.reduce((acc, val) => acc + val, 0) / valores.length;
		},
		
		mediaTemperaturaPrevista() {
			if (!this.previsoes || this.previsoes.length === 0) return 0;
			const valores = this.previsoes.filter(p => p.temperatura_prevista !== null).map(p => parseFloat(p.temperatura_prevista));
			if (valores.length === 0) return 0;
			return valores.reduce((acc, val) => acc + val, 0) / valores.length;
		},
		
		mediaUmidadeReal() {
			if (!this.previsoes || this.previsoes.length === 0) return 0;
			const valores = this.previsoes.filter(p => p.umidade_real !== null).map(p => parseFloat(p.umidade_real));
			if (valores.length === 0) return 0;
			return valores.reduce((acc, val) => acc + val, 0) / valores.length;
		},
		
		tempAtual() {
			return this.mediaTemperaturaReal.toFixed(1);
		},
		tempPrevista() {
			return this.mediaTemperaturaPrevista.toFixed(1);
		},
		umidAtual() {
			return this.mediaUmidadeReal.toFixed(1);
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
			this.lastFetchError = null;
			this.loading = true;
			this.previsoes = [];
			try {
				const res = await axios.get(`${API_URL}/ml/ultimos-intervalo`, { params: { intervalo } });
				this.previsoes = res.data;

				await Promise.all([this.buscarComandos(), this.buscarAcuracia()]);

				this.verificarAlertas();
			} catch (error) {
				this.lastFetchError = error;
				console.error(error);
			} finally {
				this.loading = false;
				this.$nextTick(() => {
					this.initTooltips();
				});
			}
		},

		async treinarModelo() {
			if (this.isTraining || this.isPredicting) return;
			this.isTraining = true;
			try {
				const resTrain = await axios.post(`${API_URL}/ml/treinar`);
				const trainMsg = resTrain.data?.mensagem || "Modelo treinado com sucesso!";

				await this.buscarAcuracia();

				const resPrevisao = await this.gerarPrevisoes(false);

				let body = `<p><strong>Treinamento:</strong> ${trainMsg}</p>`;
				let previsaoTexto = "Nenhuma resposta do servidor.";
				if (!resPrevisao) {
					previsaoTexto = "Nenhuma resposta do servidor.";
				} else if (resPrevisao.error) {
					previsaoTexto = `Erro ao gerar previsões: ${resPrevisao.mensagem || resPrevisao.error}`;
				} else if (resPrevisao?.mensagem?.includes("Não há registros novos")) {
					previsaoTexto = "Todos os registros já estão atualizados, nenhuma nova previsão era necessária.";
				} else {
					previsaoTexto = resPrevisao.mensagem || JSON.stringify(resPrevisao);
				}
				body += `<p><strong>Previsões:</strong> ${previsaoTexto}</p>`;

				this.showMlModal("Resultado do Treinamento e Previsões", body);
			} catch (err) {
				const errMsg = err.response?.data?.erro || err.message || "Erro ao treinar modelo.";
				this.showMlModal("Erro no Treinamento", `<p>${errMsg}</p>`);
			} finally {
				this.isTraining = false;
			}
		},

		async gerarPrevisoes(showResultModal = true) {
			if (this.isPredicting) {
				return { error: true, mensagem: "Uma geração de previsões já está em andamento." };
			}
			this.isPredicting = true;
			try {
				const res = await axios.post(`${API_URL}/ml/prever`);
				await this.buscarPrevisoes();

				if (this.lastFetchError) {
					const mensagemErro = this.lastFetchError.response?.data?.erro || this.lastFetchError.message || "Erro ao atualizar as previsões.";
					if (showResultModal) {
						this.showMlModal("Erro ao Atualizar Previsões", `<p>${mensagemErro}</p>`);
					}
					return { error: true, mensagem: mensagemErro };
				}

				const mensagemBruta = res.data?.mensagem || "Previsões geradas com sucesso.";
				const mensagemFinal = mensagemBruta.includes("Não há registros novos")
					? "Todos os registros já estão atualizados, nenhuma nova previsão era necessária."
					: mensagemBruta;

				if (showResultModal) {
					this.showMlModal("Previsões Atualizadas", `<p>${mensagemFinal}</p>`);
				}

				const payload = typeof res.data === "object" && res.data !== null ? res.data : {};

				return { ...payload, mensagem: mensagemFinal };
			} catch (err) {
				const mensagem = err.response?.data?.erro || err.message || "Erro ao gerar previsões.";
				if (showResultModal) {
					this.showMlModal("Erro ao Gerar Previsões", `<p>${mensagem}</p>`);
				}
				return { error: true, mensagem };
			} finally {
				this.isPredicting = false;
			}
		},

		async atualizarDados() {
			if (this.isRefreshing || this.isPredicting || this.isTraining) return;
			this.isRefreshing = true;
			try {
				await this.buscarPrevisoes();
				if (this.lastFetchError) {
					const mensagemErro = this.lastFetchError.response?.data?.erro || this.lastFetchError.message || "Erro ao atualizar os dados.";
					this.showMlModal("Erro ao Atualizar", `<p>${mensagemErro}</p>`);
				} else {
					this.showMlModal("Dados Atualizados", `<p>Dashboard atualizado com ${this.previsoes.length} registros.</p>`);
				}
			} finally {
				this.isRefreshing = false;
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

		showHelpModal() {
			this.$nextTick(() => {
				const modalEl = document.getElementById("mlHelpModal");
				if (!modalEl) return;
				if (!this.mlHelpModalInstance) this.mlHelpModalInstance = new bootstrap.Modal(modalEl);
				this.mlHelpModalInstance.show();
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
.container {
	max-width: 1200px;
	padding: 1.5rem;
}

header {
	background: linear-gradient(120deg, #f8f9fa, #e9ecef);
	padding: 2rem 1rem;
	border-radius: 20px;
	margin-bottom: 2rem;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

header h2 {
	background: linear-gradient(45deg, #2e7d32, #4caf50);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-size: 2.2rem;
	margin-bottom: 1rem;
}

.btn-help {
	width: 26px;
	height: 26px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 0.9rem;
	line-height: 1;
	padding: 0;
	border-radius: 4px;
	border: 1px solid rgba(46, 125, 50, 0.12);
	background: transparent;
	color: #2e7d32;
	cursor: pointer;
	transition: all 0.2s ease;
}

.btn-help:hover {
	background: #e9f6e9;
	border-color: rgba(46, 125, 50, 0.2);
}

.btn-help:focus {
	outline: 2px solid rgba(46, 125, 50, 0.18);
}

.actions-bar {
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
}

.btn {
	min-width: 160px;
	padding: 0.7rem 1.2rem;
	margin: 0.25rem;
	border-radius: 12px;
	transition: all 0.3s ease;
	font-weight: 500;
	letter-spacing: 0.3px;
}

.btn-primary {
	background: linear-gradient(45deg, #2e7d32, #4caf50);
	border: none;
	box-shadow: 0 4px 15px rgba(46, 125, 50, 0.2);
}

.btn-primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(46, 125, 50, 0.3);
}

.btn-success {
	background: linear-gradient(45deg, #1b5e20, #388e3c);
	border: none;
	box-shadow: 0 4px 15px rgba(27, 94, 32, 0.2);
}

.btn-success:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(27, 94, 32, 0.3);
}

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
	align-items: center;
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

.alerts-area {
	max-width: 920px;
	margin: 0.5rem auto 1.25rem;
}
.alerts-area .alert {
	border-radius: 12px;
	padding: 0.9rem 1rem;
	margin-bottom: 0;
}

.content-tabs {
	margin-bottom: 1.5rem;
	border-bottom: none;
}

.nav-tabs {
	border: none;
	background: #f8f9fa;
	padding: 0.5rem;
	border-radius: 15px;
	gap: 0.5rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.nav-pills .nav-link,
.nav-tabs .nav-link {
	border-radius: 12px;
	padding: 0.6rem 1.2rem;
	margin: 0;
	transition: all 0.3s ease;
	font-weight: 500;
	color: #475569;
	border: none;
	background: transparent;
}

.nav-pills .nav-link.active,
.nav-tabs .nav-link.active {
	background: linear-gradient(45deg, #2e7d32, #4caf50);
	color: white !important;
	box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
}

.nav-pills .nav-link:hover,
.nav-tabs .nav-link:hover {
	background-color: #f1f8e9;
	color: #2e7d32;
	transform: translateY(-1px);
}

.tab-content {
	padding: 1.5rem 0;
}

.loading-state,
.empty-state {
	padding: 3rem 1.5rem;
	background: linear-gradient(120deg, #f8f9fa, #fff);
	border-radius: 16px;
	box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
	margin-bottom: 1.5rem;
	text-align: center;
}

.loading-state .spinner-border {
	color: #2e7d32;
	margin-bottom: 1rem;
}

.empty-state .alert {
	max-width: 600px;
	margin: 0 auto;
}

main {
	background: transparent;
}

.row.g-3 {
	margin: -0.75rem;
}

.row.g-3 > div {
	padding: 0.75rem;
}

:deep(.metric-card) {
	background: white;
	border-radius: 16px;
	padding: 1.5rem;
	height: 100%;
	transition: all 0.3s ease;
	border: 1px solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

:deep(.metric-card:hover) {
	transform: translateY(-4px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

:deep(.metric-card .card-title) {
	color: #475569;
	font-size: 0.9rem;
	font-weight: 600;
	margin-bottom: 0.75rem;
}

:deep(.metric-card .metric-value) {
	font-size: 2rem;
	font-weight: 700;
	color: #0f172a;
	margin-bottom: 0.5rem;
}

.modal-content {
	border-radius: 16px;
	overflow: hidden;
	border: none;
	box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.modal-header {
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	background: #f8f9fa;
}

.modal-header-help {
	background: linear-gradient(90deg, #2e7d32, #4caf50);
	color: #fff;
}
.modal-header-help .modal-title {
	color: #fff;
	font-weight: 700;
}
.modal-header-help .btn-close {
	filter: invert(1) opacity(0.85);
}
.modal-body {
	background: linear-gradient(180deg, #ffffff, #f7fff7);
}
.modal-body p {
	margin: 0.6rem 0;
	line-height: 1.45;
}
.modal-body p strong {
	color: #2e7d32;
	display: block;
	margin-bottom: 0.25rem;
}
.modal-footer .btn-secondary {
	background: #f1f5f1;
	border: 1px solid rgba(46, 125, 50, 0.12);
	color: #2e7d32;
}
.modal-footer .btn-secondary:hover {
	background: #e9f6e9;
}

.modal-body {
	padding: 1.5rem;
}

.modal-body p {
	margin: 0.5rem 0;
	line-height: 1.6;
}

.modal-footer {
	border-top: 1px solid rgba(0, 0, 0, 0.06);
	padding: 1rem 1.5rem;
}

.btn-voltar {
	display: flex;
	align-items: center;
	gap: 6px;
	margin: 20px;
	color: #2e7d32;
	font-weight: 600;
	cursor: pointer;
	border: none;
	background: transparent;
	transition: color 0.3s ease;
}
.btn-voltar:hover {
	color: #1b5e20;
}

.page-desc {
	max-width: 820px;
	color: #586b7a;
	font-size: 0.98rem;
}
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

.btn-update {
	transition: all 0.2s ease;
}
.btn-update:hover {
	background: #e9f6e9;
	border-color: rgba(46, 125, 50, 0.2) !important;
	color: #2e7d32;
}
.btn-update:focus {
	outline: 2px solid rgba(46, 125, 50, 0.18);
}
</style>
