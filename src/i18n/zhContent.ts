// Chinese (Simplified) overlay content. English strings stay the canonical
// source of truth in src/data/*.ts; this file supplies the zh translation
// for every piece of player-facing text keyed by the same ids, so nothing
// is ever shown half-translated.

export interface ZhChoiceContent {
  label: string;
  detail: string;
}

export interface ZhEventContent {
  title: string;
  description: string;
  lesson: string;
  choices: Record<string, ZhChoiceContent>;
}

export const ZH_CHARACTERS: Record<string, { name: string; tagline: string; incomeLabel: string; rentLabel: string }> = {
  graduate: {
    name: "应届毕业生",
    tagline: "文凭裱起来了，银行账户可就没那么体面了。",
    incomeLabel: "工资",
    rentLabel: "房租",
  },
  student: {
    name: "半工半读学生",
    tagline: "房租要分摊，精力也要分摊，勉强还能撑住。",
    incomeLabel: "兼职工资",
    rentLabel: "合租房租",
  },
  gig: {
    name: "零工",
    tagline: "时间表是自己的，收入可完全不这么想。",
    incomeLabel: "零工收入",
    rentLabel: "房租",
  },
  trust_fund: {
    name: "富二代",
    tagline: "爸妈说先别太拼，先把生活过明白。",
    incomeLabel: "家里给的生活费",
    rentLabel: "房租",
  },
};

export const ZH_ENDINGS: Record<string, { title: string; message: string }> = {
  stable: {
    title: "财务稳定",
    message: "你攒下了一笔真正的储备，压力也控制得住。这靠的是刻意取舍——跳过了一些享受，抠掉了一些开销，不是单纯的运气。",
  },
  scraping: {
    title: "勉强维持",
    message: "撑到了第30天，没有彻底垮掉，但也没有任何容错空间。再来一笔意外账单，一切都可能完全不一样——这种脆弱感，对很多人来说才是真实的生活，不管他们计划得多周全。",
  },
  debt: {
    title: "陷入负债",
    message: "账单的速度超过了工资的速度。即使有些选择看起来挺合理，也没能撑过房租、意外开销和本就不多的启动资金——这正是重点：财务稳定靠的不只是当下的意志力。",
  },
};

export const ZH_SCHEDULED_LABELS: Record<string, string> = {
  "urgent-care-remaining": "急诊——分期尾款",
  "urgent-care-late-fee": "急诊账单——本金加滞纳金",
};

export const ZH_EVENTS: Record<string, ZhEventContent> = {
  "rent-renewal": {
    title: "房东已进入聊天框",
    description: "晚上11:47收到一条短信：下个周期房租要涨了。没有什么比房东发来的突然涨价通知更能让人“安心入睡”了——他连你家水槽都还没修。",
    lesson: "多出来的$65一个月，一年就是$780——经常性支出会复利累积。要是房租涨到快占你税后收入的30%，那通常就是该去谈判或搬家的信号，别只顾着默默承受。",
    choices: {
      accept: { label: "直接交钱（+$65/月）", detail: "没有争执，但也没有省钱策略。" },
      negotiate: { label: "问问有没有商量余地", detail: "有点尴尬，能省一点，但得豁出去点面子。" },
      move: { label: "开始找新房子（申请费$55）", detail: "现在多花点功夫。如果成了，房租能长期降下来。" },
    },
  },
  "grocery-run": {
    title: "冰箱在说谎",
    description: "冰箱说家里有吃的。严格来说，确实有：一瓶调料和一些冰块。是时候为接下来一两周补货了。",
    lesson: "食物是少数几个你每周都能自己把控的预算项之一——这里最便宜和最贵选项之间差的$110，比很多人一整个月的娱乐预算还多。",
    choices: {
      budget: { label: "米、豆子和基本款（$45）", detail: "无聊，但非常管用。" },
      balanced: { label: "买点真正的新鲜食材（$85）", detail: "花得更多，但能让你状态更好。" },
      delivery: { label: "全部叫外卖配送（$155）", detail: "方便，但配送费造成的损失不小。" },
    },
  },
  "transit-choice": {
    title: "公交月卡还是一团乱",
    description: "通勤成本在悄悄上涨。买月卡今天要多花一笔钱——但买完之后剩下的每一趟都已经付过账了。",
    lesson: "$90的月卡大概三周就能把每周$40的按次付费成本追平——先算一下这个回本周期，比直接觉得「灵活的那个更划算」靠谱得多。",
    choices: {
      pass: { label: "买月卡（$90）", detail: "今天肉疼，这个月剩下的每一趟都免费。" },
      perride: { label: "继续按次付费（这周$40）", detail: "灵活，但累积起来比感觉中更快。" },
      bike: { label: "骑车省钱", detail: "免费。你的腿到周五肯定会有意见。" },
    },
  },
  "tax-refund": {
    title: "惊喜，国税局今年挺喜欢你",
    description: "$240的退税到账了，这是一笔你没算进预算的真金白银——也正因如此，它最容易悄悄溜走。",
    lesson: "常见的建议是应急基金要覆盖3到6个月的必要开销。这样一笔意外退税正是朝那个目标迈进的实打实一步——前提是它不会先被「犒劳自己」花掉。",
    choices: {
      save: { label: "全部存进应急基金", detail: "不刺激，但以后出事时它就在那儿。" },
      split: { label: "存一半，花一半犒劳自己（$80）", detail: "一些储备，一些奖励，合情合理的做法。" },
      spend: { label: "终于买下一直想要的东西（$200）", detail: "现在感觉爽翻了，但安全垫彻底没了。" },
    },
  },
  "flat-tire": {
    title: "砰。这声音不太对劲。",
    description: "去上班的路上，自行车轮胎爆了。你大概只有十分钟时间决定明天怎么出门。",
    lesson: "现在花$16补一下，总比通勤路上再爆一次、换一条$60+的新胎强。延后的保养仍然是一种成本——只是先藏起来，以后变成更大的账单。",
    choices: {
      repair: { label: "今天就修好（$60）", detail: "马上就能重新上路。" },
      patch: { label: "自己补胎（$16的工具包）", detail: "更便宜，但可能补不住，走一步看一步。" },
      bus: { label: "发薪前先坐公交（$28）", detail: "一种权宜之计，代价是你不太愿意损失的时间。" },
    },
  },
  "free-lunch": {
    title: "有人带了甜甜圈",
    description: "不知道是谁的生日，也可能根本没人过生日，不重要。茶水间里有甜甜圈，今天的剧情就这么多。",
    lesson: "预算里不是每件事都是危机。有些日子就是一个免费甜甜圈——享受就好。",
    choices: {
      join: { label: "去吃个甜甜圈顺便聊两句", detail: "免费、小小的社交，意外地挺舒心。" },
      decline: { label: "留在工位上，晚点再吃", detail: "也挺好，内向的人也该好好吃午饭。" },
    },
  },
  "friend-birthday": {
    title: "Jess的金色生日（居然真有这种说法）",
    description: "25号那天满25岁，大家都在凑钱一起吃饭。你要是缺席，Jess绝对会注意到。",
    lesson: "社交开销不等于乱花钱。真正的预算技巧是提前定好每个月给朋友和礼物留多少钱——这样过生日就不会变成一次预算危机。",
    choices: {
      join: { label: "全力以赴——聚餐加礼物（$75）", detail: "为了友情值得，该花多少就花多少。" },
      modest: { label: "凑份子买张卡和小礼物（$20）", detail: "心意到了，不用花大钱。" },
      skip: { label: "发消息祝福，留在家里", detail: "省下了钱，缺席还是有点难受。" },
    },
  },
  "cracked-screen": {
    title: "重力：1分，手机：0分",
    description: "手机掉到水泥地上摔了一下，屏幕裂成了抽象画。还能用，就是看不清字。",
    lesson: "“将就能用”的修法常常等于多花一次钱：先为临时补救付一次，以后还得为真正修好再付一次。有时候这笔交易仍然划算——只是心里要有数。",
    choices: {
      repair: { label: "全面更换屏幕（$125）", detail: "贵，但跟新的一样。" },
      diy: { label: "贴张钢化膜糊弄一下（$14）", detail: "便宜的补救办法，大体上能用。" },
      ignore: { label: "就这样继续用", detail: "今天免费，之后每天都烦。" },
    },
  },
  "roommate-offer": {
    title: "朋友需要地方住，你需要现金",
    description: "手头一直紧巴巴的。一个租约快到期的朋友随口问你家还有没有空位——其实是有的。",
    lesson: "少喝几次咖啡能省的钱是有限的。但重新调整像房租这样的固定支出——找个室友、换个更便宜的房子——一次就能腾出比攒好几周小钱更多的空间。",
    choices: {
      moveIn: { label: "答应——分摊房租", detail: "隐私少了点，但预算一下子宽松不少，而且是长期的。" },
      decline: { label: "现在还是算了", detail: "你保留了自己的空间，预算继续紧巴巴。" },
    },
  },
  "friend-loan": {
    title: "「能借我50块吗？周五肯定还你」",
    description: "朋友开口想借点钱应急，发誓周五前肯定还。你信了，大概率信了。",
    lesson: "借钱给朋友是一项真实的财务决定，不是什么举手之劳。把它当成任何一笔借款来对待——把金额和还款日期说清楚——真要是没还上，这句话也能让局面不那么尴尬。",
    choices: {
      lend: { label: "借出全部$50", detail: "够仗义，但能不能要回来不好说。" },
      partial: { label: "改借$20", detail: "一个折中方案，多少能帮上忙。" },
      decline: { label: "说现在不方便", detail: "诚实，但说出口有点别扭。" },
    },
  },
  "dental-checkup": {
    title: "那张不断提醒你的明信片",
    description: "牙医诊所已经寄来第三张提醒卡了。虽然不疼，但已经一年多没去了，他们心里有数。",
    lesson: "$80的洁牙，跟以后一次急诊根管治疗比起来根本不算什么——而且保险的免赔额通常不会像报销常规检查那样报销急诊牙科。跳过它是一场赌博，不是稳赚的省钱办法。",
    choices: {
      go: { label: "去做个洁牙（$80）", detail: "现在做好预防，以后少点意外。" },
      clinic: { label: "改去按收入分级收费的诊所（$35）", detail: "需要花点功夫找，但对钱包友好很多。" },
      skip: { label: "跳过——反正不疼", detail: "现在省钱，是在拿以后更大的账单赌一把。" },
    },
  },
  "weekend-gig": {
    title: "没人愿意接的周末班",
    description: "同事提起周末班待遇不错，一直没人接。但那样你的周六基本都要搭进去了。",
    lesson: "多赚点收入确实能缓解紧张的预算，但不是免费的——换来的是时间和精力。答应多上班之前，不妨先给自己的休息标个价：一小时休息，对你到底值多少钱？",
    choices: {
      takeit: { label: "以后每个周末都接", detail: "从现在起每周都有实打实的收入，休息时间却少了。" },
      sometimes: { label: "偶尔接一次（一次性$95）", detail: "多赚点外快，又不用把整个日程都搭进去。" },
      decline: { label: "拒绝——保住周末", detail: "没有额外收入，但你能好好休息。" },
    },
  },
  "shift-callback-favor": {
    title: "同事还记得这件事",
    description: "那个偶尔替你顶班的同事，这次想请一个轻松的下午假。你呢，前几周刚好拒绝过加班——世事就是这么巧。",
    lesson: "拒绝额外的工作不算损失——它往往正是你以后能腾出手帮别人的原因。",
    choices: {
      helpOut: { label: "二话不说帮TA顶班", detail: "搭进去一个下午，但换来的情谊很值。" },
      cantToday: { label: "坦白说今天实在撑不住", detail: "诚实，对方也能理解——你现在确实没什么余力了。" },
    },
  },
  "shift-callback-grind": {
    title: "疲惫终于追上了你",
    description: "已经连续第三个周末了。你的身体对此很有意见，而且这意见一点都不正面。",
    lesson: "用加班换来的额外收入，仍然是一场真实的交换——它造成的疲惫不会体现在工资条上。",
    choices: {
      pushOn: { label: "硬撑下去，你需要这笔钱", detail: "工资稳定，疲惫感也同样稳定。" },
      coffee: { label: "买杯好咖啡提提神，继续干（$6）", detail: "小小的犒劳，小小的缓解。" },
    },
  },
  "subscription-audit": {
    title: "那个免费试用从来就不是免费的",
    description: "你终于认真看了一眼银行账单。上面有三个你早就忘了自己订阅过的流媒体服务。",
    lesson: "信用卡账单不会主动替你标出那些被遗忘的订阅——得自己一行行去找。每个月花五分钟逐条核对账单，经常能找回实打实的钱。",
    choices: {
      cancel: { label: "取消用不上的那些（省下$15）", detail: "五分钟的小尴尬，换回一点钱。" },
      ignore: { label: "以后再说", detail: "「以后」这个词，在这句话里承担了太多责任。" },
    },
  },
  "family-needs-help": {
    title: "妈妈打来电话，说起车的事",
    description: "她没直接开口，她从来都不会。但车需要修，这个月家里手头紧，从她说话绕来绕去的样子就能听出来。",
    lesson: "照顾家人不会出现在预算模板里，但会出现在真实生活里。如果这种情况大概率还会再发生，就该给它单独留一个预算项，而不是每次都从「其他杂项」里硬挤。",
    choices: {
      full: { label: "寄$160过去帮忙", detail: "对你是真正的牺牲，但对他们意义重大。" },
      partial: { label: "寄你能拿出的$55", detail: "不是全部，但也是一份心意。" },
      cant: { label: "解释现在实在帮不上", detail: "诚实的答案，哪怕说出口很难。" },
    },
  },
  "burnout-check": {
    title: "你的身体在提意见",
    description: "你已经硬撑了好一阵子，今天终于撑不住了——头疼得不行，什么都不想做。",
    lesson: "休息这件事，怎么都要付出代价。把恢复精力当成一个独立的小预算项，通常比日后因为过劳付出的代价——少上的班、犯下的错、真的要看一次医生——便宜得多。",
    choices: {
      rest: { label: "请一天假好好休息（$25）", detail: "一次真正的重启，值回这点花费。" },
      pushThrough: { label: "硬撑过去", detail: "今天免费，但疲惫不会管你的日程安排。" },
    },
  },
  "hours-cut": {
    title: "排班突然变短了",
    description: "经理把你下周的工时砍了——大概少了$130，毫无预警，也没有一句道歉。",
    lesson: "收入不总是稳定的，哪怕是「稳定」的工作也一样。能覆盖3到6个月开销的应急基金，存在的意义正是这种时刻——没有它，被砍工时就从小麻烦变成了真正的危机。",
    choices: {
      extra: { label: "去别处多接一个班（补回$65）", detail: "需要费点劲去协调，但能缓解损失。" },
      tighten: { label: "这周紧着花", detail: "不用额外奔波，就是精打细算过一周。" },
      cushion: { label: "用存款垫上", detail: "这正是应急储备存在的意义。" },
    },
  },
  "urgent-care-bill": {
    title: "一场流感打乱了你的预算",
    description: "一次急诊，结果只是场严重流感，账单却是$310。诊所顺口提了一句有分期方案，几乎像是随口一说。",
    lesson: "医疗账单往往比想象中更能商量——很多医院开口问问就能给免息分期方案，通常比直接刷信用卡划算。但要是什么方案都不定、光是拖着不管，那就只是以后花更多钱换现在更少的灵活性。",
    choices: {
      full: { label: "现在付清全款（$310）", detail: "现在肉疼，但一次性了结。" },
      plan: { label: "分期支付（现在$95，余款稍后）", detail: "今天轻松一点，但第二笔账单已经在路上了。" },
      delay: { label: "完全拖着不付", detail: "今天不花钱，但以后可能变得更贵。" },
    },
  },
  "performance-review": {
    title: "季度绩效面谈时间到",
    description: "经理把你叫去做季度沟通。聊得还不错——这要么是个开口要涨薪的好时机，要么就是点头感谢然后走人。",
    lesson: "开口要求加薪是一项可以练习的能力——开口前先查一下这个岗位市场上大概的薪资水平，能把一次紧张的瞎猜变成有底气的合理诉求。这也是游戏里少数能直接提高收入、而不只是管理现有收入的选择。",
    choices: {
      askRaise: { label: "开口要求加薪", detail: "有点紧张，但成了——从现在起工资小涨一笔。" },
      nod: { label: "点头道谢就好", detail: "轻松自在，但等于把钱留在了桌上。" },
      vent: { label: "跳过这个话题，事后找朋友吐槽", detail: "工资没变，但心里舒坦了一点。" },
    },
  },
  "second-grocery-run": {
    title: "冰箱又双叒空了",
    description: "第二回合。这次你已经轻车熟路了——也很清楚上次的选择是怎么回事。",
    lesson: "同一个决定做了两次，不是巧合——是一个你完全可以提前规划好的预算项，不必每次都从头纠结。月度预算追踪的，很大程度上就是这些模式。",
    choices: {
      budget: { label: "再来一次基本款（$30）", detail: "你现在已经有自己的套路了。" },
      balanced: { label: "再来一次新鲜食材（$55）", detail: "稳定、合理。" },
      delivery: { label: "再叫一次外卖（$100）", detail: "配送费还是一分没少，不知道为什么。" },
    },
  },
  "free-concert": {
    title: "有人的票用不上了",
    description: "同事的计划临时泡汤，今晚把一张演唱会门票免费转给你，没有任何附加条件。",
    lesson: "不是每个美好的夜晚都要花钱——免费或低成本的娱乐，是预算里真实存在的一类，不是退而求其次的安慰奖。",
    choices: {
      go: { label: "去——免费的夜晚", detail: "热闹、好玩、免费，很难拒绝这个组合。" },
      skip: { label: "留在家里休息", detail: "安静的一晚，有时候也挺好的。" },
    },
  },
  "self-care-sunday": {
    title: "你正式到达极限了",
    description: "今天没发生什么新麻烦，你只是彻底累了——那种积攒了好几周、终于爆发出来的疲惫。",
    lesson: "高压力本身就是一种代价，哪怕什么新事都没发生。在危机出现之前认清自己的极限，是一项财务技能，不只是情绪管理——过劳的代价是真实的，严重起来甚至要看医生。",
    choices: {
      dayOff: { label: "整天完全放空（$20）", detail: "小小的花费，换来冲刺前一次真正的重启。" },
      pushThrough: { label: "继续硬撑", detail: "免费，但油箱已经快空了。" },
    },
  },
  "final-stretch": {
    title: "还剩最后一天",
    description: "30天快要收官了。有点想提前庆祝一下——也可能，再坚持最后一天。",
    lesson: "一段自律时光里，最后一个决定往往最容易松懈。但它和第一个决定一样重要。",
    choices: {
      restraint: { label: "再忍忍，马上就到了", detail: "不算光彩，但大概率是对的选择。" },
      treat: { label: "犒劳一下自己，你值得（$30）", detail: "冲线前给自己的一点小奖励。" },
    },
  },
};
