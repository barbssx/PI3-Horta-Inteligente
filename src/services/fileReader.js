export function parseFile(content) {

  const lines = content.trim().split('\n');
  const data = lines.map(line => {
    const [temperature, year, month, day, hour, minute, second] = line.split(',');
    const date = new Date(year, month -1, day, hour, minute, second);

    return {
      temperature: parseFloat(temperature),
      date: date
    };
  });
  return data;
}