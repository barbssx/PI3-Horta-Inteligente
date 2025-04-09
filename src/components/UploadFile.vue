<template>
	<div class="upload-container">
		<h2>Enviar arquivo de dados</h2>
		<input type="file" @change="handleFile" accept=".txt" />
	</div>
</template>

<script>
export default {
	name: "UploadFile",
	emits: ["file-read"],
	methods: {
		handleFile(event) {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const content = e.target.result;
					this.$emit("file-read", content);
				};
				reader.readAsText(file);
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
</style>
