
// Esta función toma un objeto de datos de país y normaliza los campos 'borders' y 'timezones' 
// para que sean arrays en lugar de cadenas separadas por comas.
// Si los campos no están definidos, se establecen como arrays vacíos.
export const normalizeCountryData = (data) => {

    const normalized = { ...data };

    if (normalized.borders !== undefined) { // Verifica si el campo 'borders' está definido

        normalized.borders = normalized.borders // Si 'borders' está definido, lo procesa; de lo contrario, lo establece como un array vacío

        ? normalized. borders
            .split(',')
            .map(border => border.trim())
            .filter(border => border !== '')
        : [];
    }

    if (normalized.timezones !== undefined) { // Verifica si el campo 'timezones' está definido

        normalized.timezones = normalized.timezones

        ? normalized.timezones
            .split(',')
            .map(zone => zone.trim())
            .filter(zone => zone !== '')
        : [];
    }

    // Devuelve el objeto normalizado con los campos 'borders' y 'timezones' como arrays
    return normalized;
};