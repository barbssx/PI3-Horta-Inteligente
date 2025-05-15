<template>
	<div class="container">
		<div class="upload-container">
			<h2>Enviar arquivo de dados</h2>
			<input type="file" @change="handleFile" accept=".csv, .xlsx" ref="fileInput" />
			<p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
		</div>
		<div class="limpar-input">
			<button class="btn btn-danger" @click="clearInput" :disabled="!fileSelected">Limpar</button>
		</div>
	</div>
</template>

<script>
import { parseCsvFile, parseXlsxFile } from "@/services/fileReader";

export default {
	name: "UploadFile",
	emits: ["file-read", "clear-input"],
	data() {
		return {
			fileSelected: false,
			errorMessage: "",
		};
	},
	methods: {
		clearInput() {
			this.$refs.fileInput.value = null;
			this.fileSelected = false;
			this.errorMessage = "";
			this.$emit("clear-input"); 
		},
		handleFile(event) {
			const file = event.target.files[0];
			if (file) {
				this.errorMessage = ""; 
				const reader = new FileReader();

				if (file.name.endsWith(".csv")) {
					reader.onload = (e) => {
						try {
							const content = e.target.result;
							const parsedData = parseCsvFile(content);
							this.$emit("file-read", parsedData);
							this.fileSelected = true; 
						} catch (error) {
							this.errorMessage = "Erro ao processar o arquivo CSV.";
						}
					};
					reader.readAsText(file);
				} else if (file.name.endsWith(".xlsx")) {
					reader.onload = (e) => {
						try {
							const content = e.target.result;
							const parsedData = parseXlsxFile(content);
							this.$emit("file-read", parsedData); 
							this.fileSelected = true;
						} catch (error) {
							this.errorMessage = "Erro ao processar o arquivo XLSX.";
						}
					};
					reader.readAsArrayBuffer(file);
				} else {
					this.errorMessage = "Por favor, envie um arquivo CSV ou XLSX.";
				}
			}
		},
	},
};
</script>

<style scoped>
.upload-container {
	padding: 20px;
	text-align: center;
}

input[type="file"] {
	margin-top: 10px;
}

.container {
	width: 90%;
	margin: 50px auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.error-message {
	color: red;
	font-size: 1rem;
	margin-top: 10px;
}

.limpar-input button:disabled {
	background-color: #ccc;
	cursor: not-allowed;
}
</style>
