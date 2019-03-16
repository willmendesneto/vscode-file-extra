const removeFirstSlashInString = (s: string = '') => s.replace(/^\/+/g, '');
const removeLastSlashInString = (s: string = '') => s.replace(/\/$/, '');

export { removeFirstSlashInString, removeLastSlashInString };
