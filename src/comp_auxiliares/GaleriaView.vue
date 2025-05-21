<template>
	<div class="flex flex-col items-center mt-10">
		<div class="relative flex items-center justify-center" style="max-width: 500px; width: 100%; margin: 0 auto">
			<button
				@click="voltar"
				class="text-gray-700 hover:text-gray-900"
				style="background: none; border: none; padding: 0; font-size: 2rem; cursor: pointer; z-index: 10; transform: translateY(-50px)"
				aria-label="Anterior"
			>
				◀
			</button>

			<img :src="fotos[currentIndex].src" :alt="fotos[currentIndex].legenda" style="max-width: 400px; max-height: 400px; object-fit: contain; margin: 0 10px" />

			<button
				@click="avancar"
				class="text-gray-700 hover:text-gray-900"
				style="background: none; border: none; padding: 0; font-size: 2rem; cursor: pointer; z-index: 10; transform: translateY(-50px)"
				aria-label="Próximo"
			>
				▶
			</button>
		</div>

		<p class="text-center max-w-[560px] text-gray-700 font-semibold text-lg px-2" :style="{ marginTop: '8px' }">
			{{ fotos[currentIndex].legenda }}
		</p>
	</div>
</template>

<script>
export default {
	name: "GaleriaView",
	data() {
		return {
			currentIndex: 0,
			fotos: [
				{
					src: new URL("@/assets/Componente3.jpg", import.meta.url).href,
					legenda: "Montagem inicial da composteira já com sensores.",
				},
				{
					src: new URL("@/assets/Componente2.jpg", import.meta.url).href,
					legenda: "Visualização da placa Arduino conectada.",
				},
				{
					src: new URL("@/assets/Componente1.jpg", import.meta.url).href,
					legenda: "Sensores de temperatura e umidade posicionados no composto.",
				},
				{
					src: new URL("@/assets/Componente1.jpg", import.meta.url).href,
					legenda: "Sensores de temperatura e umidade posicionados no composto.",
				},
				{
					src: new URL("@/assets/Componente4.jpg", import.meta.url).href,
					legenda: "Local da horta.",
				},
				{
					src: new URL("@/assets/Componente5.jpg", import.meta.url).href,
					legenda: "Local da horta.",
				},
				{
					src: new URL("@/assets/Componente6.jpg", import.meta.url).href,
					legenda: "Local da horta.",
				},
				{
					src: new URL("@/assets/Componente7.jpg", import.meta.url).href,
					legenda: "Sensores.",
				},
			],
		};
	},
	methods: {
		avancar() {
			this.currentIndex = (this.currentIndex + 1) % this.fotos.length;
		},
		voltar() {
			this.currentIndex = (this.currentIndex - 1 + this.fotos.length) % this.fotos.length;
		},
	},
};
</script>
<style scoped></style>
