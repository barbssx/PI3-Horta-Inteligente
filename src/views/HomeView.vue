<template>
	<div class="home-container">
		<section class="hero animate-fade-in">
			<h1 class="title">Projeto Horta Escolar Inteligente</h1>
			<p class="subtitle">Integrando tecnologia ao ambiente escolar com sensores de temperatura e umidade na composteira.</p>
		</section>

		<section class="about animate-slide-up">
			<h2>Sobre o Projeto</h2>
			<p>
				Este projeto utiliza Arduino e sensores ambientais para monitorar a horta escolar, promovendo a educação ambiental e o uso de tecnologias na escola. Os
				dados coletados auxiliam no controle da compostagem, melhorando a sustentabilidade e o aprendizado prático dos alunos.
			</p>
		</section>

		<section class="goals animate-slide-up">
			<h2>Objetivos</h2>
			<ul>
				<li>🌱 Integrar conhecimentos de tecnologia, meio ambiente e educação.</li>
				<li>🌡️ Monitorar a temperatura e umidade da composteira em tempo real.</li>
				<li>♻️ Incentivar boas práticas sustentáveis dentro do ambiente escolar.</li>
			</ul>
		</section>

		<section class="access animate-fade-in">
			<router-link to="/dashboard" class="btn-acessar">Acessar Dashboard</router-link>
		</section>
	</div>
</template>

<script>
export default {
	name: "HomeView",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");

.home-container {
	max-width: 850px;
	margin: 0 auto;
	padding: 2rem;
	font-family: "Poppins", sans-serif;
	color: #333;
}

.hero {
	text-align: center;
	margin-bottom: 2rem;
}

.title {
	margin: 0;
	font-size: 2.8rem;
	font-weight: 700;
	color: #2e7d32;
}

.subtitle {
	font-size: 1.2rem;
	margin-top: 0.5rem;
	color: #555;
}

.about,
.goals {
	margin-top: 2rem;
}

.about h2,
.goals h2 {
	font-size: 1.6rem;
	color: #2e7d32;
	margin-bottom: 0.5rem;
	font-weight: 600;
}

.about p,
.goals ul {
	font-size: 1rem;
	line-height: 1.7;
}

.goals ul {
	padding-left: 1.5rem;
}

.goals li {
	margin-bottom: 0.5rem;
	list-style-type: none;
}

.access {
	text-align: center;
	margin-top: 3rem;
}

.btn-acessar {
	display: inline-block;
	background-color: #2e7d32;
	color: white;
	padding: 0.9rem 1.6rem;
	border-radius: 10px;
	text-decoration: none;
	font-weight: 600;
	font-size: 1rem;
	transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-acessar:hover {
	background-color: #1b5e20;
	transform: scale(1.05);
}

@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slide-up {
	from {
		opacity: 0;
		transform: translateY(40px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
	animation: slide-up 1s ease-out;
}
</style>
