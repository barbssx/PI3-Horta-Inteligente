import * as XLSX from "xlsx";

export function parseCsvFile(content) {
  const lines = content.trim().split("\n");
  const data = lines.slice(1).map((line) => {
    const [
      tempComposteira,
      tempAmbiente,
      umidade,
      tensao,
      ano,
      mes,
      dia,
      hora,
      minuto,
      segundo,
    ] = line.split(",");

    console.log("Linha do CSV:", line);

    const date = new Date(ano, mes - 1, dia, hora, minuto, segundo);

    if (isNaN(date.getTime())) {
      console.warn(`Data inválida para linha: ${line}`);
    }

    return {
      temperaturaComposteira: parseFloat(tempComposteira) || 0,
      temperaturaAmbiente: parseFloat(tempAmbiente) || 0,
      umidadeAmbiente: parseFloat(umidade) || 0,
      tensaoBateria: parseFloat(tensao) || 0,
      ano: ano,
      mes: mes,
      dia: dia,
      hora: hora,
      minuto: minuto,
      segundo: segundo,
      data: date,
    };
  });

  return data;
}

export function parseXlsxFile(content) {
  const workbook = XLSX.read(content, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log("Dados do XLSX:", jsonData);

  return jsonData.slice(2).map((row) => {
    const [
      tempComposteira,
      tempAmbiente,
      umidade,
      tensao,
      ano,
      mes,
      dia,
      hora,
      minuto,
      segundo,
    ] = row;

    const date = new Date(ano, mes - 1, dia, hora, minuto, segundo);

    if (isNaN(date.getTime())) {
      console.warn(`Data inválida para linha: ${row}`);
    }

    return {
      temperaturaComposteira: parseFloat(tempComposteira) || 0,
      temperaturaAmbiente: parseFloat(tempAmbiente) || 0,
      umidadeAmbiente: parseFloat(umidade) || 0,
      tensaoBateria: parseFloat(tensao) || 0,
      ano: ano,
      mes: mes,
      dia: dia,
      hora: hora,
      minuto: minuto,
      segundo: segundo,
      data: date,
    };
  });
}

export function handleFileUpload(event) {
  const file = event.target.files[0];

  const reader = new FileReader();

  if (file.name.endsWith(".csv")) {
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = parseCsvFile(content); 
      console.log(parsedData); 
    };
    reader.readAsText(file); 
  } else if (file.name.endsWith(".xlsx")) {
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = parseXlsxFile(content); 
      console.log(parsedData); 
    };
    reader.readAsArrayBuffer(file); 
  } else {
    console.error("Tipo de arquivo não suportado. Use CSV ou XLSX.");
  }
}
