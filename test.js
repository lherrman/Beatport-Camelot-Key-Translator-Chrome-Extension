// Test der Mapping- und Regex-Logik aus content.js

const keyData = [
  { code: '1m', names: ['A Minor', 'A Moll'] },
  { code: '1d', names: ['C Major', 'C Dur'] },
  { code: '2m', names: ['E Minor', 'E Moll'] },
  { code: '2d', names: ['G Major', 'G Dur'] },
  { code: '3m', names: ['B Minor', 'H Moll'] },
  { code: '3d', names: ['D Major', 'D Dur'] },
  { code: '4m', names: ['F# Minor', 'F# Moll', 'Gb Minor', 'Ges Moll', 'G Flat Minor', 'F Sharp Minor'] },
  { code: '4d', names: ['A Major', 'A Dur'] },
  { code: '5m', names: ['C# Minor', 'C# Moll', 'Db Minor', 'Des Moll', 'D Flat Minor', 'C Sharp Minor'] },
  { code: '5d', names: ['E Major', 'E Dur'] },
  { code: '6m', names: ['G# Minor', 'G# Moll', 'Ab Minor', 'As Moll', 'A Flat Minor', 'G Sharp Minor'] },
  { code: '6d', names: ['B Major', 'H Dur', 'Cb Major', 'Ces Dur', 'C Flat Major'] },
  { code: '7m', names: ['D# Minor', 'D# Moll', 'Eb Minor', 'Es Moll', 'E Flat Minor', 'D Sharp Minor'] },
  { code: '7d', names: ['F# Major', 'F# Dur', 'Gb Major', 'Ges Dur', 'G Flat Major', 'F Sharp Major'] },
  { code: '8m', names: ['A# Minor', 'A# Moll', 'Bb Minor', 'B Moll', 'B Flat Minor', 'A Sharp Minor'] },
  { code: '8d', names: ['C# Major', 'C# Dur', 'Db Major', 'Des Dur', 'D Flat Major', 'C Sharp Major'] },
  { code: '9m', names: ['F Minor', 'F Moll', 'E# Minor', 'Eis Moll', 'E Sharp Minor'] },
  { code: '9d', names: ['Ab Major', 'Ab Dur', 'G# Major', 'Gis Dur', 'G Sharp Major', 'A Flat Major'] },
  { code: '10m', names: ['C Minor', 'C Moll', 'B# Minor', 'His Moll', 'B Sharp Minor'] },
  { code: '10d', names: ['Eb Major', 'Eb Dur', 'D# Major', 'Dis Dur', 'D Sharp Major', 'E Flat Major'] },
  { code: '11m', names: ['G Minor', 'G Moll'] },
  { code: '11d', names: ['Bb Major', 'Bb Dur', 'A# Major', 'Ais Dur', 'A Sharp Major', 'B Dur', 'B Flat Major'] },
  { code: '12m', names: ['D Minor', 'D Moll'] },
  { code: '12d', names: ['F Major', 'F Dur'] },
];

const keyMap = new Map();

function normalizeForMatch(text) {
  return text.replace(/♯/g, '#').replace(/♭/g, 'b').toLowerCase();
}

function addVariant(name, code) {
  const normalized = normalizeForMatch(name);
  if (!keyMap.has(normalized)) {
    keyMap.set(normalized, code);
  }
}

keyData.forEach((k) => {
  k.names.forEach((name) => {
    addVariant(name, k.code);
    addVariant(name.toLowerCase(), k.code);
    if (name.includes('Minor') || name.includes('Major')) {
      addVariant(name.replace('Minor', 'Min'), k.code);
      addVariant(name.replace('Major', 'Maj'), k.code);
      addVariant(name.toLowerCase().replace('minor', 'min'), k.code);
      addVariant(name.toLowerCase().replace('major', 'maj'), k.code);
    }
  });
});

const sortedKeys = Array.from(keyMap.keys()).sort((a, b) => b.length - a.length);
const escapedKeys = sortedKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const keyRegex = new RegExp(`\\b(${escapedKeys.join('|')})\\b`, 'gi');

function translate(text) {
  const normalizedText = normalizeForMatch(text);
  keyRegex.lastIndex = 0;

  const matches = [];
  let match;
  while ((match = keyRegex.exec(normalizedText)) !== null) {
    const camelot = keyMap.get(match[0]);
    if (!camelot) continue;
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      camelot: camelot,
    });
  }

  if (matches.length === 0) return text;

  let result = '';
  let lastIndex = 0;
  matches.forEach((m) => {
    result += text.substring(lastIndex, m.start);
    result += m.camelot;
    lastIndex = m.end;
  });
  result += text.substring(lastIndex);
  return result;
}

const testCases = [
  ['A Minor', '1m'],
  ['C Major', '1d'],
  ['H Moll', '3m'],
  ['F# Minor', '4m'],
  ['Ab Major', '9d'],
  ['A Min', '1m'],
  ['a minor', '1m'],
  ['A♭ Major', '9d'],
  ['Track in A Minor and C Major', 'Track in 1m and 1d'],
  ['A Minimum should not change', 'A Minimum should not change'],
  ['Aminor should not change', 'Aminor should not change'],
  ['A Minor7 chord should not change', 'A Minor7 chord should not change'],
  // Enharmonisch
  ['Db Major', '8d'],
  ['Gb Major', '7d'],
  ['Cb Major', '6d'],
  ['D Flat Major', '8d'],
  ['G Flat Major', '7d'],
  ['C Flat Major', '6d'],
  ['Bb Minor', '8m'],
  ['Eb Minor', '7m'],
  ['Ab Minor', '6m'],
  ['B Flat Minor', '8m'],
  ['E Flat Minor', '7m'],
  ['A Flat Minor', '6m'],
  ['D♭ Major', '8d'],
  ['D Flat maj', '8d'],
  // Deutsch
  ['Des Dur', '8d'],
  ['Ges Dur', '7d'],
  ['Ces Dur', '6d'],
  ['B Moll', '8m'],
  ['Es Moll', '7m'],
  ['As Moll', '6m'],
  ['B Dur', '11d'],
  ['H Dur', '6d'],
  ['H Moll', '3m'],
];

let passed = 0;
let failed = 0;

testCases.forEach(([input, expected]) => {
  const actual = translate(input);
  if (actual === expected) {
    console.log(`✓ "${input}" → "${actual}"`);
    passed++;
  } else {
    console.log(`✗ "${input}"`);
    console.log(`  erwartet: "${expected}"`);
    console.log(`  erhalten: "${actual}"`);
    failed++;
  }
});

console.log(`\nErgebnis: ${passed} bestanden, ${failed} fehlgeschlagen`);
process.exit(failed > 0 ? 1 : 0);
