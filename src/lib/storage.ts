export interface DiagnosisRecord {
  id: string;
  type: 'symptom' | 'image';
  date: string;
  input: string;
  imageUrl?: string;
  result: string;
}

const STORAGE_KEY = 'vitala_history';

export function saveRecord(record: Omit<DiagnosisRecord, 'id' | 'date'>) {
  const history = getHistory();
  const newRecord: DiagnosisRecord = {
    ...record,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
  };
  history.unshift(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return newRecord;
}

export function getHistory(): DiagnosisRecord[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
