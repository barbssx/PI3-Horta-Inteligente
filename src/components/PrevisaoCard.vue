<template>
	<div class="col-md-4">
		<div class="card shadow-sm text-center p-4 previsao-card" :class="[tipoClass, { 'alerta-alto': isAlto, 'alerta-baixo': isBaixo }]">
			<div class="icon mb-2">{{ icon }}</div>
			<h5 class="title mb-2">{{ title }}</h5>

			<p :class="{ 'mb-0': !shouldShowPrev }">
				<span v-if="shouldShowPrev">Real: </span>
				<strong class="valor-real"
					>{{ real }}<span v-if="unidade">{{ unidade }}</span></strong
				>
			</p>

			<p v-if="shouldShowPrev">
				Prevista:
				<strong class="valor-prev"
					>{{ prev }}<span v-if="unidade">{{ unidade }}</span></strong
				>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: { type: String, required: true },
		real: { type: [Number, String], required: true },
		prev: { type: [Number, String], required: true },
		icon: { type: String, default: "📊" },
		unidade: { type: String, default: "" },
	},
	computed: {
		isAlto() {
			return this.title.toLowerCase().includes("temperatura") && this.prev > 40;
		},
		isBaixo() {
			return this.title.toLowerCase().includes("temperatura") && this.prev < 10;
		},
		tipoClass() {
			if (this.title.toLowerCase().includes("temperatura")) return "card-temp";
			if (this.title.toLowerCase().includes("umidade")) return "card-umi";
			if (this.title.toLowerCase().includes("acurácia")) return "card-acuracia";
			if (this.title.toLowerCase().includes("total") || this.title.toLowerCase().includes("registros")) return "card-total";
			return "";
		},
		shouldShowPrev() {
			if (this.title.toLowerCase().includes("acurácia")) return false;
			if (this.title.toLowerCase().includes("total") || this.title.toLowerCase().includes("registros")) return false;
			return String(this.prev).length > 0;
		},
	},
};
</script>

<style scoped>
.previsao-card {
	border-radius: 15px;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
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

.valor-prev {
	color: #ff6b6b;
	font-weight: 600;
}

.card-temp {
	background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
}
.card-umi {
	background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}
.card-total {
	background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
}
.card-acuracia {
	background: linear-gradient(135deg, #b2fefd 0%, #a6d9e0 100%); /* Estilo para RMSE */
}

.alerta-alto {
	border-left: 6px solid #ff3b3b !important;
	background-color: #fff5f5 !important;
}
.alerta-baixo {
	border-left: 6px solid #4d9de0 !important;
	background-color: #f0f8ff !important;
}

p {
	margin: 0.2rem 0;
}
</style>
