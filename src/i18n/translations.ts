import type { BargainMessageKey } from '../types/game';

export type Locale = 'en' | 'zh';

export interface TranslationParams {
  [key: string]: string | number;
}

const en = {
  appTitle: 'Deal or No Deal',
  appSubtitle: 'Choose wisely. Trust your gut.',
  muteSound: 'Mute sound & music',
  enableSound: 'Enable sound & music',
  switchToLight: 'Switch to light mode',
  switchToDark: 'Switch to dark mode',
  switchToChinese: 'Switch to Chinese',
  switchToEnglish: 'Switch to English',

  welcomeTitle: 'Welcome to the Game',
  welcomeDescription:
    '26 briefcases. One life-changing prize. The Banker is watching every move. Pick your case, open the rest, and decide —',
  welcomeHighlight: 'Deal or No Deal?',
  startGame: 'Start New Game',
  howToPlay: 'How to play',
  rule1: 'Choose one briefcase to keep',
  rule2: 'Open others each round to eliminate values',
  rule3: "Accept the Banker's offer, bargain once, or keep playing",
  rule4: "Win what's in your briefcase!",

  statusSelectCase: 'Choose your briefcase — this one stays with you until the end.',
  statusOpenMore: 'Open {count} more case(s) this round.',
  statusRevealing: 'Revealing...',
  statusOffer: 'The Banker has an offer for you.',
  statusFinalChoice: 'Make your final decision!',
  round: 'Round {n}',
  yourCase: 'Your Case: #{id}',
  opened: '{opened}/{total} opened',

  briefcases: 'Briefcases',
  caseClosed: 'Case {id}, closed briefcase',
  caseYours: 'Case {id}, your case',
  caseOpened: 'Case {id}, opened, contained {amount}',
  yours: 'YOURS',

  valuesRemaining: 'Values Remaining',
  valueEliminated: '{amount}, eliminated',
  valueRemaining: '{amount}, remaining',

  offerHistory: 'Offer History',
  noOffersYet: 'No offers yet',
  bargained: 'Bargained',

  bankerOffer: "The Banker's Offer",
  afterRound: 'After Round {n}',
  callingBanker: 'Calling the Banker...',
  dealOrNoDeal: 'Deal or No Deal?',
  deal: 'DEAL ✓',
  noDeal: 'NO DEAL ✗',
  bargain: '📞 Bargain (One Time)',
  bargainUsed: '📞 Bargain Used',
  bargainUsedAria: 'Bargain already used this game',
  bargainAria: 'Bargain with the Banker for a better offer (one time only)',
  bargainHoldHint: 'Hold for 2s to confirm',

  bargainRefusedFirm: 'The Banker holds firm. No change to the offer.',
  bargainRefusedBudge: 'The Banker refuses to budge on this one.',
  bargainImproved: 'The Banker has reconsidered — a better offer!',
  bargainSmallImprovement: 'The Banker nudges the offer slightly upward.',

  revealCase: 'Case #{id}',
  revealGreat: 'Great elimination!',
  revealOuch: 'Ouch — big value gone!',
  revealEliminated: 'Value eliminated',

  finalDecision: 'Final Decision',
  finalDescription:
    'Only two cases remain. Keep your briefcase #{playerId} or swap with case #{otherId}?',
  yourCaseLabel: 'Your Case',
  otherCaseLabel: 'Other Case',
  keepCase: 'Keep Case #{id}',
  swapCase: 'Swap to Case #{id}',
  finalHint: 'Your case contains ???. Choose wisely!',

  gameOver: 'Game Over',
  outcomeDeal: 'You took the deal!',
  outcomeNoDeal: 'You played to the end!',
  outcomeSwap: 'You swapped cases!',
  outcomeKeep: 'You kept your case!',
  youWon: 'You won',
  fullReveal: 'Full Reveal',
  yourCaseContained: 'Your case #{id} contained',
  caseValue: 'Case #{id}: {amount}',
  moreCasesRevealed: '+ {count} more cases revealed',
  playAgain: 'Play Again',
  allCaseValues: 'All case values',
} as const;

const zh: Record<keyof typeof en, string> = {
  appTitle: '成交不成交',
  appSubtitle: '慎重选择，相信直觉。',
  muteSound: '关闭音效和背景音乐',
  enableSound: '开启音效和背景音乐',
  switchToLight: '切换到浅色模式',
  switchToDark: '切换到深色模式',
  switchToChinese: '切换到中文',
  switchToEnglish: '切换到英文',

  welcomeTitle: '欢迎来到游戏',
  welcomeDescription:
    '26 个公文包，一个改变命运的奖金。银行家注视着你的每一步。选择一个公文包，打开其余的，然后决定——',
  welcomeHighlight: '成交还是不成交？',
  startGame: '开始新游戏',
  howToPlay: '游戏规则',
  rule1: '选择一个公文包作为你的箱子',
  rule2: '每轮打开其他箱子以淘汰金额',
  rule3: '接受银行家的报价、议价一次，或继续游戏',
  rule4: '赢得你公文包中的奖金！',

  statusSelectCase: '选择你的公文包——它将伴随你直到最后。',
  statusOpenMore: '本轮还需打开 {count} 个箱子。',
  statusRevealing: '揭晓中...',
  statusOffer: '银行家有一个报价给你。',
  statusFinalChoice: '做出你的最终决定！',
  round: '第 {n} 轮',
  yourCase: '你的箱子：#{id}',
  opened: '已打开 {opened}/{total}',

  briefcases: '公文包',
  caseClosed: '箱子 {id}，未打开的公文包',
  caseYours: '箱子 {id}，你的公文包',
  caseOpened: '箱子 {id}，已打开，内含 {amount}',
  yours: '你的',

  valuesRemaining: '剩余金额',
  valueEliminated: '{amount}，已淘汰',
  valueRemaining: '{amount}，剩余',

  offerHistory: '报价历史',
  noOffersYet: '暂无报价',
  bargained: '已议价',

  bankerOffer: '银行家的报价',
  afterRound: '第 {n} 轮结束后',
  callingBanker: '正在致电银行家...',
  dealOrNoDeal: '成交还是不成交？',
  deal: '成交 ✓',
  noDeal: '不成交 ✗',
  bargain: '📞 议价（仅限一次）',
  bargainUsed: '📞 已使用议价',
  bargainUsedAria: '本局已使用过议价',
  bargainAria: '与银行家议价以获得更高报价（仅限一次）',
  bargainHoldHint: '长按 2 秒确认',

  bargainRefusedFirm: '银行家坚持原价，报价不变。',
  bargainRefusedBudge: '银行家拒绝让步。',
  bargainImproved: '银行家重新考虑——提高了报价！',
  bargainSmallImprovement: '银行家略微提高了报价。',

  revealCase: '箱子 #{id}',
  revealGreat: '淘汰得好！',
  revealOuch: '哎呀——大额奖金没了！',
  revealEliminated: '金额已淘汰',

  finalDecision: '最终决定',
  finalDescription:
    '只剩两个箱子。保留你的 #{playerId} 号公文包，还是与 #{otherId} 号交换？',
  yourCaseLabel: '你的箱子',
  otherCaseLabel: '另一个箱子',
  keepCase: '保留 #{id} 号箱子',
  swapCase: '换到 #{id} 号箱子',
  finalHint: '你的箱子内含 ???。慎重选择！',

  gameOver: '游戏结束',
  outcomeDeal: '你选择了成交！',
  outcomeNoDeal: '你坚持到了最后！',
  outcomeSwap: '你交换了箱子！',
  outcomeKeep: '你保留了自己的箱子！',
  youWon: '你赢得了',
  fullReveal: '完整揭晓',
  yourCaseContained: '你的 #{id} 号箱子内含',
  caseValue: '#{id} 号箱子：{amount}',
  moreCasesRevealed: '另有 {count} 个箱子已揭晓',
  playAgain: '再玩一次',
  allCaseValues: '所有箱子金额',
};

export const translations = { en, zh } as const;

export type TranslationKey = keyof typeof en;

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  let text: string = translations[locale][key] ?? translations.en[key] ?? key;

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text
        .replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue))
        .replace(new RegExp(`#\\{${paramKey}\\}`, 'g'), String(paramValue));
    }
  }

  // Handle plural suffix (s) in English open-more message
  if (key === 'statusOpenMore' && params?.count !== undefined) {
    const count = Number(params.count);
    if (locale === 'en') {
      text = text.replace('(s)', count === 1 ? '' : 's');
    } else {
      text = text.replace('(s)', '');
    }
  }

  return text;
}

export function getBargainMessageKey(
  result: BargainMessageKey,
): TranslationKey {
  const map: Record<BargainMessageKey, TranslationKey> = {
    'refused-firm': 'bargainRefusedFirm',
    'refused-budge': 'bargainRefusedBudge',
    improved: 'bargainImproved',
    'small-improvement': 'bargainSmallImprovement',
  };
  return map[result];
}
