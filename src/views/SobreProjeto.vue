<template>
	<button class="btn-voltar" @click="$router.back()">
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
			<path d="M15 18l-6-6 6-6" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		<span>Voltar</span>
	</button>
	<div class="max-w-5xl mx-auto p-6">
		<h1 class="text-3xl font-bold text-center text-green-700 mb-10 animate-fade-in">🌱 Sobre o Projeto</h1>

		<div class="tabs-custom">
			<button v-for="(tab, index) in tabs" :key="index" @click="activeTab = index" :class="['tab-btn', { active: activeTab === index }]">
				{{ tab.title }}
			</button>
		</div>

		<div class="tabs-content-container bg-white p-6 rounded-xl shadow-lg text-gray-700 transition-all duration-300 border border-gray-200">
			<div v-if="tabs[activeTab].template">
				<component :is="tabs[activeTab].template"></component>
			</div>
			<div v-else v-html="tabs[activeTab].content"></div>

			<div v-if="tabs[activeTab].image" class="mt-6">
				<img :src="tabs[activeTab].image" alt="Esquema de sensores" class="rounded-lg shadow-md w-full max-h-96 object-contain" />
			</div>
		</div>
	</div>
</template>

<script>
import VisualizacaoTab from "@/comp_auxiliares/VisualizacaoTab.vue";
import GaleriaView from "@/comp_auxiliares/GaleriaView.vue";

export default {
	name: "SobreProjeto",
	components: { VisualizacaoTab, GaleriaView },
	data() {
		return {
			activeTab: 0,
			tabs: [
				{
					title: "Objetivo",
					content: `
            <p>Este projeto visa <strong>monitorar uma composteira</strong> com sensores de temperatura e umidade, garantindo condições ideais para decomposição orgânica.</p>
          `,
				},
				{
					title: "Componentes",
					content: `
            <ul style="list-style: none">
              <li>✅ <span class="font-medium">Arduino Nano</span></li>
              <li>✅ <span class="font-medium">Sensor de temperatura e umidade modelo DHT11</span></li>
              <li>✅ <span class="font-medium">Sensor de temperatura DS18B20</span></li>
              <li>✅ <span class="font-medium">Sensor de Umidade AM2320</span></li>
              <li>✅ <span class="font-medium">Módulo transceptor de dados NRF24L01</span></li>
              <li>✅ <span class="font-medium">Módulo RTC DS3231</span></li>
              <li>✅ <span class="font-medium">Cartão SD</span></li>
            </ul>
          `,
				},
				{
					title: "Coleta de Dados",
					content: `
            <p>Os dados são coletados a cada 15 minutos e salvos no cartão SD em formato CSV, com data, hora, temperatura e umidade.</p>
          `,
				},
				{
					title: "Visualização",
					template: "VisualizacaoTab",
				},
				{
					title: "Esquema de Ligação",
					content: `
            <p>O diagrama abaixo mostra como os sensores estão conectados ao Arduino:</p>
          `,
					image: require("@/assets/Imagem2.png"),
				},
				{
					title: "Galeria",
					template: "GaleriaView",
				},
			],
		};
	},
};
</script>

<style scoped>
.animate-fade-in {
	animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-8px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.tabs-custom {
	display: flex;
	justify-content: space-evenly;
	border-bottom: 2px solid #e5e7eb;
	margin-bottom: 1.5rem;
}

.tab-btn {
	background: none;
	border: none;
	outline: none;
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	font-weight: 500;
	color: #374151;
	cursor: pointer;
	position: relative;
	transition: color 0.2s;
}

.tab-btn:not(:last-child) {
	margin-right: 0.5rem;
}

.tab-btn.active {
	color: #047857;
}

.tab-btn.active::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: -2px;
	height: 3px;
	background: linear-gradient(90deg, #34d399, #047857);
	border-radius: 2px 2px 0 0;
}

.tab-btn:hover {
	color: #059669;
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

.tabs-content-container {
	max-width: 720px;
	margin: 20px auto;
	padding: 1.5rem 1rem;
	border-radius: 1rem;
	box-shadow: 0 10px 15px rgb(0 0 0 / 0.1);
	border: 1px solid #e5e7eb;
	background: #fff;
	transition: all 0.3s ease;
}
</style>
