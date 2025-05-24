<template>
	<div class="row">
		<div class="max-w-md mx-auto p-4 border rounded-lg shadow bg-green-50">
			<h2 class="text-xl font-bold mb-4 text-green-800">Importar Arquivo de Dados</h2>

			<input ref="fileInput" type="file" @change="handleFileChange" class="mb-4" />

			<button
				@click="enviarArquivo"
				:disabled="!file"
				class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Enviar para o banco de dados
			</button>

			<p v-if="mensagem" class="mt-4 text-sm text-green-700">{{ mensagem }}</p>
		</div>
	</div>
</template>

<script>
import { uploadArquivo } from "@/services/uploadService";

export default {
	data() {
		return {
			file: null,
			mensagem: "",
		};
	},
	methods: {
		handleFileChange(event) {
			this.file = event.target.files[0];
			this.mensagem = "";
		},
		async enviarArquivo() {
			if (!this.file) return;

			try {
				const formData = new FormData();
				formData.append("file", this.file);

				const response = await uploadArquivo(formData);
				this.mensagem = response.data.message || "Arquivo enviado com sucesso!";

				this.$emit("upload-sucesso");
				this.file = null;
				this.$refs.fileInput.value = "";
			} catch (error) {
				console.error(error);
				this.mensagem = "Erro ao enviar o arquivo.";
			}
		},
	},
};
</script>
