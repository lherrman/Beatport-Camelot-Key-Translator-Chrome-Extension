(function () {
  'use strict';

  // Camelot-Key-Datenbank
  // 'names' enthält alle bekannten Schreibweisen (Englisch, Deutsch, enharmonisch)
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
      // Originalschreibweise
      addVariant(name, k.code);

      // Kleinbuchstaben
      addVariant(name.toLowerCase(), k.code);

      // Englische Abkürzungen (Min / Maj)
      if (name.includes('Minor') || name.includes('Major')) {
        addVariant(name.replace('Minor', 'Min'), k.code);
        addVariant(name.replace('Major', 'Maj'), k.code);
        addVariant(name.toLowerCase().replace('minor', 'min'), k.code);
        addVariant(name.toLowerCase().replace('major', 'maj'), k.code);
      }
    });
  });

  // Regex aus den bekannten Tonarten bauen (längste zuerst, um Teil-Treffer zu vermeiden)
  const sortedKeys = Array.from(keyMap.keys()).sort((a, b) => b.length - a.length);
  const escapedKeys = sortedKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const keyRegex = new RegExp(`\\b(${escapedKeys.join('|')})\\b`, 'gi');

  function isSkipElement(element) {
    if (!element) return false;
    const tag = element.tagName.toLowerCase();
    return (
      ['script', 'style', 'textarea', 'input'].includes(tag) ||
      element.isContentEditable ||
      element.classList.contains('beatport-camelot-key')
    );
  }

  function replaceInTextNode(node) {
    if (isSkipElement(node.parentElement)) return;

    const originalText = node.textContent;
    if (!originalText) return;

    const normalizedText = normalizeForMatch(originalText);
    keyRegex.lastIndex = 0;

    const matches = [];
    let match;
    while ((match = keyRegex.exec(normalizedText)) !== null) {
      const camelot = keyMap.get(match[0]);
      if (!camelot) continue;

      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        original: originalText.substring(match.index, match.index + match[0].length),
        camelot: camelot,
      });
    }

    if (matches.length === 0) return;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    matches.forEach((m) => {
      if (m.start > lastIndex) {
        fragment.appendChild(document.createTextNode(originalText.substring(lastIndex, m.start)));
      }

      fragment.appendChild(document.createTextNode(m.camelot));

      lastIndex = m.end;
    });

    if (lastIndex < originalText.length) {
      fragment.appendChild(document.createTextNode(originalText.substring(lastIndex)));
    }

    node.parentNode.replaceChild(fragment, node);
  }

  function processElement(element) {
    if (isSkipElement(element)) return;

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode()) !== null) {
      textNodes.push(node);
    }
    textNodes.forEach(replaceInTextNode);
  }

  function init() {
    if (!document.body) {
      window.addEventListener('DOMContentLoaded', () => processElement(document.body));
      return;
    }
    processElement(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            replaceInTextNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            processElement(node);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  init();
})();
