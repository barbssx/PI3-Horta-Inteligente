<template>
	<div class="card">
		<h4>{{ title }}</h4>
		<p :style="{ color: valueColor }">{{ formattedValue }}</p>
	</div>
</template>

<script>
export default {
	name: "MetricCard",
	props: {
		title: {
			type: String,
			required: true,
		},
		value: {
			type: [String, Number],
			required: true,
		},
		valueColor: {
			type: String,
			default: "#555",
		},
	},
	computed: {
		formattedValue() {
			if (this.value === undefined || this.value === null) {
				return "N/A";
			}
			if (typeof this.value === "number") {
				return this.value.toFixed(2);
			}
			return this.value;
		},
	},
};
</script>

<style scoped>
.card {
	background-color: #fff;
	padding: 20px;
	border-radius: 8px;
	text-align: center;
	width: 180px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

h3 {
	color: #333;
	margin-bottom: 10px;
}

p {
	font-size: 1.5rem;
	font-weight: bold;
	color: #555;
}
</style>
