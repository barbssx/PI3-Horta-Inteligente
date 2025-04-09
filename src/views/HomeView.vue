<template>
	<div>
		<UploadFile @file-read="processFile" />

		<div v-if="processedData.length">
			<TemperatureCard :tempMax="tempMax" :tempMin="tempMin" :tempMed="tempMed" />
			<DashboardView :data="processedData" />
		</div>
	</div>
</template>

<script>
import DashboardView from "@/components/DashboardView.vue";
import TemperatureCard from "@/components/TemperatureCard.vue";
import UploadFile from "@/components/UploadFile.vue";
import { parseFile } from "@/services/fileReader";

export default {
	name: "HomeView",
	components: { DashboardView, UploadFile, TemperatureCard },
	data() {
		return {
			processedData: [],
		};
	},
	methods: {
		processFile(fileContent) {
			this.processedData = parseFile(fileContent);
		},
	},
	computed: {
		tempMax() {
			if (!this.processedData.length) return 0;
			return Math.max(...this.processedData.map((d) => d.temperature));
		},
		tempMin() {
			if (!this.processedData.length) return 0;
			return Math.min(...this.processedData.map((d) => d.temperature));
		},
		tempMed() {
			if (!this.processedData.length) return 0;
			const sum = this.processedData.reduce((total, d) => total + d.temperature, 0);
			return (sum / this.processedData.length).toFixed(2);
		},
	},
};
</script>
