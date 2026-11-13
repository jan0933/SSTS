/**
 * SSTS - 100 國專屬特色建築地標與大洲建築群映射資料庫 (landmarks_db.js)
 */

const COUNTRY_LANDMARK_MAP = {
  // 1~10：微型聖城、城邦與珊瑚礁島國
  1:  ['vatican_dome', 'roman_pillar'],          // 梵蒂岡：聖彼得大教堂圓頂
  2:  ['casino_palace', 'roman_pillar'],         // 摩納哥：蒙地卡羅皇宮
  3:  ['coral_totem', 'maldives_bungalow'],      // 諾魯：磷礦巨岩與海島柱
  4:  ['maldives_bungalow', 'coral_totem'],      // 吐瓦魯：環礁高腳茅屋
  5:  ['eu_castle', 'roman_pillar'],             // 聖馬利諾：瓜伊塔三塔堡壘
  6:  ['eu_castle', 'viking_hall'],              // 列支敦斯登：瓦杜茲阿爾卑斯古堡
  7:  ['coral_totem', 'maldives_bungalow'],      // 馬紹爾群島：比基尼環礁圖騰
  8:  ['us_liberty', 'coral_totem'],             // 聖克里斯多福及尼維斯：硫磺山要塞
  9:  ['maldives_bungalow', 'islamic_mosque'],   // 馬爾地夫：水上茅屋與珊瑚清真寺
  10: ['eu_castle', 'roman_pillar'],             // 馬爾他：騎士團海岸要塞

  // 11~20：加勒比海島嶼、太平洋群島與東南亞都市國家
  11: ['coral_totem', 'maldives_bungalow'],      // 格瑞那達：香料海岸燈塔
  12: ['coral_totem', 'mayan_temple'],           // 聖文森及格瑞那丁：火山岩圖騰
  13: ['roman_pillar', 'coral_totem'],           // 巴貝多：布里奇敦議會柱廊
  14: ['coral_totem', 'maldives_bungalow'],      // 安地卡及巴布達：英國港船塢
  15: ['maldives_bungalow', 'coral_totem'],      // 塞席爾：花崗岩海灘涼亭
  16: ['coral_totem', 'jp_torii'],               // 帛琉：洛克群島石柱與鳥居
  17: ['eu_castle', 'roman_pillar'],             // 安道爾：庇里牛斯山石砌教堂
  18: ['coral_totem', 'maldives_bungalow'],      // 聖露西亞：雙子皮通火山峰
  19: ['coral_totem', 'maldives_bungalow'],      // 密克羅尼西亞：南馬都爾玄武岩遺蹟
  20: ['singapore_mbs', 'merlion_statue'],       // 新加坡：濱海灣金沙空中花園、魚尾獅

  // 21~30：太平洋王國、波斯灣珍珠與台灣
  21: ['coral_totem', 'maldives_bungalow'],      // 東加：哈阿蒙加巨石三石塔
  22: ['coral_totem', 'mayan_temple'],           // 多米尼克：熱帶雨林石祭壇
  23: ['islamic_mosque', 'skyscraper_twin'],     // 巴林：世界貿易中心雙帆塔
  24: ['coral_totem', 'maldives_bungalow'],      // 吉里巴斯：赤道環礁觀測站
  25: ['obelisk_monument', 'coral_totem'],       // 聖多美普林西比：大犬座火山尖峰
  26: ['coral_totem', 'maldives_bungalow'],      // 薩摩亞：法萊傳統圓頂屋
  27: ['eu_castle', 'viking_hall'],              // 盧森堡：博克砲台古堡
  28: ['islamic_mosque', 'coral_totem'],         // 模里西斯：路易港海濱砲台
  29: ['islamic_mosque', 'obelisk_monument'],    // 葛摩：莫洛尼火山清真寺
  30: ['taipei_101', 'pagoda_temple'],           // 台灣：台北101大樓、飛簷廟宇

  // 31~40：高加索古國、海灣富國與低地國
  31: ['islamic_mosque', 'pagoda_temple'],       // 汶萊：奧馬爾阿里賽義夫丁金頂清真寺
  32: ['us_liberty', 'skyscraper_twin'],         // 千里達及托巴哥：西班牙港雙塔
  33: ['coral_totem', 'obelisk_monument'],       // 維德角：福戈火山燈塔
  34: ['coral_totem', 'maldives_bungalow'],      // 萬那杜：納戈爾木雕圖騰柱
  35: ['islamic_mosque', 'skyscraper_twin'],     // 卡達：杜哈伊斯蘭藝術博物館與帆塔
  36: ['mayan_temple', 'obelisk_monument'],      // 牙買加：藍山石砌莊園
  37: ['obelisk_monument', 'islamic_mosque'],    // 甘比亞：班竹凱旋門
  38: ['roman_pillar', 'islamic_mosque'],        // 黎巴嫩：巴勒貝克太陽神殿巨柱
  39: ['roman_pillar', 'eu_castle'],             // 賽普勒斯：帕福斯古希臘柱廊
  40: ['eu_castle', 'viking_hall'],              // 荷蘭：風車磨坊與運河山牆屋

  // 41~50：歐陸精華、東北亞與聖地
  41: ['eu_castle', 'roman_pillar'],             // 瑞士：西庸城堡與阿爾卑斯鐘樓
  42: ['viking_hall', 'eu_castle'],              // 丹麥：新港彩色山牆與維京長屋
  43: ['pagoda_temple', 'th_stupa'],             // 不丹：虎穴寺懸崖佛塔
  44: ['roman_pillar', 'islamic_mosque'],        // 以色列：耶路撒冷圓頂聖殿與古城牆
  45: ['mayan_temple', 'skyscraper_twin'],       // 薩爾瓦多：聖安娜火山神殿
  46: ['islamic_mosque', 'skyscraper_twin'],     // 科威特：科威特球形水塔
  47: ['coral_totem', 'maldives_bungalow'],      // 斐濟：蘇瓦傳統草頂議事廳
  48: ['eu_castle', 'roman_pillar'],             // 斯洛維尼亞：布萊德湖心教堂
  49: ['eu_castle', 'viking_hall'],              // 比利時：布魯塞爾大廣場市政廳尖塔
  50: ['kor_palace', 'pagoda_temple'],           // 韓國：景福宮殿樓、南山首爾塔

  // 51~60：中歐、波羅的海與中美洲
  51: ['islamic_mosque', 'skyscraper_twin'],     // 阿拉伯聯合大公國：哈里發塔與謝赫扎耶德清真寺
  52: ['eu_castle', 'roman_pillar'],             // 奧地利：美泉宮與聖史蒂芬尖塔
  53: ['eu_castle', 'ru_kremlin'],               // 捷克：布拉格查理大橋塔樓
  54: ['mayan_temple', 'skyscraper_twin'],       // 巴拿馬：運河船閘控制塔
  55: ['viking_hall', 'polar_beacon'],           // 冰島：哈爾格林姆教堂
  56: ['eu_castle', 'roman_pillar'],             // 匈牙利：布達佩斯國會大廈圓頂
  57: ['eu_castle', 'roman_pillar'],             // 葡萄牙：貝倫塔航海堡壘
  58: ['roman_pillar', 'eu_castle'],             // 希臘：雅典帕德嫩神殿多立克柱
  59: ['pagoda_temple', 'kor_palace'],           // 北韓：主體思想塔與凱旋門
  60: ['mayan_temple', 'us_liberty'],            // 古巴：哈瓦那國會大廈圓頂

  // 61~70：東南亞古文明與西歐列強
  61: ['th_stupa', 'pagoda_temple'],             // 柬埔寨：吳哥窟蓮花五塔
  62: ['th_stupa', 'pagoda_temple'],             // 寮國：永珍塔鑾金塔
  63: ['uk_bigben', 'eu_castle'],                // 英國：倫敦大笨鐘鐘樓
  64: ['eu_castle', 'roman_pillar'],             // 羅馬尼亞：布朗吸血鬼古堡
  65: ['it_colosseum', 'vatican_dome'],          // 義大利：羅馬競技場、比薩斜塔
  66: ['au_opera', 'coral_totem'],               // 紐西蘭：奧克蘭天空塔與毛利圖騰
  67: ['eu_castle', 'viking_hall'],              // 波蘭：華沙文化科學宮
  68: ['jp_torii', 'jp_pagoda'],                 // 日本：嚴島海上鳥居、五重塔
  69: ['eu_castle', 'viking_hall'],              // 德國：新天鵝堡與布蘭登堡門
  70: ['viking_hall', 'polar_beacon'],           // 芬蘭：赫爾辛基白教堂與極光觀測塔

  // 71~80：東南亞群島、北歐與南亞
  71: ['pagoda_temple', 'th_stupa'],             // 越南：下龍灣古帆與順化皇城門
  72: ['skyscraper_twin', 'islamic_mosque'],     // 馬來西亞：吉隆坡雙子星塔
  73: ['viking_hall', 'polar_beacon'],           // 挪威：峽灣維京木板教堂
  74: ['viking_hall', 'eu_castle'],              // 瑞典：斯德哥爾摩市政廳紅磚塔
  75: ['ziggurat_step', 'islamic_mosque'],       // 伊拉克：巴比倫空中花園階梯神廟
  76: ['eu_castle', 'roman_pillar'],             // 西班牙：巴塞隆納聖家堂尖塔
  77: ['th_stupa', 'pagoda_temple'],             // 泰國：曼谷鄭王廟金頂佛塔
  78: ['fr_eiffel', 'eu_castle'],                // 法國：巴黎艾菲爾鐵塔、凱旋門
  79: ['obelisk_monument', 'tribal_totem'],      // 肯亞：蒙巴薩耶穌堡與草原圖騰
  80: ['ru_kremlin', 'eu_castle'],               // 烏克蘭：基輔聖索菲亞金頂教堂

  // 81~90：中東古國、亞洲巨龍與非洲
  81: ['th_stupa', 'pagoda_temple'],             // 緬甸：仰光瑞光大金塔
  82: ['islamic_mosque', 'ziggurat_step'],       // 阿富汗：巴米揚石窟拱龕
  83: ['eg_pyramid', 'obelisk_monument'],        // 埃及：吉薩金字塔、方尖碑
  84: ['islamic_mosque', 'roman_pillar'],        // 土耳其：伊斯坦堡聖索菲亞清真寺尖塔
  85: ['br_christ', 'mayan_temple'],             // 智利：復活節島摩艾巨石像
  86: ['obelisk_monument', 'tribal_totem'],      // 尚比亞：維多利亞瀑布觀景石柱
  87: ['ziggurat_step', 'islamic_mosque'],       // 伊朗：波斯波利斯萬國門與清真寺
  88: ['pagoda_temple', 'ru_kremlin'],           // 蒙古：成吉思汗巨像與蒙古包
  89: ['pagoda_temple', 'th_stupa'],             // 印尼：婆羅浮屠佛塔與峇里島善惡門
  90: ['mayan_temple', 'skyscraper_twin'],       // 墨西哥：奇琴伊察瑪雅金字塔

  // 91~100：領土面積前十強超級大國
  91: ['islamic_mosque', 'skyscraper_twin'],     // 沙烏地阿拉伯：麥加皇家鐘塔與清真寺
  92: ['mayan_temple', 'br_christ'],             // 秘魯：馬丘比丘印加石殿
  93: ['obelisk_monument', 'tribal_totem'],      // 查德：提貝斯提沙漠石柱
  94: ['islamic_mosque', 'eg_pyramid'],          // 阿爾及利亞：阿爾及爾白色清真寺
  95: ['ziggurat_step', 'ru_kremlin'],           // 哈薩克：巴伊傑列克生命之樹塔
  96: ['in_tajmahal', 'pagoda_temple'],          // 印度：泰姬瑪哈陵
  97: ['au_opera', 'coral_totem'],               // 澳洲：雪梨歌劇院風帆
  98: ['br_christ', 'mayan_temple'],             // 巴西：里約救世基督像聖壇
  99: ['us_liberty', 'skyscraper_twin'],         // 美國：自由女神火炬台、雙子摩天樓
  100:['cn_greatwall', 'ru_kremlin']             // 中國 / 俄羅斯壓軸防線：萬里長城烽火台與克里姆林洋蔥頭教堂
};

const CONTINENT_ARCH_POOL = {
  EU: ['eu_castle', 'uk_bigben', 'roman_pillar'],
  AS: ['pagoda_temple', 'jp_torii', 'th_stupa'],
  AM: ['skyscraper_twin', 'mayan_temple', 'us_liberty'],
  AF: ['eg_pyramid', 'obelisk_monument', 'islamic_mosque'],
  OC: ['au_opera', 'coral_totem', 'maldives_bungalow'],
  GL: ['polar_beacon', 'viking_hall', 'roman_pillar']
};

function resolveCountryLandmarks(countryData, countryId) {
  const rawName = (countryData && countryData.name) ? countryData.name : '';
  const keywordRules = [
    { keys: ['梵蒂岡', 'Vatican'], arch: ['vatican_dome', 'roman_pillar'] },
    { keys: ['摩納哥', 'Monaco'], arch: ['casino_palace', 'roman_pillar'] },
    { keys: ['馬爾地夫', 'Maldives'], arch: ['maldives_bungalow', 'coral_totem'] },
    { keys: ['新加坡', 'Singapore'], arch: ['singapore_mbs', 'merlion_statue'] },
    { keys: ['台灣', 'Taiwan'], arch: ['taipei_101', 'pagoda_temple'] },
    { keys: ['韓國', 'Korea'], arch: ['kor_palace', 'pagoda_temple'] },
    { keys: ['英國', 'United Kingdom', 'UK'], arch: ['uk_bigben', 'eu_castle'] },
    { keys: ['日本', 'Japan'], arch: ['jp_torii', 'jp_pagoda'] },
    { keys: ['義大利', 'Italy'], arch: ['it_colosseum', 'vatican_dome'] },
    { keys: ['法國', 'France'], arch: ['fr_eiffel', 'eu_castle'] },
    { keys: ['泰國', 'Thailand', '柬埔寨', '緬甸'], arch: ['th_stupa', 'pagoda_temple'] },
    { keys: ['埃及', 'Egypt'], arch: ['eg_pyramid', 'obelisk_monument'] },
    { keys: ['印度', 'India'], arch: ['in_tajmahal', 'pagoda_temple'] },
    { keys: ['澳洲', 'Australia'], arch: ['au_opera', 'coral_totem'] },
    { keys: ['巴西', 'Brazil'], arch: ['br_christ', 'mayan_temple'] },
    { keys: ['美國', 'United States', 'USA'], arch: ['us_liberty', 'skyscraper_twin'] },
    { keys: ['中國', 'China'], arch: ['cn_greatwall', 'pagoda_temple'] },
    { keys: ['加拿大', 'Canada'], arch: ['ca_cntower', 'polar_beacon'] },
    { keys: ['俄羅斯', 'Russia'], arch: ['ru_kremlin', 'eu_castle'] },
    { keys: ['墨西哥', 'Mexico', '秘魯', 'Peru'], arch: ['mayan_temple', 'br_christ'] },
    { keys: ['沙烏地', 'Saudi', '阿聯', 'UAE', '土耳其', 'Turkey', '伊朗', 'Iran'], arch: ['islamic_mosque', 'ziggurat_step'] },
    { keys: ['希臘', 'Greece'], arch: ['roman_pillar', 'eu_castle'] },
    { keys: ['挪威', 'Norway', '瑞典', 'Sweden', '冰島', 'Iceland', '芬蘭', 'Finland'], arch: ['viking_hall', 'polar_beacon'] }
  ];

  for (const rule of keywordRules) {
    if (rule.keys.some(k => rawName.includes(k))) {
      return rule.arch;
    }
  }

  if (COUNTRY_LANDMARK_MAP[countryId]) {
    return COUNTRY_LANDMARK_MAP[countryId];
  }

  const cont = (countryData && countryData.continent) ? countryData.continent : 'EU';
  return CONTINENT_ARCH_POOL[cont] || CONTINENT_ARCH_POOL.EU;
}
