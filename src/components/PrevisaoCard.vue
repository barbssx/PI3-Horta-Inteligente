<template>
	<div class="col-6 col-lg-3 mb-4">
		<div
			class="card shadow-sm text-center p-4 previsao-card h-100 d-flex flex-column"
			:class="[tipoClass, { 'alerta-alto': isAlto, 'alerta-baixo': isBaixo }]"
			data-bs-toggle="tooltip"
			data-bs-placement="top"
			:title="descricaoCompleta"
		>
			<div class="icon mb-2">{{ icon }}</div>
			<h5 class="title mb-3">{{ title }}</h5>

			<div class="mt-auto">
				<div v-if="!shouldShowPrev">
					<h3 class="display-5 fw-bold valor-real mb-0">
						{{ real }}<small class="h6" v-if="unidade">{{ unidade }}</small>
					</h3>
					<div class="status-indicator mt-2">
						{{ statusDescricao }}
					</div>
					<div v-if="tendencia" class="tendencia mt-1">
						{{ tendencia }}
					</div>
					<small v-if="timestamp" class="text-muted d-block mt-2"> Última atualização: {{ timestamp }} </small>
				</div>

				<div v-else>
					<p class="mb-1">
						Real: <strong class="valor-real">{{ real }}{{ unidade }}</strong>
					</p>
					<p>
						Prevista: <strong class="valor-prev">{{ prev }}{{ unidade }}</strong>
					</p>
					<div class="status-indicator mt-2">
						{{ statusDescricao }}
					</div>
					<div v-if="tendencia" class="tendencia mt-1">
						{{ tendencia }}
					</div>
					<small v-if="timestamp" class="text-muted d-block mt-2"> Última atualização: {{ timestamp }} </small>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import * as bootstrap from "bootstrap";

export default {
	props: {
		title: { type: String, required: true },
		real: { type: [Number, String], required: true },
		prev: { type: [Number, String], required: true },
		icon: { type: String, default: "📊" },
		unidade: { type: String, default: "" },
		descricao: { type: String, default: "" },
		timestamp: { type: String, default: "" },
	},
	mounted() {
		this.initTooltip();
	},
	updated() {
		this.initTooltip();
	},
	beforeUnmount() {
		this.destroyTooltip();
	},
	methods: {
		initTooltip() {
			this.destroyTooltip();
			const element = this.$el.querySelector('[data-bs-toggle="tooltip"]');
			if (element) {
				this.tooltip = new bootstrap.Tooltip(element);
			}
		},
		destroyTooltip() {
			if (this.tooltip) {
				this.tooltip.dispose();
				this.tooltip = null;
			}
		},
	},
	computed: {
		isAlto() {
			const valor = parseFloat(this.real);
			if (this.title.toLowerCase().includes("temperatura")) {
				return valor > 65;
			}
			if (this.title.toLowerCase().includes("umidade")) {
				return valor > 60;
			}
			return false;
		},
		isBaixo() {
			const valor = parseFloat(this.real);
			if (this.title.toLowerCase().includes("temperatura")) {
				return valor < 50;
			}
			if (this.title.toLowerCase().includes("umidade")) {
				return valor < 40;
			}
			return false;
		},
		statusDescricao() {
			const valor = parseFloat(this.real);

			if (this.title.toLowerCase().includes("temperatura")) {
				if (valor > 65) return "⚠️ Temperatura muito alta! Ideal: 50-65°C";
				if (valor < 50) return "❄️ Temperatura muito baixa! Ideal: 50-65°C";
				return "✅ Temperatura na faixa ideal (50-65°C)";
			}

			if (this.title.toLowerCase().includes("umidade")) {
				if (valor > 60) return "💧 Umidade muito alta! Ideal: 40-60%";
				if (valor < 40) return "🏜️ Umidade muito baixa! Ideal: 40-60%";
				return "✅ Umidade na faixa ideal (40-60%)";
			}

			if (this.title.toLowerCase().includes("acurácia")) {
				if (valor < 2) return "✨ Excelente precisão!";
				if (valor < 5) return "✅ Boa precisão";
				return "⚠️ Precisão moderada - considere retreinar o modelo";
			}

			return "";
		},
		tipoClass() {
			if (this.title.toLowerCase().includes("temperatura")) return "card-temp";
			if (this.title.toLowerCase().includes("previsão")) return "card-prev";
			if (this.title.toLowerCase().includes("umidade")) return "card-umi";
			if (this.title.toLowerCase().includes("acurácia")) return "card-acuracia";
			if (this.title.toLowerCase().includes("total") || this.title.toLowerCase().includes("registros")) return "card-total";
			return "";
		},
		shouldShowPrev() {
			return this.prev !== null && this.prev !== undefined && String(this.prev).length > 0;
		},
		tendencia() {
			if (!this.prev || !this.real) return null;
			const valorAtual = parseFloat(this.real);
			const valorAnterior = parseFloat(this.prev);
			const diff = valorAtual - valorAnterior;

			if (Math.abs(diff) < 0.1) return "➡️ Estável";
			return diff > 0 ? "⬆️ Subindo" : "⬇️ Descendo";
		},
		descricaoCompleta() {
			return `${this.descricao}\n${this.statusDescricao}${this.tendencia ? "\n" + this.tendencia : ""}`;
		},
	},
};
</script>

<style scoped>
.previsao-card[data-bs-toggle="tooltip"] {
	cursor: help;
}
.previsao-card {
	border-radius: 15px;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	justify-content: flex-start;
}
.previsao-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
.icon {
	font-size: 3rem;
}
.title {
	font-weight: 600;
	font-size: 1.15rem;
}
.valor-real {
	color: #0d3b66;
	font-weight: 600;
}
.valor-real small {
	vertical-align: top;
	font-weight: 500;
	margin-left: 4px;
	font-size: 1.1rem;
	color: #333;
}
.valor-prev {
	color: #ff6b6b;
	font-weight: 600;
}
.card-temp {
	background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
}
.card-prev {
	background: linear-gradient(135deg, #ffd3a1 0%, #ffc2a1 100%);
}
.card-umi {
	background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}
.card-total {
	background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
}
.card-acuracia {
	background: linear-gradient(135deg, #b2fefd 0%, #a6d9e0 100%);
}
.alerta-alto {
	border: 3px solid #dc3545 !important;
}
.alerta-baixo {
	border: 3px solid #007bff !important;
}
p {
	margin: 0.2rem 0;
}

.status-indicator {
	font-size: 0.9rem;
	font-weight: 500;
}

.tendencia {
	font-size: 0.9rem;
	color: #666;
}

.text-muted {
	font-size: 0.8rem;
}
</style>
