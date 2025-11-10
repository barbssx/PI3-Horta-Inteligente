<template>
	<div class="card shadow-sm mb-4">
		<div class="card-body">
			<div class="legend d-flex justify-content-center mb-3" role="region" aria-label="Legenda dos símbolos">
				<div class="legend-item">
					<span class="legend-icon" aria-hidden="true">⚠️</span>
					<span class="legend-text">Temp. muito alta (&gt;40°C)</span>
					<button class="btn btn-sm btn-help" @click="showAjuda('alta')" aria-label="Saiba mais sobre temperatura alta">?</button>
				</div>
				<div class="legend-item">
					<span class="legend-icon" aria-hidden="true">🧊</span>
					<span class="legend-text">Temp. muito baixa (&lt;10°C)</span>
					<button class="btn btn-sm btn-help" @click="showAjuda('baixa')" aria-label="Saiba mais sobre temperatura baixa">?</button>
				</div>
				<div class="legend-item">
					<span class="legend-icon" aria-hidden="true">💧</span>
					<span class="legend-text">Umid. baixa (&lt;30%)</span>
					<button class="btn btn-sm btn-help" @click="showAjuda('umidade')" aria-label="Saiba mais sobre umidade baixa">?</button>
				</div>
			</div>
			<div class="table-responsive">
				<table class="table table-striped table-hover align-middle text-center">
					<thead class="table-dark">
						<tr>
							<th data-bs-toggle="tooltip" data-bs-placement="top" title="Data do registro (dia/mês/ano)">Data</th>
							<th data-bs-toggle="tooltip" data-bs-placement="top" title="Hora do registro">Hora</th>
							<th data-bs-toggle="tooltip" data-bs-placement="top" title="Temperatura medida pelo sensor (em °C)">Temp. Real (°C)</th>
							<th data-bs-toggle="tooltip" data-bs-placement="top" title="Temperatura prevista pelo modelo para este intervalo (em °C)">
								Temp. Prevista (°C)
							</th>
							<th data-bs-toggle="tooltip" data-bs-placement="top" title="Umidade medida pelo sensor (em %)">Umid. Real (%)</th>
							<th data-bs-toggle="tooltip" data-bs-placement="top" title="Umidade prevista pelo modelo para este intervalo (em %)">Umid. Prevista (%)</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(p, index) in paginatedPrevisoes" :key="p.id ?? `${currentPage}-${index}`" :class="rowClass(p)">
							<td>{{ formatDataBR(p.data) }}</td>
							<td>{{ p.hora }}</td>
							<td>{{ formatValue(p.temperatura_real) }}</td>
							<td>{{ formatValue(p.temperatura_prevista) }}</td>
							<td>{{ formatValue(p.umidade_real) }}</td>
							<td>{{ formatValue(p.umidade_prevista) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="pagination-footer mt-3">
				<div class="pagination-info">
					Mostrando {{ totalRegistros ? pageStart : 0 }} - {{ totalRegistros ? pageEnd : 0 }} de {{ totalRegistros }} registros.
				</div>
				<div class="pagination-controls" role="group" aria-label="Paginação da tabela de previsões">
					<button type="button" class="btn btn-outline-success" @click="prevPage" :disabled="currentPage === 1">
						Anterior
					</button>
					<span class="pagination-status">Página {{ Math.min(currentPage, totalPages) }} de {{ totalPages }}</span>
					<button type="button" class="btn btn-outline-success" @click="nextPage" :disabled="currentPage === totalPages || totalRegistros === 0">
						Próxima
					</button>
				</div>
			</div>
		</div>

		<div class="modal fade" id="ajudaModal" tabindex="-1" aria-labelledby="ajudaModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-scrollable modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="ajudaModalLabel">{{ modalTitulo }}</h5>
						<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
					</div>
					<div class="modal-body" v-if="modalConteudo">
						<div class="help-content">
							<div class="help-section">
								<h6>🌱 O que está acontecendo?</h6>
								<p>{{ modalConteudo.situacao }}</p>
							</div>

							<div class="help-section">
								<h6>❌ O que pode acontecer se não agirmos?</h6>
								<ul class="help-list">
									<li v-for="(item, index) in modalConteudo.consequencias" :key="'cons-' + index">{{ item }}</li>
								</ul>
							</div>

							<div class="help-section">
								<h6>✅ O que podemos fazer?</h6>
								<ol class="help-list">
									<li v-for="(item, index) in modalConteudo.acoes" :key="'acao-' + index">{{ item }}</li>
								</ol>
							</div>

							<div class="alert alert-info"><strong>Dica do Professor:</strong> {{ modalConteudo.dica }}</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-success" data-bs-dismiss="modal">Entendi!</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import * as bootstrap from "bootstrap";

export default {
	props: ["previsoes", "rmse"],
	data() {
		return {
			ajudaModal: null,
			modalTitulo: "",
			modalConteudo: null,
			currentPage: 1,
			pageSize: 100,
			tableTooltips: [],
		};
	},
	mounted() {
		this.initTooltips();
		this.ajudaModal = new bootstrap.Modal(document.getElementById("ajudaModal"));
	},
	beforeUnmount() {
		this.destroyTooltips();
		if (this.ajudaModal) {
			this.ajudaModal.dispose();
			this.ajudaModal = null;
		}
	},
	watch: {
		previsoes: {
			immediate: true,
			handler() {
				this.currentPage = 1;
				this.$nextTick(() => this.initTooltips());
			},
		},
		currentPage() {
			this.$nextTick(() => this.initTooltips());
		},
	},
	methods: {
		destroyTooltips() {
			this.tableTooltips.forEach((tooltip) => tooltip.dispose());
			this.tableTooltips = [];
		},
		initTooltips() {
			this.destroyTooltips();
			const tooltipTriggerList = [].slice.call(
				this.$el ? this.$el.querySelectorAll('[data-bs-toggle="tooltip"]') : []
			);
			tooltipTriggerList.forEach((tooltipTriggerEl) => {
				const tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
				this.tableTooltips.push(tooltip);
			});
		},
		formatValue(value) {
			if (value === null || value === undefined || value === "") return "N/A";
			const num = parseFloat(value);
			return isNaN(num) ? "N/A" : num.toFixed(2);
		},
		formatDataBR(dataString) {
			if (!dataString) return "N/A";
			const date = new Date(dataString);
			if (isNaN(date)) return dataString;
			const dia = String(date.getDate()).padStart(2, "0");
			const mes = String(date.getMonth() + 1).padStart(2, "0");
			const ano = date.getFullYear();
			return `${dia}/${mes}/${ano}`;
		},
		rowClass(p) {
			if (p.temperatura_prevista > 40) return "alerta-alto";
			if (p.temperatura_prevista < 10) return "alerta-baixo";
			if (p.umidade_prevista < 30) return "umidade-baixa";
			return "";
		},
		setPage(page) {
			if (page < 1 || page > this.totalPages) return;
			this.currentPage = page;
		},
		nextPage() {
			this.setPage(this.currentPage + 1);
		},
		prevPage() {
			this.setPage(this.currentPage - 1);
		},
		showAjuda(tipo) {
			const conteudo = {
				alta: {
					titulo: "⚠️ Temperatura Muito Alta!",
					conteudo: {
						situacao: "Quando a temperatura passa de 40°C, as plantas podem sofrer muito! Isso é chamado de 'estresse térmico'.",
						consequencias: ["As folhas podem murchar e secar rapidamente", "As plantas podem parar de crescer", "Em casos graves, as plantas podem morrer"],
						acoes: [
							"Aumentar a ventilação da horta",
							"Criar sombra temporária com telas",
							"Verificar se o sistema de irrigação está funcionando",
							"Regar as plantas nas horas mais frescas do dia",
						],
						dica: "Converse com seu professor! Ele vai te ajudar a entender melhor como cuidar das plantas nessa situação.",
					},
				},
				baixa: {
					titulo: "🧊 Temperatura Muito Baixa!",
					conteudo: {
						situacao: "Quando a temperatura cai abaixo de 10°C, as plantas podem sofrer com o frio! Isso pode prejudicar seu crescimento.",
						consequencias: ["As plantas podem parar de crescer", "As folhas podem ficar amareladas", "Algumas plantas podem não sobreviver ao frio intenso"],
						acoes: [
							"Proteger a horta com cobertura plástica",
							"Evitar regar as plantas no período mais frio do dia",
							"Verificar se há correntes de ar frio diretas",
							"Usar palha ou cobertura morta para proteger o solo",
						],
						dica: "Algumas plantas são mais sensíveis ao frio que outras. Pergunte ao seu professor quais plantas precisam de mais cuidados!",
					},
				},
				umidade: {
					titulo: "💧 Umidade Muito Baixa!",
					conteudo: {
						situacao: "Quando a umidade fica abaixo de 30%, as plantas podem ficar desidratadas! Elas precisam de água para viver.",
						consequencias: ["As plantas podem murchar", "O crescimento pode ficar mais lento", "As folhas podem ficar secas e quebradiças"],
						acoes: [
							"Verificar o sistema de irrigação",
							"Regar as plantas com mais frequência",
							"Usar cobertura morta para manter a umidade do solo",
							"Borrifar água nas folhas em dias muito secos",
						],
						dica: "A umidade do ar e do solo são diferentes! Aprenda com seu professor como medir cada uma delas.",
					},
				},
			};

			const info = conteudo[tipo];
			this.modalTitulo = info.titulo;
			this.modalConteudo = info.conteudo;
			this.ajudaModal.show();
		},
	},
	computed: {
		totalRegistros() {
			return Array.isArray(this.previsoes) ? this.previsoes.length : 0;
		},
		totalPages() {
			return this.totalRegistros === 0
				? 1
				: Math.ceil(this.totalRegistros / this.pageSize);
		},
		paginatedPrevisoes() {
			const inicio = (this.currentPage - 1) * this.pageSize;
			return (this.previsoes || []).slice(inicio, inicio + this.pageSize);
		},
		pageStart() {
			if (this.totalRegistros === 0) return 0;
			return (this.currentPage - 1) * this.pageSize + 1;
		},
		pageEnd() {
			return Math.min(this.currentPage * this.pageSize, this.totalRegistros);
		},
	},
};
</script>

<style scoped>
.card-title {
	color: #2e7d32;
	font-weight: 600;
}
.legend {
	gap: 1rem;
	font-size: 0.95rem;
	color: #2e7d32;
}
.legend-item {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.25rem 0.6rem;
	border-radius: 8px;
	background: rgba(245, 253, 245, 0.9);
	border: 1px solid rgba(46, 125, 50, 0.06);
}
.legend-icon {
	font-size: 1.05rem;
}
.legend-text {
	font-weight: 600;
	color: #274a23;
}
.alerta-alto {
	background-color: rgba(255, 243, 224, 0.95) !important;
	color: #bf360c;
	font-weight: 600;
	border-left: 4px solid #bf360c;
}
.alerta-alto > td:first-child {
	position: relative;
	padding-left: 2rem;
}
.alerta-alto > td:first-child::before {
	content: "⚠️";
	position: absolute;
	left: 0.45rem;
	top: 50%;
	transform: translateY(-50%);
}
.alerta-baixo {
	background-color: rgba(237, 247, 237, 0.98) !important;
	color: #1b5e20;
	font-weight: 600;
	border-left: 4px solid #1b5e20;
}
.alerta-baixo > td:first-child {
	position: relative;
	padding-left: 2rem;
}
.alerta-baixo > td:first-child::before {
	content: "🧊";
	position: absolute;
	left: 0.45rem;
	top: 50%;
	transform: translateY(-50%);
}
.umidade-baixa {
	background-color: rgba(232, 245, 233, 0.98) !important;
	color: #2e7d32;
	font-weight: 600;
	border-left: 4px solid #4caf50;
}
.umidade-baixa > td:first-child {
	position: relative;
	padding-left: 2rem;
}
.umidade-baixa > td:first-child::before {
	content: "💧";
	position: absolute;
	left: 0.45rem;
	top: 50%;
	transform: translateY(-50%);
}
.table th,
.table td {
	vertical-align: middle;
}
.table-striped tbody tr:nth-of-type(odd) {
	background-color: rgba(76, 175, 80, 0.05);
}
.table-hover tbody tr:hover {
	background-color: rgba(46, 125, 50, 0.1);
}
.table thead {
	background-color: #2e7d32;
	color: white;
}
thead th[data-bs-toggle="tooltip"] {
	cursor: help;
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

.help-content {
	padding: 0.75rem;
}

.help-section {
	margin-bottom: 1.5rem;
}

.help-section h6 {
	color: #2e7d32;
	font-size: 1.15rem;
	margin-bottom: 0.75rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	border-bottom: 2px solid #e8f5e9;
	padding-bottom: 0.5rem;
}

.help-section p {
	font-size: 1rem;
	line-height: 1.5;
	color: #1b5e20;
	margin-bottom: 0.75rem;
}

.help-list,
.help-list.help-list-numbered {
	margin: 0 0 0.5rem 0;
	padding-left: 1.25rem;
	list-style-type: disc;
}

.help-list li {
	margin-bottom: 0.5rem;
	line-height: 1.4;
	color: #1b5e20;
	font-size: 1rem;
	padding-left: 0.25rem;
}

.help-list li::marker {
	color: #4caf50;
}

.help-content .alert-info {
	background-color: #e8f5e9;
	border: none;
	border-left: 4px solid #4caf50;
	color: #1b5e20;
	border-radius: 0.5rem;
	padding: 1rem;
	margin-top: 1rem;
}

.modal-header {
	background-color: #2e7d32;
	color: white;
	border-bottom: none;
	border-radius: 0.5rem 0.5rem 0 0;
	padding: 1rem 1.5rem;
}

.modal-title {
	font-size: 1.25rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.modal-content {
	border: none;
	border-radius: 0.5rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	max-height: 90vh;
}

			.modal-dialog-scrollable .modal-body {
			overflow-y: auto;
			max-height: calc(90vh - 120px);
		}

.modal-footer {
	border-top: 1px solid rgba(46, 125, 50, 0.1);
	padding: 1rem 1.5rem;
}

.btn-success {
	background-color: #2e7d32;
	border-color: #2e7d32;
	padding: 0.5rem 1.5rem;
	font-weight: 600;
}

.btn-success:hover {
	background-color: #1b5e20;
	border-color: #1b5e20;
}

.btn-close-white {
	filter: brightness(0) invert(1);
}

.pagination-footer {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding-top: 1rem;
	margin-top: 1rem;
	border-top: 1px solid rgba(46, 125, 50, 0.1);
	background: rgba(248, 249, 250, 0.6);
	border-radius: 0.75rem;
	padding: 1rem;
}

@media (min-width: 768px) {
	.pagination-footer {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
}

.pagination-info {
	font-size: 0.95rem;
	color: #274a23;
}

.pagination-controls {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.pagination-controls .btn {
	min-width: 110px;
}

.pagination-status {
	font-weight: 600;
	color: #2e7d32;
}
</style>
