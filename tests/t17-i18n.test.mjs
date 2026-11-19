import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
const start = script.indexOf('var I18N =');
const end = script.indexOf('var EN =');
const I18N = new Function(script.slice(start, end) + '\nreturn I18N;')();

const used = new Set();
for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) used.add(match[1]);

const STALE = [
  '$7.99',
  '7.99',
  'Premium',
  '3–4',
  '3-4',
  'Inteligencia Artificial',
  'intelligence artificielle',
  'Comparador de Préstamos',
  'mejores ofertas',
  'meilleures offres',
  'préstamo personal',
  'prêt personnel',
  'قرض شخصي',
  'הלוואה אישית',
  'obj.broker',
  'chip.personal',
  'chip.insurance',
  'nuestra IA',
  'notre IA',
];

test('every visible string has the same keys in all four translations', () => {
  for (const lang of ['es', 'fr', 'ar', 'he']) {
    const keys = Object.keys(I18N[lang]).sort();
    assert.deepEqual(keys, [...used].sort(), lang + ' key set');
  }
});

test('source no longer contains the old offer-comparison claims', () => {
  for (const phrase of STALE) {
    assert.equal(html.includes(phrase), false, 'still present: ' + phrase);
  }
});

test('current referral wording is still present in every language', () => {
  for (const phrase of [
    'No somos un prestamista ni un sitio de hipotecas',
    'Nous ne sommes ni un prêteur ni un site de prêts hypothécaires',
    'لسنا جهة إقراض ولا موقعًا للرهن العقاري',
    'אנחנו לא גוף מלווה ולא אתר משכנתאות',
    'one licensed funding partner',
  ]) {
    assert.equal(html.includes(phrase), true, 'missing: ' + phrase);
  }
});
