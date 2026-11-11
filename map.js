/**
 * SSTS - 全球大地圖選關、3D 旋轉地球與 LocalStorage 存檔引擎 (map.js)
 */

/* ==================== 100 國關卡資料庫 (面積從小到大) ==================== */
const COUNTRIES_STAGE_DATA = [
  { id: 1, name: "梵蒂岡 (Vatican City)", area: "0.49 km²", lat: 41.9, lon: 12.4, diff: 1, desc: "全球最小微型聖城，受到突變海嗣最初波次圍困。擊退登陸潮並收復第一塊地表領土！" },
  { id: 2, name: "摩納哥 (Monaco)", area: "2.02 km²", lat: 43.7, lon: 7.4, diff: 1, desc: "濱海懸崖港灣，突變寄生魚自地中海深處上岸！" },
  { id: 3, name: "諾魯 (Nauru)", area: "21 km²", lat: -0.5, lon: 166.9, diff: 1, desc: "孤立南太平洋環礁，海嗣從四面八方合圍而來。" },
  { id: 4, name: "吐瓦魯 (Tuvalu)", area: "26 km²", lat: -7.1, lon: 177.6, diff: 1, desc: "海平面急劇上升淹沒防線，守住最後一座珊瑚島防空塔。" },
  { id: 5, name: "聖馬利諾 (San Marino)", area: "61 km²", lat: 43.9, lon: 12.4, diff: 1, desc: "孤峰險峻古堡，啟動地表高地反擊陣列。" },
  { id: 6, name: "列支敦斯登 (Liechtenstein)", area: "160 km²", lat: 47.1, lon: 9.5, diff: 1, desc: "阿爾卑斯山深谷隘口防禦戰，異形海嗣開始向高山蔓延。" },
  { id: 7, name: "馬紹爾群島 (Marshall Islands)", area: "181 km²", lat: 7.1, lon: 171.2, diff: 2, desc: "廣闊的環礁前線，面臨高速旋轉的環狀彈幕考驗。" },
  { id: 8, name: "聖克里斯多福及尼維斯 (Saint Kitts and Nevis)", area: "261 km²", lat: 17.3, lon: -62.7, diff: 2, desc: "加勒比海火山前哨站，地熱催化了更強烈的海嗣突變。" },
  { id: 9, name: "馬爾地夫 (Maldives)", area: "298 km²", lat: 3.2, lon: 73.2, diff: 2, desc: "千座珊瑚島淺灘激戰，大量半透明幽浮水母群現身！" },
  { id: 10, name: "馬爾他 (Malta)", area: "316 km²", lat: 35.9, lon: 14.4, diff: 2, desc: "地中海十字軍防禦古堡，阻截首批帶甲甲殼異獸。" },
  { id: 11, name: "格瑞那達 (Grenada)", area: "344 km²", lat: 12.1, lon: -61.6, diff: 2, desc: "香料群島海灣伏擊戰，海嗣試圖污染沿岸水源。" },
  { id: 12, name: "聖文森及格瑞那丁 (Saint Vincent)", area: "389 km²", lat: 13.2, lon: -61.2, diff: 2, desc: "大西洋暗礁防線，波濤中潛藏著狂暴先鋒的巨螯。" },
  { id: 13, name: "巴貝多 (Barbados)", area: "430 km²", lat: 13.1, lon: -59.5, diff: 2, desc: "大西洋迎潮最東哨站，雷達網發現深海巨獸集結。" },
  { id: 14, name: "安地卡及巴布達 (Antigua and Barbuda)", area: "442 km²", lat: 17.0, lon: -61.8, diff: 2, desc: "雙島游擊作戰，守護地表同盟雷達中繼站。" },
  { id: 15, name: "塞席爾 (Seychelles)", area: "459 km²", lat: -4.6, lon: 55.4, diff: 3, desc: "印度洋群島戰役，海嗣演化出了懸浮等離子放電腺體。" },
  { id: 16, name: "帛琉 (Palau)", area: "459 km²", lat: 7.5, lon: 134.5, diff: 3, desc: "洛克群島水下溶洞戰，深入海洋巢穴摧毀先遣孵化場。" },
  { id: 17, name: "安道爾 (Andorra)", area: "468 km²", lat: 42.5, lon: 1.5, diff: 3, desc: "庇里牛斯山高海拔作戰，強風夾雜著寒冰等離子彈。" },
  { id: 18, name: "關島 (Guam)", area: "544 km²", lat: 13.4, lon: 144.7, diff: 3, desc: "馬里亞納海溝最前哨！海洋霸主第一道震波在此爆發。" },
  { id: 19, name: "聖露西亞 (Saint Lucia)", area: "616 km²", lat: 13.9, lon: -61.0, diff: 3, desc: "雙子火山錐地形，高溫地熱迫使突變海嗣進入狂暴狀態。" },
  { id: 20, name: "密克羅尼西亞 (Micronesia)", area: "702 km²", lat: 6.9, lon: 158.2, diff: 3, desc: "散佈大洋的數百座島礁，建立環洋電磁鎖定網。" },
  { id: 21, name: "新加坡 (Singapore)", area: "734 km²", lat: 1.3, lon: 103.8, diff: 3, desc: "麻六甲海峽海港要塞，首度遭遇配備高密重甲的海嗣先鋒！" },
  { id: 22, name: "東加 (Tonga)", area: "747 km²", lat: -21.1, lon: -175.2, diff: 3, desc: "海溝火山噴發區，海嗣引發沸騰水汽阻擋視野。" },
  { id: 23, name: "多米尼克 (Dominica)", area: "751 km²", lat: 15.4, lon: -61.3, diff: 3, desc: "熱帶沸騰湖突變核心，消滅不斷增殖的毒液幼蟲。" },
  { id: 24, name: "巴林 (Bahrain)", area: "786 km²", lat: 26.0, lon: 50.5, diff: 3, desc: "波斯灣人工島防禦鏈，迎擊來自海灣盆地的重裝水族。" },
  { id: 25, name: "吉里巴斯 (Kiribati)", area: "811 km²", lat: 1.4, lon: 173.0, diff: 3, desc: "橫跨換日線的廣闊環礁，阻擊多點登陸的掠食群。" },
  { id: 26, name: "聖多美普林西比 (Sao Tome)", area: "964 km²", lat: 0.3, lon: 6.6, diff: 3, desc: "赤道幾內亞灣前哨，高溫潮濕環境下的突變肉搏。" },
  { id: 27, name: "模里西斯 (Mauritius)", area: "2,040 km²", lat: -20.3, lon: 57.5, diff: 4, desc: "海底瀑布奇觀裂隙，深海漩渦不斷將深淵巨獸推向陸地。" },
  { id: 28, name: "葛摩 (Comoros)", area: "2,235 km²", lat: -11.7, lon: 43.2, diff: 4, desc: "莫三比克海峽火山島，海防基地即將被黑潮吞沒！" },
  { id: 29, name: "盧森堡 (Luxembourg)", area: "2,586 km²", lat: 49.8, lon: 6.1, diff: 4, desc: "歐陸心臟要塞古堡，陸地同盟主力在此集結。" },
  { id: 30, name: "薩摩亞 (Samoa)", area: "2,842 km²", lat: -13.7, lon: -172.1, diff: 4, desc: "玻里尼西亞海防陣列，迎擊南太平洋湧現的深海浪潮。" },
  { id: 31, name: "維德角 (Cape Verde)", area: "4,033 km²", lat: 15.1, lon: -23.6, diff: 4, desc: "大西洋狂風群島，敵群在強烈颶風掩護下發起突擊。" },
  { id: 32, name: "千里達及托巴哥 (Trinidad & Tobago)", area: "5,128 km²", lat: 10.6, lon: -61.2, diff: 4, desc: "瀝青湖突變生物繁殖地，高黏性液體限制了走位空間！" },
  { id: 33, name: "汶萊 (Brunei)", area: "5,765 km²", lat: 4.5, lon: 114.7, diff: 4, desc: "婆羅洲石油海岸守護戰，保護陸地能源樞紐不被侵蝕。" },
  { id: 34, name: "賽普勒斯 (Cyprus)", area: "9,251 km²", lat: 35.1, lon: 33.4, diff: 4, desc: "東地中海十字路口，海嗣空陸雙向合圍。" },
  { id: 35, name: "黎巴嫩 (Lebanon)", area: "10,452 km²", lat: 33.8, lon: 35.8, diff: 4, desc: "雪松山脈與海岸斷崖，地表抗衛軍設置了等離子砲陣地。" },
  { id: 36, name: "牙買加 (Jamaica)", area: "10,991 km²", lat: 18.1, lon: -77.3, diff: 4, desc: "加勒比海核心，擊退沿海湧上的巨型突變寄生魚潮。" },
  { id: 37, name: "甘比亞 (Gambia)", area: "11,295 km²", lat: 13.4, lon: -16.5, diff: 4, desc: "狹長河道入海口，兩側均是湧上的水族伏兵。" },
  { id: 38, name: "卡達 (Qatar)", area: "11,586 km²", lat: 25.3, lon: 51.2, diff: 4, desc: "波斯灣極端炎熱戰線，海嗣的外殼在鹽鹼地發生結晶硬化。" },
  { id: 39, name: "萬那杜 (Vanuatu)", area: "12,189 km²", lat: -17.7, lon: 168.3, diff: 5, desc: "活火山熔岩海域，第二隻霸主級先鋒現身！" },
  { id: 40, name: "蒙特內哥羅 (Montenegro)", area: "13,812 km²", lat: 42.7, lon: 19.3, diff: 5, desc: "亞得里亞海峽灣陣地，狹窄水道中的機甲狙擊戰。" },
  { id: 41, name: "巴哈馬 (Bahamas)", area: "13,943 km²", lat: 25.0, lon: -77.3, diff: 5, desc: "百萬平坦珊瑚礁陷落區，搜索並解救被困科研小隊。" },
  { id: 42, name: "東帝汶 (Timor-Leste)", area: "14,874 km²", lat: -8.8, lon: 125.7, diff: 5, desc: "帝汶海海峽防線，海浪伴隨黑潮不斷拍打岩壁。" },
  { id: 43, name: "史瓦帝尼 (Eswatini)", area: "17,364 km²", lat: -26.5, lon: 31.4, diff: 5, desc: "內陸高原作戰，海嗣逆河流而上展開突襲。" },
  { id: 44, name: "科威特 (Kuwait)", area: "17,818 km²", lat: 29.3, lon: 47.9, diff: 5, desc: "沿海煉油基地保衛戰，點燃浮油阻擋登陸潮。" },
  { id: 45, name: "斐濟 (Fiji)", area: "18,274 km²", lat: -17.7, lon: 178.0, diff: 5, desc: "南太平洋大型要塞群，迎擊巨型幽浮水母母艦！" },
  { id: 46, name: "斯洛維尼亞 (Slovenia)", area: "20,273 km²", lat: 46.1, lon: 14.5, diff: 5, desc: "喀斯特地下溶洞突擊，粉碎海嗣建立的地下管道。" },
  { id: 47, name: "以色列 (Israel)", area: "22,072 km²", lat: 31.0, lon: 35.0, diff: 5, desc: "死海與地中海雙向抗潮，啟動鐵穹等離子防護罩。" },
  { id: 48, name: "吉布地 (Djibouti)", area: "23,200 km²", lat: 11.8, lon: 42.5, diff: 5, desc: "曼德海峽咽喉守衛戰，阻止紅海徹底淪為深海繁殖地。" },
  { id: 49, name: "盧安達 (Rwanda)", area: "26,338 km²", lat: -1.9, lon: 29.8, diff: 5, desc: "千丘之國高地防空網，阻擊懸浮飛行的深海孢子。" },
  { id: 50, name: "海地 (Haiti)", area: "27,750 km²", lat: 18.9, lon: -72.2, diff: 6, desc: "【中途大決戰】深海逆鱗共振引發百米巨浪，巨鰲先鋒領銜合圍！" },
  { id: 51, name: "亞美尼亞 (Armenia)", area: "29,743 km²", lat: 40.1, lon: 45.0, diff: 6, desc: "高加索山巔雷達要塞，極寒氣溫下的能量護甲考驗。" },
  { id: 52, name: "比利時 (Belgium)", area: "30,528 km²", lat: 50.8, lon: 4.3, diff: 6, desc: "北海運河防衛線，厚實合金胸甲將在戰鬥中掉落。" },
  { id: 53, name: "台灣 (Taiwan)", area: "36,197 km²", lat: 23.6, lon: 121.0, diff: 6, desc: "第一島鏈防衛樞紐！直面萬米海溝逆鱗沸騰潮，解鎖稀有護符！" },
  { id: 54, name: "瑞士 (Switzerland)", area: "41,285 km²", lat: 46.8, lon: 8.2, diff: 6, desc: "阿爾卑斯永凍掩體總部，地表文明最後的科研堡壘。" },
  { id: 55, name: "荷蘭 (Netherlands)", area: "41,543 km²", lat: 52.1, lon: 5.2, diff: 6, desc: "低地國大壩決死戰，海水拍碎堤防，機甲涉水作戰！" },
  { id: 56, name: "丹麥 (Denmark)", area: "43,094 km²", lat: 56.2, lon: 9.5, diff: 6, desc: "波羅的海出口封鎖戰，阻截成群掠食者越過大貝爾特海峽。" },
  { id: 57, name: "愛沙尼亞 (Estonia)", area: "45,227 km²", lat: 58.5, lon: 25.0, diff: 6, desc: "芬蘭灣南岸電子反制基地，敵潮開始干擾雷達通訊。" },
  { id: 58, name: "斯洛伐克 (Slovakia)", area: "49,035 km²", lat: 48.6, lon: 19.6, diff: 6, desc: "喀爾巴阡山脈關隘，地表戰甲在此完成第二次充能進化。" },
  { id: 59, name: "哥斯大黎加 (Costa Rica)", area: "51,100 km²", lat: 9.7, lon: -83.7, diff: 6, desc: "橫跨兩洋的雨林前哨，生物演化出對等離子免疫的酸性黏液。" },
  { id: 60, name: "克羅埃西亞 (Croatia)", area: "56,594 km²", lat: 45.1, lon: 15.2, diff: 6, desc: "亞得里亞海千島陣列，善用衝刺閃避連鎖水雷。" },
  { id: 61, name: "拉脫維亞 (Latvia)", area: "64,589 km²", lat: 56.9, lon: 24.6, diff: 7, desc: "波羅的海東岸泥炭沼澤戰，移動速度受到地表泥濘削弱！" },
  { id: 62, name: "立陶宛 (Lithuania)", area: "65,300 km²", lat: 55.1, lon: 23.8, diff: 7, desc: "庫爾斯沙嘴海岸阻截，巨型海怪不斷撞擊防波堤。" },
  { id: 63, name: "喬治亞 (Georgia)", area: "69,700 km²", lat: 42.3, lon: 43.3, diff: 7, desc: "黑海東岸險峻山谷，等離子砲火在此交織成網。" },
  { id: 64, name: "愛爾蘭 (Ireland)", area: "70,273 km²", lat: 53.4, lon: -7.6, diff: 7, desc: "莫赫懸崖大西洋巨浪前哨，百米浪頭拍落大量飛行海嗣。" },
  { id: 65, name: "巴拿馬 (Panama)", area: "75,417 km²", lat: 8.5, lon: -80.1, diff: 7, desc: "巴拿馬運河水閘血戰，兩洋海嗣合流引發大混戰！" },
  { id: 66, name: "奧地利 (Austria)", area: "83,879 km²", lat: 47.5, lon: 14.5, diff: 7, desc: "多瑙河流域腹地，地表軍隊成功奪回重工業基地。" },
  { id: 67, name: "約旦 (Jordan)", area: "89,342 km²", lat: 30.5, lon: 36.2, diff: 7, desc: "紅海阿卡巴灣防禦陣列，狙擊巨型深海刺蝟怪。" },
  { id: 68, name: "葡萄牙 (Portugal)", area: "92,212 km²", lat: 39.3, lon: -8.2, diff: 7, desc: "羅卡角——歐陸極西端迎潮要塞，大西洋黑潮在此碰壁。" },
  { id: 69, name: "匈牙利 (Hungary)", area: "93,028 km²", lat: 47.1, lon: 19.5, diff: 7, desc: "喀爾巴阡平原機甲大會戰，開啟全螢幕火力覆蓋。" },
  { id: 70, name: "南韓 (South Korea)", area: "100,210 km²", lat: 35.9, lon: 127.7, diff: 7, desc: "釜山海港與半島咽喉，海嗣成群結隊衝擊電磁拒馬。" },
  { id: 71, name: "冰島 (Iceland)", area: "103,000 km²", lat: 64.9, lon: -19.0, diff: 8, desc: "冰與火之島，大洋中脊裂谷中爬出史詩級熔岩海怪！" },
  { id: 72, name: "古巴 (Cuba)", area: "109,884 km²", lat: 21.5, lon: -77.7, diff: 8, desc: "墨西哥灣門戶防守要衝，解鎖高階神話級配件。" },
  { id: 73, name: "希臘 (Greece)", area: "131,957 km²", lat: 39.0, lon: 22.0, diff: 8, desc: "愛琴海千島散兵防衛陣，守護帕德嫩高地雷達核心。" },
  { id: 74, name: "尼泊爾 (Nepal)", area: "147,181 km²", lat: 28.3, lon: 84.1, diff: 8, desc: "喜馬拉雅世界屋脊天險，極度缺氧下維持反應堆運轉。" },
  { id: 75, name: "烏拉圭 (Uruguay)", area: "176,215 km²", lat: -32.5, lon: -55.7, diff: 8, desc: "拉普拉塔河口阻截，泥沙翻湧中撕碎變異海嗣。" },
  { id: 76, name: "英國 (United Kingdom)", area: "242,495 km²", lat: 55.3, lon: -3.4, diff: 8, desc: "多佛白崖前線，大西洋與北海海嗣在此發起鉗形攻勢。" },
  { id: 77, name: "紐西蘭 (New Zealand)", area: "268,021 km²", lat: -40.9, lon: 174.8, diff: 8, desc: "庫克海峽斷崖陣列，南太平洋深淵巨獸狂暴登陸。" },
  { id: 78, name: "菲律賓 (Philippines)", area: "300,000 km²", lat: 12.8, lon: 121.7, diff: 8, desc: "蘇祿海群島狂暴登陸潮，連續三波精英巨獸合圍！" },
  { id: 79, name: "義大利 (Italy)", area: "301,340 km²", lat: 41.8, lon: 12.5, diff: 8, desc: "亞平寧半島三面受敵戰線，地中海狂潮幾乎將陸地切斷。" },
  { id: 80, name: "挪威 (Norway)", area: "323,802 km²", lat: 60.4, lon: 8.4, diff: 8, desc: "險峻北極峽灣深處，擊破深海狂暴霸主北極前鋒！" },
  { id: 81, name: "馬來西亞 (Malaysia)", area: "330,803 km²", lat: 4.2, lon: 101.9, diff: 8, desc: "兩洋熱帶雨林防衛戰，酸液雨水不斷腐蝕作戰外甲。" },
  { id: 82, name: "越南 (Vietnam)", area: "331,212 km²", lat: 14.0, lon: 108.2, diff: 8, desc: "湄公河三角洲水上機甲戰，水道深處潛伏著發光母體。" },
  { id: 83, name: "芬蘭 (Finland)", area: "338,424 km²", lat: 61.9, lon: 25.7, diff: 8, desc: "千湖之國凍原阻擊防線，海嗣突破冰層破冰而出。" },
  { id: 84, name: "德國 (Germany)", area: "357,022 km²", lat: 51.1, lon: 10.4, diff: 9, desc: "北海與波羅的海重工業基地，啟動全自動脈衝砲塔。" },
  { id: 85, name: "日本 (Japan)", area: "377,975 km²", lat: 36.2, lon: 138.2, diff: 9, desc: "環太平洋火環帶海溝直擊！面對釋放全屏星芒雷射的巨獸！" },
  { id: 86, name: "瑞典 (Sweden)", area: "450,295 km²", lat: 60.1, lon: 18.6, diff: 9, desc: "斯堪地那維亞針葉林陣線，極光下迎擊極地變異體。" },
  { id: 87, name: "西班牙 (Spain)", area: "505,990 km²", lat: 40.4, lon: -3.7, diff: 9, desc: "直布羅陀海峽門戶保衛戰，徹底鎖死大西洋湧入地中海的通道！" },
  { id: 88, name: "泰國 (Thailand)", area: "513,120 km²", lat: 15.8, lon: 100.9, diff: 9, desc: "暹羅灣狂潮登陸，地表軍隊推進至熱帶沿岸。" },
  { id: 89, name: "烏克蘭 (Ukraine)", area: "603,500 km²", lat: 48.3, lon: 31.1, diff: 9, desc: "黑海北岸廣袤平原，開闊平原上的萬隻海嗣大圍剿！" },
  { id: 90, name: "法國 (France)", area: "643,801 km²", lat: 46.2, lon: 2.2, diff: 9, desc: "大西洋與地中海雙線海潮夾擊，地表防衛聯軍總動員。" },
  { id: 91, name: "智利 (Chile)", area: "756,102 km²", lat: -35.6, lon: -71.5, diff: 9, desc: "四千公里狹長海岸線極限拉扯，挑戰超長生存防線！" },
  { id: 92, name: "土耳其 (Turkey)", area: "783,562 km²", lat: 38.9, lon: 35.2, diff: 9, desc: "博斯普魯斯海峽歐亞天險，兩大板塊交界處的巨型要塞。" },
  { id: 93, name: "埃及 (Egypt)", area: "1,002,450 km²", lat: 26.8, lon: 30.8, diff: 9, desc: "蘇伊士運河咽喉全面封鎖戰，紅海霸主真身初露端倪。" },
  { id: 94, name: "南非 (South Africa)", area: "1,221,037 km²", lat: -30.5, lon: 22.9, diff: 9, desc: "好望角狂暴風暴海角防衛戰，三大洋水族在此瘋狂匯聚！" },
  { id: 95, name: "印尼 (Indonesia)", area: "1,904,569 km²", lat: -0.7, lon: 113.9, diff: 10, desc: "萬島之國巨型海域戰役，兩洋交界處的終極登陸潮！" },
  { id: 96, name: "印度 (India)", area: "3,287,263 km²", lat: 20.5, lon: 78.9, diff: 10, desc: "印度洋半島三角陣列，阻截自南印度洋海溝湧上的無盡敵潮。" },
  { id: 97, name: "澳洲 (Australia)", area: "7,692,024 km²", lat: -25.2, lon: 133.7, diff: 10, desc: "獨立大陸板塊巡邏防線，大堡礁海域誕生了神話級變異母體！" },
  { id: 98, name: "巴西 (Brazil)", area: "8,515,767 km²", lat: -14.2, lon: -51.9, diff: 10, desc: "亞馬遜河入海口，深海病毒母體盤踞雨林水網發起反撲！" },
  { id: 99, name: "美國 (United States)", area: "9,833,517 km²", lat: 37.0, lon: -95.7, diff: 10, desc: "兩洋沿岸防禦總署決死阻擊，五大湖區湧現巨型深淵裂縫！" },
  { id: 100, name: "加拿大與全球終局 (Global Core)", area: "10,000,000+ km²", lat: 56.1, lon: -106.3, diff: 10, desc: "【世界終局決戰】北極冰蓋與全球海溝同步崩裂，深海王者本體降臨！" }
];

/* ==================== 存檔系統 (LocalStorage 持久化) ==================== */
const SAVE_KEY = "SSTS_SURFACE_SURVIVORS_SAVE_V1";

const defaultSaveState = {
  unlockedStage: 1, // 最高解鎖關卡 (1~100)
  currentSelectedStage: 1,
  playerLevel: 1,
  playerExp: 0,
  playerNextExp: 6,
  playerMaxHp: 100,
  myInventory: [], // 獲得的所有裝備
  equipped: {
    helmet: null,
    armor: null,
    gloves: null,
    boots: null,
    accessory: null,
    talisman: null,
    weapon: { type: 'bare', name: '空手電磁衝擊', damage: 22, speed: 7, color: '#38bdf8' }
  }
};

let userSave = { ...defaultSaveState };

function loadGameSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      userSave = { ...defaultSaveState, ...parsed };
      return true;
    }
  } catch(e) {
    console.warn("無法讀取存檔", e);
  }
  userSave = { ...defaultSaveState };
  return false;
}

function saveGameProgress() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(userSave));
    const statusText = document.getElementById('map-save-status');
    if (statusText) {
      statusText.innerText = "進度已即時存檔 (" + new Date().toLocaleTimeString() + ")";
    }
  } catch(e) {
    console.warn("存檔失敗", e);
  }
}

function resetSaveData() {
  if (confirm("確定要重設所有遊戲進度、關卡與裝備嗎？這將無法復原。")) {
    localStorage.removeItem(SAVE_KEY);
    userSave = { ...defaultSaveState };
    saveGameProgress();
    location.reload();
  }
}

/* ==================== 3D 旋轉科技地球渲染系統 ==================== */
const globeCanvas = document.getElementById('globe-canvas');
const gctx = globeCanvas.getContext('2d');

let globeRotation = 0; // 地球自轉經度弧度
let globeTilt = 0.35;  // 地球俯視傾角
let isDraggingGlobe = false;
let lastMouseX = 0;
let globeAnimId = null;

// 初始化拖曳事件
globeCanvas.addEventListener('mousedown', e => {
  isDraggingGlobe = true;
  lastMouseX = e.clientX;
});
window.addEventListener('mouseup', () => { isDraggingGlobe = false; });
window.addEventListener('mousemove', e => {
  if (!isDraggingGlobe) return;
  const deltaX = e.clientX - lastMouseX;
  globeRotation += deltaX * 0.008;
  lastMouseX = e.clientX;
});

// 手機觸控旋轉
globeCanvas.addEventListener('touchstart', e => {
  isDraggingGlobe = true;
  lastMouseX = e.touches[0].clientX;
}, { passive: true });
window.addEventListener('touchend', () => { isDraggingGlobe = false; });
window.addEventListener('touchmove', e => {
  if (!isDraggingGlobe) return;
  const deltaX = e.touches[0].clientX - lastMouseX;
  globeRotation += deltaX * 0.012;
  lastMouseX = e.touches[0].clientX;
}, { passive: true });

/**
 * 3D 球體座標投影換算
 */
function projectSphere(latDeg, lonDeg, radius, center, rotY, tiltX) {
  const lat = latDeg * (Math.PI / 180);
  const lon = lonDeg * (Math.PI / 180) + rotY;

  // 球面直角座標 (X, Y, Z)
  let x = radius * Math.cos(lat) * Math.sin(lon);
  let y = -radius * Math.sin(lat);
  let z = radius * Math.cos(lat) * Math.cos(lon);

  // 繞 X 軸傾斜俯視 (Tilt)
  const cosT = Math.cos(tiltX);
  const sinT = Math.sin(tiltX);
  const yRot = y * cosT - z * sinT;
  const zRot = y * sinT + z * cosT;

  return {
    screenX: center.x + x,
    screenY: center.y + yRot,
    visible: zRot > -10, // Z > 0 位於地球正面面向玩家
    depth: zRot / radius
  };
}

/**
 * 繪製地球本體、經緯線、大氣層與 100 國發光節點
 */
function drawGlobeScene() {
  if (document.getElementById('world-map-screen').style.display !== 'flex') return;

  if (!isDraggingGlobe) {
    globeRotation += 0.003; // 自動緩慢平滑自轉
  }

  gctx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);
  const cx = globeCanvas.width / 2;
  const cy = globeCanvas.height / 2;
  const radius = 140;

  // 1. 外大氣發光層
  const atmosGrad = gctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.25);
  atmosGrad.addColorStop(0, "rgba(56, 189, 248, 0.2)");
  atmosGrad.addColorStop(0.7, "rgba(14, 165, 233, 0.08)");
  atmosGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
  gctx.fillStyle = atmosGrad;
  gctx.beginPath();
  gctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
  gctx.fill();

  // 2. 地球球體底色 (深邃海洋藍)
  const globeGrad = gctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, radius);
  globeGrad.addColorStop(0, "#083344");
  globeGrad.addColorStop(0.7, "#0c1a30");
  globeGrad.addColorStop(1, "#020617");
  gctx.fillStyle = globeGrad;
  gctx.beginPath();
  gctx.arc(cx, cy, radius, 0, Math.PI * 2);
  gctx.fill();

  // 3. 經緯網格線 (球面線條)
  gctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
  gctx.lineWidth = 1;
  // 繪製緯線圈
  for (let lat = -60; lat <= 60; lat += 30) {
    gctx.beginPath();
    let first = true;
    for (let lon = -180; lon <= 180; lon += 10) {
      const p = projectSphere(lat, lon, radius, { x: cx, y: cy }, globeRotation, globeTilt);
      if (p.visible) {
        if (first) { gctx.moveTo(p.screenX, p.screenY); first = false; }
        else gctx.lineTo(p.screenX, p.screenY);
      } else {
        first = true;
      }
    }
    gctx.stroke();
  }
  // 繪製經線圈
  for (let lon = 0; lon < 360; lon += 45) {
    gctx.beginPath();
    let first = true;
    for (let lat = -80; lat <= 80; lat += 10) {
      const p = projectSphere(lat, lon, radius, { x: cx, y: cy }, globeRotation, globeTilt);
      if (p.visible) {
        if (first) { gctx.moveTo(p.screenX, p.screenY); first = false; }
        else gctx.lineTo(p.screenX, p.screenY);
      } else {
        first = true;
      }
    }
    gctx.stroke();
  }

  // 4. 球體外金屬科技環
  gctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  gctx.lineWidth = 2;
  gctx.beginPath();
  gctx.arc(cx, cy, radius, 0, Math.PI * 2);
  gctx.stroke();

  // 5. 繪製關卡航點 (100 國節點)
  const currentSel = userSave.currentSelectedStage;
  const maxUnlocked = userSave.unlockedStage;

  COUNTRIES_STAGE_DATA.forEach(stage => {
    const proj = projectSphere(stage.lat, stage.lon, radius, { x: cx, y: cy }, globeRotation, globeTilt);

    if (proj.visible) {
      const isSelected = stage.id === currentSel;
      const isUnlocked = stage.id <= maxUnlocked;
      const isCleared = stage.id < maxUnlocked;

      gctx.save();
      gctx.translate(proj.screenX, proj.screenY);

      if (isSelected) {
        // 選中目標：強力雷達擴散光圈
        gctx.strokeStyle = "#38bdf8";
        gctx.lineWidth = 2;
        gctx.beginPath();
        gctx.arc(0, 0, 9 + Math.sin(Date.now() * 0.008) * 3, 0, Math.PI * 2);
        gctx.stroke();

        gctx.fillStyle = "#ffffff";
        gctx.shadowColor = "#38bdf8";
        gctx.shadowBlur = 12;
        gctx.beginPath();
        gctx.arc(0, 0, 5, 0, Math.PI * 2);
        gctx.fill();

        // 標註國名浮動字樣
        gctx.font = "bold 11px sans-serif";
        gctx.fillStyle = "#38bdf8";
        gctx.textAlign = "center";
        gctx.fillText(stage.name.split(' ')[0], 0, -14);

      } else if (isCleared) {
        // 已收復領土：綠色星芒節點
        gctx.fillStyle = "#10b981";
        gctx.beginPath();
        gctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        gctx.fill();
      } else if (isUnlocked) {
        // 當前最高可挑戰關卡：金色警示呼吸光點
        gctx.fillStyle = "#facc15";
        gctx.shadowColor = "#eab308";
        gctx.shadowBlur = 8;
        gctx.beginPath();
        gctx.arc(0, 0, 4, 0, Math.PI * 2);
        gctx.fill();
      } else {
        // 尚未解鎖：暗紅小點
        gctx.fillStyle = "rgba(239, 68, 68, 0.4)";
        gctx.beginPath();
        gctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        gctx.fill();
      }

      gctx.restore();
    }
  });

  globeAnimId = requestAnimationFrame(drawGlobeScene);
}

/* ==================== 關卡資訊與選關操作 ==================== */
function updateSelectedStageUI() {
  const stage = COUNTRIES_STAGE_DATA.find(s => s.id === userSave.currentSelectedStage) || COUNTRIES_STAGE_DATA[0];
  const maxUnlocked = userSave.unlockedStage;
  const isUnlocked = stage.id <= maxUnlocked;

  document.getElementById('stage-rank-tag').innerText = `STAGE ${String(stage.id).padStart(3, '0')} / 100`;
  document.getElementById('stage-country-name').innerText = stage.name;
  document.getElementById('stage-area-data').innerText = `國土面積：約 ${stage.area}`;
  document.getElementById('stage-brief-box').innerText = stage.desc;

  // 難度星號
  let stars = "";
  for (let i = 0; i < 5; i++) stars += (i < Math.min(5, Math.ceil(stage.diff / 2))) ? "★" : "☆";
  document.getElementById('stage-difficulty').innerText = stars;

  // 按鈕狀態
  const enterBtn = document.getElementById('btn-enter-stage');
  if (isUnlocked) {
    enterBtn.classList.remove('locked');
    enterBtn.innerText = stage.id < maxUnlocked ? "重溫作戰" : "出擊作戰";
  } else {
    enterBtn.classList.add('locked');
    enterBtn.innerText = "🔒 尚未收復前置國家";
  }

  // 聚焦地球角度至該國經度
  globeRotation = -(stage.lon * (Math.PI / 180));
}

function nextStage() {
  if (userSave.currentSelectedStage < 100) {
    userSave.currentSelectedStage++;
    updateSelectedStageUI();
    playTone(550, 'sine', 0.08);
  }
}

function prevStage() {
  if (userSave.currentSelectedStage > 1) {
    userSave.currentSelectedStage--;
    updateSelectedStageUI();
    playTone(450, 'sine', 0.08);
  }
}

// 點擊出擊開始戰鬥
function launchSelectedStage() {
  if (userSave.currentSelectedStage > userSave.unlockedStage) {
    alert("此國家防線尚未解鎖！必須先收復前面的國家。");
    return;
  }

  playTone(880, 'square', 0.2);
  if (globeAnimId) cancelAnimationFrame(globeAnimId);

  document.getElementById('world-map-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'flex';

  // 啟動對應國家關卡
  startCountryBattle(userSave.currentSelectedStage);
}

// 進入大地圖介面
function openWorldMapScreen() {
  document.getElementById('title-screen').style.display = 'none';
  document.getElementById('story-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('world-map-screen').style.display = 'flex';

  updateSelectedStageUI();
  saveGameProgress();

  if (!globeAnimId) drawGlobeScene();
}

// 首頁「延續進度」按鈕
function continueGameFromSave() {
  initAudio();
  requestLandscapeFullscreen();
  const hasSave = loadGameSave();
  if (hasSave) {
    openWorldMapScreen();
  } else {
    alert("尚無歷史存檔，將從最初故事開始。");
    startStory();
  }
}
