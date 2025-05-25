# Horta Inteligente

## Visão Geral do Projeto

O projeto **Horta Inteligente** visa desenvolver uma ferramenta computacional inovadora para auxiliar no aprendizado e pesquisa de técnicas agrícolas em hortas escolares, com foco especial na compostagem. Esta iniciativa responde à demanda de professores e gestores por soluções que integrem tecnologia e ciência na educação ambiental, promovendo práticas sustentáveis alinhadas aos Objetivos de Desenvolvimento Sustentável (ODS) 11 e 12 da Agenda 2030 da ONU.

## O Problema

Apesar de as hortas escolares serem ambientes ideais para práticas sustentáveis como a compostagem, há uma lacuna na disponibilidade de ferramentas que auxiliem no monitoramento eficaz e no aprofundamento científico dessas atividades[cite: 9]. Nosso problema de pesquisa centrou-se em: **Como desenvolver uma ferramenta computacional que auxilie no aprendizado e pesquisa de técnicas agrícolas na horta escolar?** [cite: 10]

## Objetivos do Projeto

O **Objetivo Geral** é desenvolver um software que apoie estudantes do Programa de Ensino Integral no estudo científico de técnicas agrícolas[cite: 12].

Para alcançar isso, definimos os seguintes **Objetivos Específicos**[cite: 13]:
* Monitorar a temperatura e umidade da compostagem.
* Enviar dados coletados para a nuvem.
* Analisar as variáveis monitoradas utilizando modelos matemáticos preditivos.

## A Solução: Website Horta Inteligente

A solução desenvolvida é o **website Horta Inteligente**, uma interface digital robusta e educativa[cite: 25].

### Tecnologias Utilizadas
* **Frontend:** Desenvolvido com **Vue.js** e estilizado com **Bootstrap**, garantindo responsividade, leveza e alta usabilidade[cite: 3]. (Anteriormente foi utilizado Tailwind CSS, conforme slides, mas a informação foi atualizada para Bootstrap)
* **Backend:** Implementado com **Node.js**[cite: 3].
* **Banco de Dados:** **MySQL**[cite: 3].
* **Hospedagem:** O frontend está hospedado na **Vercel**, e o backend e o banco de dados no **Railway**.

### Funcionalidades Principais
O website é estruturado em seções chave para o monitoramento e aprendizado:

* **Página Inicial:** Ponto de entrada estratégico que apresenta uma visão geral do projeto e serve como hub de navegação para as demais seções[cite: 2].
* **Página "Sobre o Projeto":** Detalha a motivação, os componentes de hardware (sensores DS18B20, AM2320, módulo RTC e cartão SD), o protocolo de coleta de dados a cada 15 minutos e inclui uma galeria com imagens do ambiente, ferramentas e processo de montagem para corroborar a implementação.
* **Dashboard:** Módulo analítico central que permite o upload e processamento de arquivos CSV e XLSX contendo os dados coletados[cite: 2]. Os dados são exibidos em gráficos temporais de temperatura, umidade e tensão da bateria, facilitando a análise visual[cite: 6, 2]. *É importante notar que, para o upload de dados ao banco, arquivos referentes a um único dia são recomendados devido a limitações de processamento de grandes volumes, mas a visualização na Dashboard não é impactada pela quantidade de linhas.*
* **Página "Conhecimento":** Uma biblioteca didática que consolida os principais aprendizados e tecnologias envolvidos, abordando compostagem, Arduino, sensores e análise de dados. Esta seção promove o entendimento integrado dos fundamentos científicos e tecnológicos.

### Hardware Complementar
A solução também incorpora um sistema de hardware com **Arduino Nano**, protoboard, baterias, módulos de relógio e armazenamento, e sensores DS18B20 e AM2320 para a coleta de dados de temperatura e umidade do ar e temperatura do substrato[cite: 22]. O código para o Arduino é em C++ com bibliotecas específicas para os sensores, armazenamento em cartão SD e controle de tempo[cite: 23]. O hardware é protegido por uma caixa plástica 3D e foi posicionado na estrutura de alvenaria da composteira com coleta de dados a cada 15 minutos[cite: 24].

## Link do Projeto

Acesse a aplicação em funcionamento: [https://dashboard-eight-xi-35.vercel.app/](https://dashboard-eight-xi-35.vercel.app/)

## Integrantes do Grupo

* Alíni Soriano Pereira [cite: 8]
* Ana Paula Lagisck [cite: 8]
* Barbara Sthefani Leite Silva [cite: 8]
* Camila Franciane Evangelista de Melo [cite: 8]
* Leonardo de Oliveira Lopes [cite: 8]
* Regina Sanae Kurata [cite: 8]
* Renan Fortaleza de Carvalho [cite: 8]
* Rubens Luiz Rodrigues [cite: 8]
