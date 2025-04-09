<template>
	<div class="cards-container">
		<div class="card">
			<h3>Temperatura Máxima</h3>
			<p>{{ tempMax }}</p>
		</div>
		<div class="card">
			<h3>Temperatura Mínima</h3>
			<p>{{ tempMin }}</p>
		</div>
		<div class="card">
			<h3>Temperatura Média</h3>
			<p>{{ tempMed }}</p>
		</div>
	</div>
</template>
<script>
export default {
	name: "TemperatureCard",
	props: {
		tempMax: Number,
		tempMin: Number,
		tempMed: Number,
	},
};
</script>
<style scoped>
.cards-container {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-top: 20px;
}

.card {
	background-color: #f5f5f5;
	padding: 20px;
	border-radius: 8px;
	text-align: center;
	width: 150px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
