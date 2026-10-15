// Independent fixture: [super-effective defenders, resistant defenders, immune defenders].
const matchups = {
  normal: [[], ['rock', 'steel'], ['ghost']],
  fighting: [['normal', 'rock', 'steel', 'ice', 'dark'], ['flying', 'poison', 'bug', 'psychic', 'fairy'], ['ghost']],
  flying: [['fighting', 'bug', 'grass'], ['rock', 'steel', 'electric'], []],
  poison: [['grass', 'fairy'], ['poison', 'ground', 'rock', 'ghost'], ['steel']],
  ground: [['poison', 'rock', 'steel', 'fire', 'electric'], ['bug', 'grass'], ['flying']],
  rock: [['flying', 'bug', 'fire', 'ice'], ['fighting', 'ground', 'steel'], []],
  bug: [['grass', 'psychic', 'dark'], ['fighting', 'flying', 'poison', 'ghost', 'steel', 'fire', 'fairy'], []],
  ghost: [['ghost', 'psychic'], ['dark'], ['normal']],
  steel: [['rock', 'ice', 'fairy'], ['steel', 'fire', 'water', 'electric'], []],
  fire: [['bug', 'steel', 'grass', 'ice'], ['rock', 'fire', 'water', 'dragon'], []],
  water: [['ground', 'rock', 'fire'], ['water', 'grass', 'dragon'], []],
  grass: [['ground', 'rock', 'water'], ['flying', 'poison', 'bug', 'steel', 'fire', 'grass', 'dragon'], []],
  electric: [['flying', 'water'], ['grass', 'electric', 'dragon'], ['ground']],
  psychic: [['fighting', 'poison'], ['steel', 'psychic'], ['dark']],
  ice: [['flying', 'ground', 'grass', 'dragon'], ['steel', 'fire', 'water', 'ice'], []],
  dragon: [['dragon'], ['steel'], ['fairy']],
  dark: [['ghost', 'psychic'], ['fighting', 'dark', 'fairy'], []],
  fairy: [['fighting', 'dragon', 'dark'], ['poison', 'steel', 'fire'], []]
};

function damage(attack, defend) {
  const [strong, resistant, immune] = matchups[attack];
  return immune.includes(defend) ? 0 : resistant.includes(defend) ? 0.5 : strong.includes(defend) ? 2 : 1;
}

export async function correctSelector(page, kind) {
  const enemy = await page.locator('.stemContainer').evaluate(node =>
    [...node.classList].find(name => name.startsWith('Bgc-')).slice(4));
  const options = await page.locator('.optionItem').evaluateAll(nodes => nodes.map(node =>
    [...node.classList].find(name => name.startsWith('Bgc-')).slice(4)).filter(type => type !== 'wrong'));
  const values = options.map(type => kind === 'attack' ? damage(type, enemy) : damage(enemy, type));
  const best = kind === 'attack' ? Math.max(...values) : Math.min(...values);
  if (values.filter(value => value === best).length !== 1) throw new Error('Expected exactly one best visible answer');
  return `.optionItem.Bgc-${options[values.indexOf(best)]}`;
}
