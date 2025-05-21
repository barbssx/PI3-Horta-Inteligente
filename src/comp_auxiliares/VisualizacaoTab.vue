<template>
	<div>
		<p>O arquivo CSV pode ser carregado na dashboard, que exibe gráficos e indicadores para análise das condições da composteira.</p>
		<router-link to="/dashboard" class="btn-acessar">Acessar Dashboard</router-link>
	</div>
</template>

<script>
export default {
	name: "VisualizacaoTab",
};
</script>

<style scoped>
.btn-acessar {
	display: inline-block;
	margin-top: 1rem;
	padding: 0.5rem 1rem;
	background-color: #047857;
	color: white;
	text-decoration: none;
	border-radius: 0.375rem;
	transition: background-color 0.3s;
}
.btn-acessar:hover {
	background-color: #065f46;
}
</style>
