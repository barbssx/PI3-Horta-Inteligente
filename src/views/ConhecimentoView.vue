<template>
	<button class="btn-voltar" aria-label="Voltar para a página anterior" @click="$router.back()">
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
			<path d="M15 18l-6-6 6-6" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		<span>Voltar</span>
	</button>

	<div class="max-w-5xl mx-auto p-6">
		<h1 class="text-3xl font-bold text-center text-green-700 mb-10 animate-fade-in">📘 Conhecimentos</h1>

		<div class="tabs-custom" role="tablist">
			<button
				v-for="(tab, index) in tabs"
				:key="index"
				role="tab"
				:aria-selected="activeTab === index"
				:tabindex="activeTab === index ? 0 : -1"
				:id="'tab-' + index"
				:aria-controls="'tabpanel-' + index"
				@click="activeTab = index"
				:class="['tab-btn', { active: activeTab === index }]"
			>
				{{ tab.title }}
			</button>
		</div>

		<div
			v-for="(tab, index) in tabs"
			:key="'panel-' + index"
			role="tabpanel"
			:id="'tabpanel-' + index"
			:aria-labelledby="'tab-' + index"
			v-show="activeTab === index"
			class="tabs-content-container bg-white rounded-xl shadow-lg text-gray-700 transition-all duration-300 border border-gray-200 px-6 md:px-12 py-6"
		>
			<div v-html="tab.content"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "ConhecimentosView",
	data() {
		return {
			activeTab: 0,
			tabs: [
				{
					title: "Composteira",
					content: `
						<h2 class="text-xl font-semibold mb-2">🌿 O que é uma composteira?</h2>
						<p>Uma <strong>composteira</strong> transforma resíduos orgânicos em adubo por meio da decomposição. O monitoramento de <strong>temperatura</strong> e <strong>umidade</strong> é essencial para manter as condições ideais para os microrganismos responsáveis pelo processo.</p>
						<p class="mt-2">Esse processo reduz o lixo, ajuda o meio ambiente e pode ser aplicado em escolas, casas ou hortas comunitárias.</p>

						<h3 class="text-lg font-semibold mt-6 mb-2">🌱 Compostagem: O Que É e Por Que Importa</h3>
						<p>A compostagem é um processo natural de decomposição de resíduos orgânicos com controle de umidade, temperatura, oxigênio e nutrientes. Esses fatores favorecem a ação de fungos, bactérias e até minhocas, transformando restos orgânicos em composto: um material escuro, com cheiro de terra e rico em nutrientes, ideal para jardins, hortas e recuperação de solos.</p>

						<h3 class="text-lg font-semibold mt-6 mb-2">Como Separar os Resíduos</h3>
						<ul class="custom-list composteira-list" style="list-style: none">
							<li><strong>Orgânicos:</strong> restos de comida, folhas, galhos.</li>
							<li><strong>Recicláveis:</strong> papel, plástico, vidro e metal (devem ir para coleta seletiva).</li>
							<li><strong>Rejeitos:</strong> o que não pode ser reciclado ou compostado (vai para o lixo comum).</li>
						</ul>

						<h3 class="text-lg font-semibold mt-6 mb-2">Modelos de Compostagem</h3>
						<p><strong>🏡 Compostagem Domiciliar</strong><br>
						Pode ser feita em caixas empilhadas, com ou sem minhocas.</p>
						<ul class="custom-list composteira-list mb-4" style="list-style: none">
							<li>Com minhocas (minhocário): processo mais rápido, exige cuidado com o que é colocado.</li>
							<li>Sem minhocas (termofílica): aceita mais tipos de resíduos, mas o processo é mais lento.</li>
						</ul>
						<p>Essas soluções funcionam bem para pequenas quantidades de resíduos e são ideais para casas e apartamentos.</p>

						<p class="mt-4"><strong>🏢 Compostagem Coletiva</strong><br>
						Condomínios ou comunidades podem compartilhar o processo em pontos de entrega voluntária (PEVs) ou pátios de compostagem comunitários. Exige organização e colaboração entre moradores.</p>

						<p class="mt-4"><strong>🏭 Serviços de Compostagem</strong><br>
						Em algumas cidades, empresas oferecem coleta e compostagem para domicílios e grandes geradores (como restaurantes). Elas fornecem recipientes apropriados, fazem a coleta e devolvem adubo ou brindes aos clientes.</p>

						<h3 class="text-lg font-semibold mt-6 mb-2">Educação e Sustentabilidade</h3>
						<p>A compostagem educa para o cuidado com o meio ambiente, ensina sobre ciclos naturais e ajuda a reduzir o lixo que vai para aterros. Em escolas, é uma forma prática de abordar temas como biologia, química e cidadania ecológica.</p>

						<p class="mt-6 text-sm text-gray-500">Fonte: <a href="https://www.embrapa.br/hortalica-nao-e-so-salada/secoes/compostagem" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-900">Embrapa - Compostagem</a></p>
					`,
				},
				{
					title: "Arduino",
					content: `
						<h2 class="text-xl font-semibold mb-2">🔌 O que é Arduino?</h2>
						<p>O <strong>Arduino</strong> é uma plataforma eletrônica de código aberto que facilita o desenvolvimento de projetos com sensores, atuadores e dispositivos programáveis. É composta por uma placa microcontroladora e um ambiente de programação simples, que permite a qualquer pessoa — desde iniciantes até profissionais — criar soluções tecnológicas.</p>

						<h3 class="text-lg font-semibold mt-6 mb-2">Como estudar Arduino?</h3>
						<p>Para aprender Arduino, é importante seguir uma sequência lógica:</p>
						<ul class="custom-list arduino-list" style="list-style:none;">
							<li><strong>Entender os fundamentos da eletrônica básica:</strong> conceitos como tensão, corrente, resistores, LEDs, botões e sensores.</li>
							<li><strong>Conhecer a placa Arduino:</strong> suas partes, entradas/saídas digitais e analógicas, alimentação e comunicação.</li>
							<li><strong>Aprender a programar no Arduino IDE:</strong> uma linguagem baseada em C/C++, focada em leitura e controle de hardware.</li>
							<li><strong>Fazer projetos simples:</strong> como acender LEDs, ler sensores de luz, temperatura e umidade.</li>
							<li><strong>Estudar protocolos de comunicação:</strong> I2C, SPI, UART para conectar módulos e sensores mais avançados.</li>
							<li><strong>Explorar projetos mais complexos:</strong> controle de motores, displays, conexão com a internet e integração com outras plataformas.</li>
						</ul>

						<h3 class="text-lg font-semibold mt-6 mb-2">Onde encontrar material para aprender?</h3>
						<p>Existem diversos recursos gratuitos e pagos para estudar Arduino:</p>
						<ul class="custom-list arduino-list" style="list-style:none;">
							<li><a href="https://www.arduino.cc/en/Tutorial/HomePage" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-900">Tutoriais oficiais do Arduino</a> — ótimo ponto de partida.</li>
							<li>Vídeos e cursos online em plataformas como YouTube, Coursera e Udemy.</li>
							<li>Livros introdutórios sobre Arduino e eletrônica.</li>
							<li>Comunidades e fóruns para tirar dúvidas e trocar experiências.</li>
						</ul>

						<h3 class="text-lg font-semibold mt-6 mb-2">Aplicações do Arduino</h3>
						<p>O Arduino é amplamente utilizado em várias áreas, como:</p>
						<ul class="custom-list arduino-list" style="list-style:none;">
							<li><strong>Educação:</strong> ferramenta para ensinar eletrônica e programação de forma prática.</li>
							<li><strong>Automação residencial:</strong> controle de luzes, sensores de presença, sistemas de irrigação.</li>
							<li><strong>Robótica:</strong> construção de robôs móveis, braços robóticos, drones.</li>
							<li><strong>Monitoramento ambiental:</strong> coleta de dados de temperatura, umidade, qualidade do ar.</li>
							<li><strong>Projetos artísticos e interativos:</strong> instalações que respondem a movimentos ou sons.</li>
						</ul>

						<h3 class="text-lg font-semibold mt-6 mb-2">Arduino no nosso projeto</h3>
						<p>Neste projeto, usamos o Arduino para:</p>
						<ul class="custom-list arduino-list" style="list-style:none;">
							<li>Ler sensores de temperatura e umidade na composteira.</li>
							<li>Registrar esses dados para análise posterior.</li>
							<li>Possibilitar automações futuras, como alertas quando condições não forem ideais.</li>
						</ul>

						<p class="mt-6 text-sm text-gray-500">Fonte: <a href="https://www.arduino.cc/en/Guide/Introduction" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-900">Arduino - Guia Oficial</a> e materiais didáticos complementares.</p>
					`,
				},
				{
					title: "Sensores",
					content: `
						<h2 class="text-xl font-semibold mb-2">🔍 Sensores usados no projeto</h2>
						<p>Os sensores são dispositivos que capturam informações do ambiente físico para que possam ser processadas pelo Arduino.</p>

						<h3 class="text-lg font-semibold mt-6 mb-2">Tipos de sensores</h3>
						<ul class="custom-list sensores-list" style="list-style:none;">
							<li><strong>DS18B20:</strong> sensor digital de temperatura, de alta precisão e fácil conexão com Arduino.</li>
							<li><strong>AM2320:</strong> sensor digital que mede temperatura e umidade, ideal para ambientes internos.</li>
							<li><strong>DS3231 (RTC):</strong> relógio em tempo real usado para registrar a hora exata dos dados coletados.</li>
							<li><strong>Cartão SD:</strong> usado para armazenar os dados localmente no projeto embarcado.</li>
						</ul>

						<h3 class="text-lg font-semibold mt-6 mb-2">Como funcionam</h3>
						<p>Cada sensor tem um protocolo de comunicação diferente (OneWire para DS18B20, I2C para AM2320 e DS3231), que o Arduino precisa interpretar para obter as leituras corretas.</p>

						<h3 class="text-lg font-semibold mt-6 mb-2">Importância no projeto</h3>
						<p>Sem esses sensores, não seria possível monitorar as condições internas da composteira, dificultando o controle do processo e a coleta de dados para análises futuras.</p>

						<p class="mt-6 text-sm text-gray-500">Fonte: Documentação oficial dos sensores e tutoriais especializados.</p>
					`,
				},
				{
					title: "Análise de Dados",
					content: `
						<h2 class="text-xl font-semibold mb-2">📊 Análise de Dados</h2>
						<p>A análise de dados é fundamental para entender o comportamento da composteira ao longo do tempo, permitindo identificar padrões e ajustar processos.</p>

						<h3 class="text-lg font-semibold mt-6 mb-2">Ferramentas usadas</h3>
						<ul class="custom-list analise-list" style="list-style:none;">
							<li><strong>Vue.js:</strong> para construir a interface web responsiva e interativa.</li>
							<li><strong>Tailwind CSS:</strong> para estilização rápida e consistente.</li>
     					<li><strong>Vue.Charts (Chart.js):</strong> biblioteca de gráficos integrada ao Vue para criar visualizações interativas com os dados dos sensores.</li>
						</ul>

						<h3 class="text-lg font-semibold mt-6 mb-2">Benefícios da análise</h3>
						<ul class="custom-list analise-list" style="list-style:none;">
							<li>Monitorar condições ideais de temperatura e umidade.</li>
							<li>Detectar falhas ou irregularidades no processo.</li>
							<li>Gerar relatórios para apoiar decisões e melhorias.</li>
						</ul>

						<p class="mt-6 text-sm text-gray-500">Fonte: Conceitos de análise de dados aplicados a IoT e projetos ambientais.</p>
					`,
				},
				{
					title: "Benefícios Educacionais",
					content: `
						<h2 class="text-xl font-semibold mb-2">🎓 Benefícios Educacionais</h2>
						<p>O projeto promove a aprendizagem prática e interdisciplinar, aproximando conceitos teóricos da realidade.</p>

						<h3 class="text-lg font-semibold mt-6 mb-2">Áreas envolvidas</h3>
						<ul class="custom-list educacional-list" style="list-style:none;">
							<li><strong>Ciências Naturais:</strong> ecologia, microbiologia e sustentabilidade.</li>
							<li><strong>Matemática:</strong> análise e interpretação de dados.</li>
							<li><strong>Informática:</strong> programação, eletrônica e internet das coisas.</li>
							<li><strong>Educação Ambiental:</strong> práticas sustentáveis e cidadania.</li>
						</ul>

						<h3 class="text-lg font-semibold mt-6 mb-2">Resultados esperados</h3>
						<ul class="custom-list educacional-list" style="list-style:none;">
							<li>Maior engajamento dos alunos por meio de projetos práticos.</li>
							<li>Desenvolvimento de habilidades técnicas e críticas.</li>
							<li>Conscientização ambiental e responsabilidade social.</li>
						</ul>

						<p class="mt-6 text-sm text-gray-500">Fonte: Diretrizes educacionais para projetos interdisciplinares.</p>
					`,
				},
			],
		};
	},
};
</script>

<style scoped>
.btn-voltar {
	display: flex;
	align-items: center;
	gap: 6px;
	margin: 20px;
	color: #2e7d32;
	font-weight: 600;
	cursor: pointer;
	border: none;
	background: transparent;
	transition: color 0.3s ease;
}
.btn-voltar:hover {
	color: #1b4d20;
}

.tabs-custom {
	display: flex;
	justify-content: space-evenly;
	border-bottom: 2px solid #e5e7eb;
	margin-bottom: 1.5rem;
}
.tab-btn {
	background: none;
	border: none;
	outline: none;
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	font-weight: 500;
	color: #374151;
	cursor: pointer;
	position: relative;
	transition: color 0.2s;
}
.tab-btn:not(:last-child) {
	margin-right: 0.5rem;
}
.tab-btn.active {
	color: #047857;
}
.tab-btn.active::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: -2px;
	height: 3px;
	background: linear-gradient(90deg, #34d399, #047857);
	border-radius: 2px 2px 0 0;
}
.tab-btn:hover {
	color: #059669;
}

.tabs-content-container {
	max-width: 800px;
	margin: 20px auto;
	padding: 1.5rem 1rem;
	border-radius: 1rem;
	box-shadow: 0 10px 15px rgb(0 0 0 / 0.1);
	border: 1px solid #e5e7eb;
	background: #fff;
	transition: all 0.3s ease;
}

.custom-list.compsteira-list li::before {
	content: "🌿";
	margin-right: 8px;
}
.custom-list.arduino-list li::before {
	content: "🔌";
	margin-right: 8px;
}
.custom-list.sensores-list li::before {
	content: "🔍";
	margin-right: 8px;
}
.custom-list.analise-list li::before {
	content: "📊";
	margin-right: 8px;
}
.custom-list.educacional-list li::before {
	content: "🎓";
	margin-right: 8px;
}
.custom-list li {
	display: list-item;
	list-style: none;
	margin-bottom: 0.25rem;
	padding-left: 0.5rem;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
.animate-fade-in {
	animation: fadeIn 0.8s ease forwards;
}
</style>
