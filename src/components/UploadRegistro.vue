<template>
  <div class="max-w-md mx-auto p-4 border rounded-lg shadow">
    <h2 class="text-xl font-bold mb-4">Importar Arquivo de Dados</h2>
    
    <input type="file" @change="handleFileChange" class="mb-4" />
    
    <button
      @click="enviarArquivo"
      :disabled="!file"
      class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
    >
      Enviar para o banco de dados
    </button>

    <p v-if="mensagem" class="mt-4 text-sm text-blue-600">{{ mensagem }}</p>
  </div>
</template>

<script>
import { uploadArquivo } from '@/services/uploadService';

export default {
  data() {
    return {
      file: null,
      mensagem: '',
    };
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    async enviarArquivo() {
      try {
        const formData = new FormData();
        formData.append('file', this.file);

        const response = await uploadArquivo(formData);
        this.mensagem = response.data.message || 'Arquivo enviado com sucesso!';
      } catch (error) {
        console.error(error);
        this.mensagem = 'Erro ao enviar o arquivo.';
      }
    },
  },
};
</script>
