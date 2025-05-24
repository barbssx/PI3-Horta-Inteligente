<template>
	<button class="btn-voltar" @click="$router.back()">
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
			<path d="M15 18l-6-6 6-6" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		<span>Voltar</span>
	</button>
	<div class="max-w-5xl mx-auto p-6">
		<h1 class="text-3xl font-bold text-center text-green-700 mb-10 animate-fade-in">🌱 Dashboard</h1>

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
import DashboardPage from "@/views/DashboardPage.vue";
import UploadPage from "@/comp_auxiliares/UploadPage.vue";

export default {
	name: "DashboardPrincipal",
	components: { DashboardPage, UploadPage },
	data() {
		return {
			activeTab: 0,
			tabs: [
				{
					title: "Dashboard",
					template: "DashboardPage",
				},
				{
					title: "Upload",
					template: "UploadPage",
				},
			],
		};
	},
};
</script>
<style scoped>
.tabs-content-container {
	max-width: 90%;
	margin: 20px auto;
	padding: 1.5rem 1rem;
	border-radius: 1rem;
	box-shadow: 0 10px 15px rgb(0 0 0 / 0.1);
	border: 1px solid #e5e7eb;
	background: #fff;
	transition: all 0.3s ease;
}
</style>
