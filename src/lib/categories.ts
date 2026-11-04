export const categories = ['仕事を楽にする', 'つくってみた', '道具を選ぶ'] as const;
export function categoryFor(tags: string[] = []) {
  if (tags.some(tag => ['ガジェット', 'USB-C', 'Nintendo', 'ゲーミング'].includes(tag))) return categories[2];
  if (tags.some(tag => ['Web制作', 'CSS', 'つくったもの'].includes(tag))) return categories[1];
  return categories[0];
}
