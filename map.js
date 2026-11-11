/**
 * SSTS - 全球選關、大洲環境濾鏡、國旗與大地圖人形背包系統 (map.js)
 */

const COUNTRIES_STAGE_DATA = [
  { id: 1, flag: "🇻🇦", name: "梵蒂岡 (Vatican City)", area: "0.49 km²", continent: "EU", lat: 41.9, lon: 12.4, diff: 1, desc: "微型聖城，受到突變海嗣最初圍困。擊退登陸潮並收復第一塊地表領土！" },
  { id: 2, flag: "🇲🇨", name: "摩納哥 (Monaco)", area: "2.02 km²", continent: "EU", lat: 43.7, lon: 7.4, diff: 1, desc: "濱海懸崖港灣，突變寄生魚自地中海深處上岸！" },
  { id: 3, flag: "🇳🇷", name: "諾魯 (Nauru)", area: "21 km²", continent: "OC", lat: -0.5, lon: 166.9, diff: 1, desc: "孤立南太平洋環礁，海嗣從四面八方合圍而來。" },
  { id: 4, flag: "🇹🇻", name: "吐瓦魯 (Tuvalu)", area: "26 km²", continent: "OC", lat: -7.1, lon: 177.6, diff: 1, desc: "海平面急劇上升淹沒防線，守住最後一座珊瑚島防空塔。" },
  { id: 5, flag: "🇸🇲", name: "聖馬利諾 (San Marino)", area: "61 km²", continent: "EU", lat: 43.9, lon: 12.4, diff: 1, desc: "孤峰險峻古堡，啟動地表高地反擊陣列。" },
  { id: 6, flag: "🇱🇮", name: "列支敦斯登 (Liechtenstein)", area: "160 km²", continent: "EU", lat: 47.1, lon: 9.5, diff: 1, desc: "阿爾卑斯山深谷隘口防禦戰，異形海嗣開始向高山蔓延。" },
  { id: 7, flag: "🇲🇭", name: "馬紹爾群島 (Marshall Islands)", area: "181 km²", continent: "OC", lat: 7.1, lon: 171.2, diff: 2, desc: "廣闊的環礁前線，面臨高速旋轉的環狀彈幕考驗。" },
  { id: 8, flag: "🇰🇳", name: "聖克里斯多福及尼維斯", area: "261 km²", continent: "AM", lat: 17.3, lon: -62.7, diff: 2, desc: "加勒比海火山前哨站，地熱催化了更強烈的海嗣突變。" },
  { id: 9, flag: "🇲🇻", name: "馬爾地夫 (Maldives)", area: "298 km²", continent: "AS", lat: 3.2, lon: 73.2, diff: 2, desc: "千座珊瑚島淺灘激戰，大量半透明幽浮水母群現身！" },
  { id: 10, flag: "🇲🇹", name: "馬爾他 (Malta)", area: "316 km²", continent: "EU", lat: 35.9, lon: 14.4, diff: 2, desc: "地中海十字軍防禦古堡，阻截首批帶甲甲殼異獸。" },
  { id: 11, flag: "🇬🇩", name: "格瑞那達 (Grenada)", area: "344 km²", continent: "AM", lat: 12.1, lon: -61.6, diff: 2, desc: "香料群島海灣伏擊戰，海嗣試圖污染沿岸水源。" },
  { id: 12, flag: "🇻🇨", name: "聖文森及格瑞那丁", area: "389 km²", continent: "AM", lat: 13.2, lon: -61.2, diff: 2, desc: "大西洋暗礁防線，波濤中潛藏著狂暴先鋒的巨螯。" },
  { id: 13, flag: "🇧🇧", name: "巴貝多 (Barbados)", area: "430 km²", continent: "AM", lat: 13.1, lon: -59.5, diff: 2, desc: "大西洋迎潮最東哨站，雷達網發現深海巨獸集結。" },
  { id: 14, flag: "🇦🇬", name: "安地卡及巴布達", area: "442 km²", continent: "AM", lat: 17.0, lon: -61.8, diff: 2, desc: "雙島游擊作戰，守護地表同盟雷達中繼站。" },
  { id: 15, flag: "🇸🇨", name: "塞席爾 (Seychelles)", area: "459 km²", continent: "AF", lat: -4.6, lon: 55.4, diff: 3, desc: "印度洋群島戰役，海嗣演化出了懸浮等離子放電腺體。" },
  { id: 16, flag: "🇵🇼", name: "帛琉 (Palau)", area: "459 km²", continent: "OC", lat: 7.5, lon: 134.5, diff: 3, desc: "洛克群島水下溶洞戰，深入海洋巢穴摧毀先遣孵化場。" },
  { id: 17, flag: "🇦🇩", name: "安道爾 (Andorra)", area: "468 km²", continent: "EU", lat: 42.5, lon: 1.5, diff: 3, desc: "庇里牛斯山高海拔作戰，強風夾雜著寒冰等離子彈。" },
  { id: 18, flag: "🇬🇺", name: "關島 (Guam)", area: "544 km²", continent: "OC", lat: 13.4, lon: 144.7, diff: 3, desc: "馬里亞納海溝最前哨！海洋霸主第一道震波在此爆發。" },
  { id: 19, flag: "🇱🇨", name: "聖露西亞 (Saint Lucia)", area: "616 km²", continent: "AM", lat: 13.9, lon: -61.0, diff: 3, desc: "雙子火山錐地形，高溫地熱迫使突變海嗣進入狂暴狀態。" },
  { id: 20, flag: "🇫🇲", name: "密克羅尼西亞 (Micronesia)", area: "702 km²", continent: "OC", lat: 6.9, lon: 158.2, diff: 3, desc: "散佈大洋的數百座島礁，建立環洋電磁鎖定網。" },
  { id: 21, flag: "🇸🇬", name: "新加坡 (Singapore)", area: "734 km²", continent: "AS", lat: 1.3, lon: 103.8, diff: 3, desc: "麻六甲海峽海港要塞，首度遭遇配備高密重甲的海嗣先鋒！" },
  { id: 22, flag: "🇹🇴", name: "東加 (Tonga)", area: "747 km²", continent: "OC", lat: -21.1, lon: -175.2, diff: 3, desc: "海溝火山噴發區，海嗣引發沸騰水汽阻擋視野。" },
  { id: 23, flag: "🇩🇲", name: "多米尼克 (Dominica)", area: "751 km²", continent: "AM", lat: 15.4, lon: -61.3, diff: 3, desc: "熱帶沸騰湖突變核心，消滅不斷增殖的毒液幼蟲。" },
  { id: 24, flag: "🇧🇭", name: "巴林 (Bahrain)", area: "786 km²", continent: "AS", lat: 26.0, lon: 50.5, diff: 3, desc: "波斯灣人工島防禦鏈，迎擊來自海灣盆地的重裝水族。" },
  { id: 25, flag: "🇰🇮", name: "吉里巴斯 (Kiribati)", area: "811 km²", continent: "OC", lat: 1.4, lon: 173.0, diff: 3, desc: "橫跨換日線的廣闊環礁，阻擊多點登陸的掠食群。" },
  { id: 26, flag: "🇸🇹", name: "聖多美普林西比", area: "964 km²", continent: "AF", lat: 0.3, lon: 6.6, diff: 3, desc: "赤道幾內亞灣前哨，高溫潮濕環境下的突變肉搏。" },
  { id: 27, flag: "🇲🇺", name: "模里西斯 (Mauritius)", area: "2,040 km²", continent: "AF", lat: -20.3, lon: 57.5, diff: 4, desc: "海底瀑布奇觀裂隙，深海漩渦不斷將深淵巨獸推向陸地。" },
  { id: 28, flag: "🇰🇲", name: "葛摩 (Comoros)", area: "2,235 km²", continent: "AF", lat: -11.7, lon: 43.2, diff: 4, desc: "莫三比克海峽火山島，海防基地即將被黑潮吞沒！" },
  { id: 29, flag: "🇱🇺", name: "盧森堡 (Luxembourg)", area: "2,586 km²", continent: "EU", lat: 49.8, lon: 6.1, diff: 4, desc: "歐陸心臟要塞古堡，陸地同盟主力在此集結。" },
  { id: 30, flag: "🇼🇸", name: "薩摩亞 (Samoa)", area: "2,842 km²", continent: "OC", lat: -13.7, lon: -172.1, diff: 4, desc: "玻里尼西亞海防陣列，迎擊南太平洋湧現的深海浪潮。" },
  { id: 31, flag: "🇨🇻", name: "維德角 (Cape Verde)", area: "4,033 km²", continent: "AF", lat: 15.1, lon: -23.6, diff: 4, desc: "大西洋狂風群島，敵群在強烈颶風掩護下發起突擊。" },
  { id: 32, flag: "🇹🇹", name: "千里達及托巴哥", area: "5,128 km²", continent: "AM", lat: 10.6, lon: -61.2, diff: 4, desc: "瀝青湖突變生物繁殖地，高黏性液體限制了走位空間！" },
  { id: 33, flag: "🇧🇳", name: "汶萊 (Brunei)", area: "5,765 km²", continent: "AS", lat: 4.5, lon: 114.7, diff: 4, desc: "婆羅洲石油海岸守護戰，保護陸地能源樞紐不被侵蝕。" },
  { id: 34, flag: "🇨🇾", name: "賽普勒斯 (Cyprus)", area: "9,251 km²", continent: "AS", lat: 35.1, lon: 33.4, diff: 4, desc: "東地中海十字路口，海嗣空陸雙向合圍。" },
  { id: 35, flag: "🇱🇧", name: "黎巴嫩 (Lebanon)", area: "10,452 km²", continent: "AS", lat: 33.8, lon: 35.8, diff: 4, desc: "雪松山脈與海岸斷崖，地表抗衛軍設置了等離子砲陣地。" },
  { id: 36, flag: "🇯🇲", name: "牙買加 (Jamaica)", area: "10,991 km²", continent: "AM", lat: 18.1, lon: -77.3, diff: 4, desc: "加勒比海核心，擊退沿海湧上的巨型突變寄生魚潮。" },
  { id: 37, flag: "🇬🇲", name: "甘比亞 (Gambia)", area: "11,295 km²", continent: "AF", lat: 13.4, lon: -16.5, diff: 4, desc: "狹長河道入海口，兩側均是湧上的水族伏兵。" },
  { id: 38, flag: "🇶🇦", name: "卡達 (Qatar)", area: "11,586 km²", continent: "AS", lat: 25.3, lon: 51.2, diff: 4, desc: "波斯灣極端炎熱戰線，海嗣的外殼在鹽鹼地發生結晶硬化。" },
  { id: 39, flag: "🇻🇺", name: "萬那杜 (Vanuatu)", area: "12,189 km²", continent: "OC", lat: -17.7, lon: 168.3, diff: 5, desc: "活火山熔岩海域，第二隻霸主級先鋒現身！" },
  { id: 40, flag: "🇲🇪", name: "蒙特內哥羅 (Montenegro)", area: "13,812 km²", continent: "EU", lat: 42.7, lon: 19.3, diff: 5, desc: "亞得里亞海峽灣陣地，狹窄水道中的機甲狙擊戰。" },
  { id: 41, flag: "🇧🇸", name: "巴哈馬 (Bahamas)", area: "13,943 km²", continent: "AM", lat: 25.0, lon: -77.3, diff: 5, desc: "百萬平坦珊瑚礁陷落區，搜索並解救被困科研小隊。" },
  { id: 42, flag: "🇹🇱", name: "東帝汶 (Timor-Leste)", area: "14,874 km²", continent: "AS", lat: -8.8, lon: 125.7, diff: 5, desc: "帝汶海海峽防線，海浪伴隨黑潮不斷拍打岩壁。" },
  { id: 43, flag: "🇸🇿", name: "史瓦帝尼 (Eswatini)", area: "17,364 km²", continent: "AF", lat: -26.5, lon: 31.4, diff: 5, desc: "內陸高原作戰，海嗣逆河流而上展開突襲。" },
  { id: 44, flag: "🇰🇼", name: "科威特 (Kuwait)", area: "17,818 km²", continent: "AS", lat: 29.3, lon: 47.9, diff: 5, desc: "沿海煉油基地保衛戰，點燃浮油阻擋登陸潮。" },
  { id: 45, flag: "🇫🇯", name: "斐濟 (Fiji)", area: "18,274 km²", continent: "OC", lat: -17.7, lon: 178.0, diff: 5, desc: "南太平洋大型要塞群，迎擊巨型幽浮水母母艦！" },
  { id: 46, flag: "🇸🇮", name: "斯洛維尼亞 (Slovenia)", area: "20,273 km²", continent: "EU", lat: 46.1, lon: 14.5, diff: 5, desc: "喀斯特地下溶洞突擊，粉碎海嗣建立的地下管道。" },
  { id: 47, flag: "🇮🇱", name: "以色列 (Israel)", area: "22,072 km²", continent: "AS", lat: 31.0, lon: 35.0, diff: 5, desc: "死海與地中海雙向抗潮，啟動鐵穹等離子防護罩。" },
  { id: 48, flag: "🇩🇯", name: "吉布地 (Djibouti)", area: "23,200 km²", continent: "AF", lat: 11.8, lon: 42.5, diff: 5, desc: "曼德海峽咽喉守衛戰，阻止紅海徹底淪為深海繁殖地。" },
  { id: 49, flag: "🇷🇼", name: "盧安達 (Rwanda)", area: "26,338 km²", continent: "AF", lat: -1.9, lon: 29.8, diff: 5, desc: "千丘之國高地防空網，阻擊懸浮飛行的深海孢子。" },
  { id: 50, flag: "🇭🇹", name: "海地 (Haiti)", area: "27,750 km²", continent: "AM", lat: 18.9, lon: -72.2, diff: 6, desc: "【中途大決戰】深海逆鱗引發百米巨浪，巨鰲先鋒合圍！" },
  { id: 51, flag: "🇦🇲", name: "亞美尼亞 (Armenia)", area: "29,743 km²", continent: "AS", lat: 40.1, lon: 45.0, diff: 6, desc: "高加索山巔雷達要塞，極寒氣溫下的能量護甲考驗。" },
  { id: 52, flag: "🇧🇪", name: "比利時 (Belgium)", area: "30,528 km²", continent: "EU", lat: 50.8, lon: 4.3, diff: 6, desc: "北海運河防衛線，厚實合金胸甲將在戰鬥中掉落。" },
  { id: 53, flag: "🇹🇼", name: "台灣 (Taiwan)", area: "36,197 km²", continent: "AS", lat: 23.6, lon: 121.0, diff: 6, desc: "第一島鏈防衛樞紐！直面萬米海溝沸騰潮，解鎖稀有護符！" },
  { id: 54, flag: "🇨🇭", name: "瑞士 (Switzerland)", area: "41,285 km²", continent: "EU", lat: 46.8, lon: 8.2, diff: 6, desc: "阿爾卑斯永凍掩體總部，地表文明最後的科研堡壘。" },
  { id: 55, flag: "🇳🇱", name: "荷蘭 (Netherlands)", area: "41,543 km²", continent: "EU", lat: 52.1, lon: 5.2, diff: 6, desc: "低地國大壩決死戰，海水拍碎堤防，機甲涉水作戰！" },
  { id: 56, flag: "🇩🇰", name: "丹麥 (Denmark)", area: "43,094 km²", continent: "EU", lat: 56.2, lon: 9.5, diff: 6, desc: "波羅的海出口封鎖戰，阻截成群掠食者越過大貝爾特海峽。" },
  { id: 57, flag: "🇪🇪", name: "愛沙尼亞 (Estonia)", area: "45,227 km²", continent: "EU", lat: 58.5, lon: 25.0, diff: 6, desc: "芬蘭灣南岸電子反制基地，敵潮開始干擾雷達通訊。" },
  { id: 58, flag: "🇸🇰", name: "斯洛伐克 (Slovakia)", area: "49,035 km²", continent: "EU", lat: 48.6, lon: 19.6, diff: 6, desc: "喀爾巴阡山脈關隘，地表戰甲在此完成充能進化。" },
  { id: 59, flag: "🇨🇷", name: "哥斯大黎加 (Costa Rica)", area: "51,100 km²", continent: "AM", lat: 9.7, lon: -83.7, diff: 6, desc: "橫跨兩洋雨林前哨，生物演化出對等離子免疫的酸性黏液。" },
  { id: 60, flag: "🇭🇷", name: "克羅埃西亞 (Croatia)", area: "56,594 km²", continent: "EU", lat: 45.1, lon: 15.2, diff: 6, desc: "亞得里亞海千島陣列，善用衝刺閃避連鎖水雷。" },
  { id: 61, flag: "🇱🇻", name: "拉脫維亞 (Latvia)", area: "64,589 km²", continent: "EU", lat: 56.9, lon: 24.6, diff: 7, desc: "波羅的海東岸泥炭沼澤戰，移動速度受到地表泥濘削弱！" },
  { id: 62, flag: "🇱🇹", name: "立陶宛 (Lithuania)", area: "65,300 km²", continent: "EU", lat: 55.1, lon: 23.8, diff: 7, desc: "庫爾斯沙嘴海岸阻截，巨型海怪不斷撞擊防波堤。" },
  { id: 63, flag: "🇬🇪", name: "喬治亞 (Georgia)", area: "69,700 km²", continent: "AS", lat: 42.3, lon: 43.3, diff: 7, desc: "黑海東岸險峻山谷，等離子砲火在此交織成網。" },
  { id: 64, flag: "🇮🇪", name: "愛爾蘭 (Ireland)", area: "70,273 km²", continent: "EU", lat: 53.4, lon: -7.6, diff: 7, desc: "莫赫懸崖大西洋巨浪前哨，百米浪頭拍落大量飛行海嗣。" },
  { id: 65, flag: "🇵🇦", name: "巴拿馬 (Panama)", area: "75,417 km²", continent: "AM", lat: 8.5, lon: -80.1, diff: 7, desc: "巴拿馬運河水閘血戰，兩洋海嗣合流引發大混戰！" },
  { id: 66, flag: "🇦🇹", name: "奧地利 (Austria)", area: "83,879 km²", continent: "EU", lat: 47.5, lon: 14.5, diff: 7, desc: "多瑙河流域腹地，地表軍隊成功奪回重工業基地。" },
  { id: 67, flag: "🇯🇴", name: "約旦 (Jordan)", area: "89,342 km²", continent: "AS", lat: 30.5, lon: 36.2, diff: 7, desc: "紅海阿卡巴灣防禦陣列，狙擊巨型深海刺蝟怪。" },
  { id: 68, flag: "🇵🇹", name: "葡萄牙 (Portugal)", area: "92,212 km²", continent: "EU", lat: 39.3, lon: -8.2, diff: 7, desc: "羅卡角——歐陸極西端迎潮要塞，大西洋黑潮在此碰壁。" },
  { id: 69, flag: "🇭🇺", name: "匈牙利 (Hungary)", area: "93,028 km²", continent: "EU", lat: 47.1, lon: 19.5, diff: 7, desc: "喀爾巴阡平原機甲大會戰，開啟全螢幕火力覆蓋。" },
  { id: 70, flag: "🇰🇷", name: "南韓 (South Korea)", area: "100,210 km²", continent: "AS", lat: 35.9, lon: 127.7, diff: 7, desc: "釜山海港與半島咽喉，海嗣成群結隊衝擊電磁拒馬。" },
  { id: 71, flag: "🇮🇸", name: "冰島 (Iceland)", area: "103,000 km²", continent: "EU", lat: 64.9, lon: -19.0, diff: 8, desc: "冰與火之島，大洋中脊裂谷中爬出史詩級熔岩海怪！" },
  { id: 72, flag: "🇨🇺", name: "古巴 (Cuba)", area: "109,884 km²", continent: "AM", lat: 21.5, lon: -77.7, diff: 8, desc: "墨西哥灣門戶防守要衝，解鎖高階神話級配件。" },
  { id: 73, flag: "🇬🇷", name: "希臘 (Greece)", area: "131,957 km²", continent: "EU", lat: 39.0, lon: 22.0, diff: 8, desc: "愛琴海千島散兵防衛陣，守護帕德嫩高地雷達核心。" },
  { id: 74, flag: "🇳🇵", name: "尼泊爾 (Nepal)", area: "147,181 km²", continent: "AS", lat: 28.3, lon: 84.1, diff: 8, desc: "喜馬拉雅世界屋脊天險，極度缺氧下維持反應堆運轉。" },
  { id: 75, flag: "🇺🇾", name: "烏拉圭 (Uruguay)", area: "176,215 km²", continent: "AM", lat: -32.5, lon: -55.7, diff: 8, desc: "拉普拉塔河口阻截，泥沙翻湧中撕碎變異海嗣。" },
  { id: 76, flag: "🇬🇧", name: "英國 (United Kingdom)", area: "242,495 km²", continent: "EU", lat: 55.3, lon: -3.4, diff: 8, desc: "多佛白崖前線，大西洋與北海海嗣在此發起鉗形攻勢。" },
  { id: 77, flag: "🇳🇿", name: "紐西蘭 (New Zealand)", area: "268,021 km²", continent: "OC", lat: -40.9, lon: 174.8, diff: 8, desc: "庫克海峽斷崖陣列，南太平洋深淵巨獸狂暴登陸。" },
  { id: 78, flag: "🇵🇭", name: "菲律賓 (Philippines)", area: "300,000 km²", continent: "AS", lat: 12.8, lon: 121.7, diff: 8, desc: "蘇祿海群島狂暴登陸潮，連續三波精英巨獸合圍！" },
  { id: 79, flag: "🇮🇹", name: "義大利 (Italy)", area: "301,340 km²", continent: "EU", lat: 41.8, lon: 12.5, diff: 8, desc: "亞平寧半島三面受敵戰線，地中海狂潮幾乎將陸地切斷。" },
  { id: 80, flag: "🇳🇴", name: "挪威 (Norway)", area: "323,802 km²", continent: "EU", lat: 60.4, lon: 8.4, diff: 8, desc: "險峻北極峽灣深處，擊破深海狂暴霸主北極前鋒！" },
  { id: 81, flag: "🇲🇾", name: "馬來西亞 (Malaysia)", area: "330,803 km²", continent: "AS", lat: 4.2, lon: 101.9, diff: 8, desc: "兩洋熱帶雨林防衛戰，酸液雨水不斷腐蝕作戰外甲。" },
  { id: 82, flag: "🇻🇳", name: "越南 (Vietnam)", area: "331,212 km²", continent: "AS", lat: 14.0, lon: 108.2, diff: 8, desc: "湄公河三角洲水上機甲戰，水道深處潛伏著發光母體。" },
  { id: 83, flag: "🇫🇮", name: "芬蘭 (Finland)", area: "338,424 km²", continent: "EU", lat: 61.9, lon: 25.7, diff: 8, desc: "千湖之國凍原阻擊防線，海嗣突破冰層破冰而出。" },
  { id: 84, flag: "🇩🇪", name: "德國 (Germany)", area: "357,022 km²", continent: "EU", lat: 51.1, lon: 10.4, diff: 9, desc: "北海與波羅的海重工業基地，啟動全自動脈衝砲塔。" },
  { id: 85, flag: "🇯🇵", name: "日本 (Japan)", area: "377,975 km²", continent: "AS", lat: 36.2, lon: 138.2, diff: 9, desc: "環太平洋火環帶海溝直擊！面對釋放全屏星芒雷射的巨獸！" },
  { id: 86, flag: "🇸🇪", name: "瑞典 (Sweden)", area: "450,295 km²", continent: "EU", lat: 60.1, lon: 18.6, diff: 9, desc: "斯堪地那維亞針葉林陣線，極光下迎擊極地變異體。" },
  { id: 87, flag: "🇪🇸", name: "西班牙 (Spain)", area: "505,990 km²", continent: "EU", lat: 40.4, lon: -3.7, diff: 9, desc: "直布羅陀海峽門戶保衛戰，徹底鎖死大西洋湧入地中海的通道！" },
  { id: 88, flag: "🇹🇭", name: "泰國 (Thailand)", area: "513,120 km²", continent: "AS", lat: 15.8, lon: 100.9, diff: 9, desc: "暹羅灣狂潮登陸，地表軍隊推進至熱帶沿岸。" },
  { id: 89, flag: "🇺🇦", name: "烏克蘭 (Ukraine)", area: "603,500 km²", continent: "EU", lat: 48.3, lon: 31.1, diff: 9, desc: "黑海北岸廣袤平原，開闊平原上的萬隻海嗣大圍剿！" },
  { id: 90, flag: "🇫🇷", name: "法國 (France)", area: "643,801 km²", continent: "EU", lat: 46.2, lon: 2.2, diff: 9, desc: "大西洋與地中海雙線海潮夾擊，地表防衛聯軍總動員。" },
  { id: 91, flag: "🇨🇱", name: "智利 (Chile)", area: "756,102 km²", continent: "AM", lat: -35.6, lon: -71.5, diff: 9, desc: "四千公里狹長海岸線極限拉扯，挑戰超長生存防線！" },
  { id: 92, flag: "🇹🇷", name: "土耳其 (Turkey)", area: "783,562 km²", continent: "AS", lat: 38.9, lon: 35.2, diff: 9, desc: "博斯普魯斯海峽歐亞天險，兩大板塊交界處的巨型要塞。" },
  { id: 93, flag: "🇪🇬", name: "埃及 (Egypt)", area: "1,002,450 km²", continent: "AF", lat: 26.8, lon: 30.8, diff: 9, desc: "蘇伊士運河咽喉全面封鎖戰，紅海霸主真身初露端倪。" },
  { id: 94, flag: "🇿🇦", name: "南非 (South Africa)", area: "1,221,037 km²", continent: "AF", lat: -30.5, lon: 22.9, diff: 9, desc: "好望角狂暴風暴海角防衛戰，三大洋水族在此瘋狂匯聚！" },
  { id: 95, flag: "🇮🇩", name: "印尼 (Indonesia)", area: "1,904,569 km²", continent: "AS", lat: -0.7, lon: 113.9, diff: 10, desc: "萬島之國巨型海域戰役，兩洋交界處的終極登陸潮！" },
  { id: 96, flag: "🇮🇳", name: "印度 (India)", area: "3,287,263 km²", continent: "AS", lat: 20.5, lon: 78.9, diff: 10, desc: "印度洋半島三角陣列，阻截自南印度洋海溝湧上的無盡敵潮。" },
  { id: 97, flag: "🇦🇺", name: "澳洲 (Australia)", area: "7,692,024 km²", continent: "OC", lat: -25.2, lon: 133.7, diff: 10, desc: "獨立大陸板塊巡邏防線，大堡礁海域誕生了神話級變異母體！" },
  { id: 98, flag: "🇧🇷", name: "巴西 (Brazil)", area: "8,515,767 km²", continent: "AM", lat: -14.2, lon: -51.9, diff: 10, desc: "亞馬遜河入海口，深海病毒母體盤踞雨林水網發起反撲！" },
  { id: 99, flag: "🇺🇸", name: "美國 (United States)", area: "9,833,517 km²", continent: "AM", lat: 37.0, lon: -95.7, diff: 10, desc: "兩洋沿岸防禦總署決死阻擊，五大湖區湧現巨型深淵裂縫！" },
  { id: 100, flag: "🌐", name: "加拿大與全球終局 (Global Core)", area: "10,000,000+ km²", continent: "GL", lat: 56.1, lon: -106.3, diff: 10, desc: "【世界終局決戰】北極冰蓋與全球海溝同步崩裂，深海王者本體降臨！" }
];

/* ==================== 存檔系統 ==================== */
const SAVE_KEY = "SSTS_SURFACE_SURVIVORS_SAVE_V4";

const defaultSaveState = {
  unlockedCountryStage: 1,
  currentSelectedStage: 1,
  stageProgress: { 1: 0 },
  playerLevel: 1,
  playerExp: 0,
  playerNextExp: 5,
  playerMaxHp: 100,
  myInventory: [],
  equipped: {
    helmet: null,
    armor: null,
    gloves: null,
    boots: null,
    accessory: null,
    talisman: null,
    meleeWeapon: { type: 'melee', name: '離子軍刀', damage: 45, speed: 9, color: '#38bdf8' },
    rangedWeapon: { type: 'bow', name: '電磁弩弓', damage: 35, speed: 11, color: '#0284c7' },
    artifact: { id: "art_nova", name: "等離子爆裂核", skillType: "nova" },
    activeCombatMode: 'melee'
  }
};

let userSave = { ...defaultSaveState };

function loadGameSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      userSave = { ...defaultSaveState, ...parsed };
      if (!userSave.stageProgress) userSave.stageProgress = { 1: 0 };
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
    if (statusText) statusText.innerText = "進度已即時存檔 (" + new Date().toLocaleTimeString() + ")";
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

/* ==================== 3D 地球渲染 ==================== */
const globeCanvas = document.getElementById('globe-canvas');
const gctx = globeCanvas.getContext('2d');

let globeRotation = 0;
let globeTilt = 0.35;
let isDraggingGlobe = false;
let lastMouseX = 0;
let globeAnimId = null;

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

function projectSphere(latDeg, lonDeg, radius, center, rotY, tiltX) {
  const lat = latDeg * (Math.PI / 180);
  const lon = lonDeg * (Math.PI / 180) + rotY;

  let x = radius * Math.cos(lat) * Math.sin(lon);
  let y = -radius * Math.sin(lat);
  let z = radius * Math.cos(lat) * Math.cos(lon);

  const cosT = Math.cos(tiltX);
  const sinT = Math.sin(tiltX);
  const yRot = y * cosT - z * sinT;
  const zRot = y * sinT + z * cosT;

  return {
    screenX: center.x + x,
    screenY: center.y + yRot,
    visible: zRot > -10,
    depth: zRot / radius
  };
}

function drawGlobeScene() {
  if (document.getElementById('world-map-screen').style.display !== 'flex') return;

  if (!isDraggingGlobe) globeRotation += 0.003;

  gctx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);
  const cx = globeCanvas.width / 2;
  const cy = globeCanvas.height / 2;
  const radius = 140;

  const atmosGrad = gctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.25);
  atmosGrad.addColorStop(0, "rgba(56, 189, 248, 0.2)");
  atmosGrad.addColorStop(0.7, "rgba(14, 165, 233, 0.08)");
  atmosGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
  gctx.fillStyle = atmosGrad;
  gctx.beginPath(); gctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2); gctx.fill();

  const globeGrad = gctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, radius);
  globeGrad.addColorStop(0, "#083344");
  globeGrad.addColorStop(0.7, "#0c1a30");
  globeGrad.addColorStop(1, "#020617");
  gctx.fillStyle = globeGrad;
  gctx.beginPath(); gctx.arc(cx, cy, radius, 0, Math.PI * 2); gctx.fill();

  gctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
  gctx.lineWidth = 1;
  for (let lat = -60; lat <= 60; lat += 30) {
    gctx.beginPath();
    let first = true;
    for (let lon = -180; lon <= 180; lon += 10) {
      const p = projectSphere(lat, lon, radius, { x: cx, y: cy }, globeRotation, globeTilt);
      if (p.visible) {
        if (first) { gctx.moveTo(p.screenX, p.screenY); first = false; }
        else gctx.lineTo(p.screenX, p.screenY);
      } else { first = true; }
    }
    gctx.stroke();
  }

  const currentSel = userSave.currentSelectedStage;
  const maxUnlocked = userSave.unlockedCountryStage || 1;

  COUNTRIES_STAGE_DATA.forEach(stage => {
    const proj = projectSphere(stage.lat, stage.lon, radius, { x: cx, y: cy }, globeRotation, globeTilt);
    if (proj.visible) {
      const isSelected = stage.id === currentSel;
      const isUnlocked = stage.id <= maxUnlocked;
      const isCleared = (userSave.stageProgress[stage.id] || 0) >= 10;

      gctx.save();
      gctx.translate(proj.screenX, proj.screenY);

      if (isSelected) {
        gctx.strokeStyle = "#38bdf8";
        gctx.lineWidth = 2;
        gctx.beginPath(); gctx.arc(0, 0, 9 + Math.sin(Date.now() * 0.008) * 3, 0, Math.PI * 2); gctx.stroke();

        gctx.fillStyle = "#ffffff";
        gctx.shadowColor = "#38bdf8"; gctx.shadowBlur = 12;
        gctx.beginPath(); gctx.arc(0, 0, 5, 0, Math.PI * 2); gctx.fill();

        gctx.font = "bold 11px sans-serif";
        gctx.fillStyle = "#38bdf8";
        gctx.textAlign = "center";
        gctx.fillText(`${stage.flag} ${stage.name.split(' ')[0]}`, 0, -14);
      } else if (isCleared) {
        gctx.fillStyle = "#10b981";
        gctx.beginPath(); gctx.arc(0, 0, 3.5, 0, Math.PI * 2); gctx.fill();
      } else if (isUnlocked) {
        gctx.fillStyle = "#facc15";
        gctx.shadowColor = "#eab308";
        gctx.shadowBlur = 8;
        gctx.beginPath(); gctx.arc(0, 0, 4, 0, Math.PI * 2); gctx.fill();
      } else {
        gctx.fillStyle = "rgba(239, 68, 68, 0.4)";
        gctx.beginPath(); gctx.arc(0, 0, 2.5, 0, Math.PI * 2); gctx.fill();
      }
      gctx.restore();
    }
  });

  globeAnimId = requestAnimationFrame(drawGlobeScene);
}

/* ==================== 國家選單與 10 小關 ==================== */
const continentNames = {
  EU: "歐洲寒霜裂隙",
  OC: "大洋洲沸騰海疆",
  AM: "美洲火山前哨",
  AS: "亞洲毒沼島鏈",
  AF: "非洲鹽鹼狂潮",
  GL: "全球深淵核心"
};

function updateSelectedStageUI() {
  const stage = COUNTRIES_STAGE_DATA.find(s => s.id === userSave.currentSelectedStage) || COUNTRIES_STAGE_DATA[0];
  const maxUnlocked = userSave.unlockedCountryStage || 1;
  const isUnlocked = stage.id <= maxUnlocked;
  const clearedSubstages = userSave.stageProgress[stage.id] || 0;

  document.getElementById('stage-flag').innerText = stage.flag;
  document.getElementById('stage-rank-tag').innerText = `STAGE ${String(stage.id).padStart(3, '0')} / 100`;
  document.getElementById('stage-country-name').innerText = stage.name;
  document.getElementById('stage-area-data').innerText = `國土面積：約 ${stage.area} · ${continentNames[stage.continent]}`;
  document.getElementById('stage-brief-box').innerText = stage.desc;
  document.getElementById('stage-biome').innerText = continentNames[stage.continent];
  document.getElementById('stage-progress-text').innerText = `${clearedSubstages} / 10 哨站`;

  const btn = document.getElementById('btn-open-substages');
  if (isUnlocked) {
    btn.classList.remove('locked');
    btn.innerText = "展開戰術哨站";
  } else {
    btn.classList.add('locked');
    btn.innerText = "🔒 尚未收復前置國家";
  }

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

function openSubstagesModal() {
  if (userSave.currentSelectedStage > (userSave.unlockedCountryStage || 1)) {
    alert("此國家防線尚未解鎖！必須先收復前面的國家。");
    return;
  }

  const stage = COUNTRIES_STAGE_DATA.find(s => s.id === userSave.currentSelectedStage);
  document.getElementById('substage-modal-flag').innerText = stage.flag;
  document.getElementById('substage-modal-country').innerText = `${stage.name} 防衛哨站`;

  const grid = document.getElementById('substage-grid');
  grid.innerHTML = '';
  const clearedCount = userSave.stageProgress[stage.id] || 0;

  for (let sub = 1; sub <= 10; sub++) {
    const btn = document.createElement('div');
    btn.className = 'substage-btn';

    const isUnlocked = (sub <= clearedCount + 1);
    const isCleared = (sub <= clearedCount);
    const isMiniBoss = (sub === 5);
    const isApexBoss = (sub === 10);

    if (isMiniBoss) btn.classList.add('boss-stage');
    if (isApexBoss) btn.classList.add('boss-stage');
    if (isCleared) btn.classList.add('cleared');
    if (!isUnlocked) btn.classList.add('locked');

    let badge = `<span class="substage-badge" style="background: #334155; color: #94a3b8;">常規哨站</span>`;
    if (isMiniBoss) badge = `<span class="substage-badge" style="background: #e11d48; color: #fff;">先鋒 BOSS</span>`;
    if (isApexBoss) badge = `<span class="substage-badge" style="background: #b91c1c; color: #ffd700;">領土 霸主</span>`;
    if (isCleared) badge = `<span class="substage-badge" style="background: #059669; color: #fff;">✓ 已肅清</span>`;

    btn.innerHTML = `<div style="font-size: 14px;">哨站 ${sub}</div>${badge}`;
    btn.onclick = () => { if (isUnlocked) launchSubstage(stage, sub); };
    grid.appendChild(btn);
  }

  document.getElementById('substage-modal').style.display = 'flex';
  playTone(600, 'triangle', 0.15);
}

function closeSubstagesModal() {
  document.getElementById('substage-modal').style.display = 'none';
}

function launchSubstage(stage, subStageIndex) {
  closeSubstagesModal();
  playTone(880, 'square', 0.2);
  if (globeAnimId) cancelAnimationFrame(globeAnimId);

  document.getElementById('world-map-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'flex';

  startCountryBattle(stage.id, subStageIndex);
}

function openWorldMapScreen() {
  document.getElementById('title-screen').style.display = 'none';
  document.getElementById('story-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('world-map-screen').style.display = 'flex';

  updateSelectedStageUI();
  saveGameProgress();

  if (!globeAnimId) drawGlobeScene();
}

function continueGameFromSave() {
  initAudio();
  loadGameSave();
  openWorldMapScreen();
}

/* ==================== 人體工學紙娃娃裝備面板 ==================== */
let isInventoryOpen = false;
let currentSelectingSlot = null;

function toggleInventory() {
  isInventoryOpen = !isInventoryOpen;
  const modal = document.getElementById('inventory-modal');

  if (isInventoryOpen) {
    modal.style.display = 'flex';
    updatePaperdollSlotsDisplay();
    selectSlotForEquip('melee');
    startDollPreviewLoop();
    playTone(520, 'sine', 0.1);
  } else {
    modal.style.display = 'none';
    if (dollPreviewAnimId) cancelAnimationFrame(dollPreviewAnimId);
    playTone(380, 'sine', 0.1);
  }
}

function updatePaperdollSlotsDisplay() {
  const eq = userSave.equipped;
  document.getElementById('val-helmet').innerText = eq.helmet ? EQUIPMENT_REGISTRY.helmets[eq.helmet].name || eq.helmet : "未裝備";
  document.getElementById('val-melee').innerText = eq.meleeWeapon ? eq.meleeWeapon.name : "赤手空拳";
  document.getElementById('val-ranged').innerText = eq.rangedWeapon ? eq.rangedWeapon.name : "未裝備";
  document.getElementById('val-armor').innerText = eq.armor ? eq.armor : "未裝備";
  document.getElementById('val-gloves').innerText = eq.gloves ? eq.gloves : "未裝備";
  document.getElementById('val-boots').innerText = eq.boots ? eq.boots : "未裝備";
  document.getElementById('val-talisman').innerText = eq.talisman ? EQUIPMENT_REGISTRY.talismans[eq.talisman].name : "未裝備";
  document.getElementById('val-artifact').innerText = eq.artifact ? eq.artifact.name : "未裝備";
}

function selectSlotForEquip(slotKey) {
  currentSelectingSlot = slotKey;
  const title = document.getElementById('inv-panel-title');
  const scrollBox = document.getElementById('inv-items-scroll');
  scrollBox.innerHTML = '';

  const slotTitles = {
    helmet: "頭盔防具庫存",
    melee: "近戰武器庫存",
    ranged: "遠程武器庫存",
    armor: "胸甲防具庫存",
    gloves: "戰術手套庫存",
    boots: "推進戰靴庫存",
    talisman: "護符 (寵物) 庫存",
    artifact: "戰術法器庫存"
  };
  title.innerText = slotTitles[slotKey] || "裝備庫存";

  document.querySelectorAll('.gear-slot').forEach(el => el.classList.remove('active-selecting'));
  const activeEl = document.getElementById(`slot-${slotKey}`);
  if (activeEl) activeEl.classList.add('active-selecting');

  const matchingItems = userSave.myInventory.filter(item => {
    if (slotKey === 'melee') return item.slot === 'weapon' && (item.data.type === 'melee' || item.data.type === 'bare');
    if (slotKey === 'ranged') return item.slot === 'weapon' && (item.data.type === 'bow' || item.data.type === 'staff');
    if (slotKey === 'artifact') return item.slot === 'artifact';
    return item.slot === slotKey;
  });

  if (matchingItems.length === 0) {
    scrollBox.innerHTML = `<div style="color: #64748b; font-size: 11px; padding: 20px 0; text-align: center;">此欄位尚無可用備用裝備<br>請在關卡中擊敗 Boss 獲取！</div>`;
    return;
  }

  matchingItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'inv-equip-card';
    card.innerHTML = `
      <div>
        <div style="font-size: 12px; font-weight: bold; color: #fff;">${item.name}</div>
        <div style="font-size: 10px; color: #94a3b8;">${item.desc}</div>
      </div>
      <button class="btn" style="padding: 4px 10px; font-size: 11px;">裝備</button>
    `;
    card.onclick = () => {
      equipItemToSlot(slotKey, item);
    };
    scrollBox.appendChild(card);
  });
}

function equipItemToSlot(slotKey, item) {
  if (slotKey === 'melee') userSave.equipped.meleeWeapon = { ...item.data };
  else if (slotKey === 'ranged') userSave.equipped.rangedWeapon = { ...item.data };
  else if (slotKey === 'artifact') userSave.equipped.artifact = { ...item };
  else if (slotKey === 'helmet') userSave.equipped.helmet = item.val;
  else if (slotKey === 'armor') userSave.equipped.armor = item.val;
  else if (slotKey === 'gloves') userSave.equipped.gloves = item.val;
  else if (slotKey === 'boots') userSave.equipped.boots = item.val;
  else if (slotKey === 'talisman') userSave.equipped.talisman = item.val;

  saveGameProgress();
  updatePaperdollSlotsDisplay();
  playTone(700, 'triangle', 0.1);
}

let dollPreviewAnimId = null;
let dollPreviewTime = 0;
function startDollPreviewLoop() {
  const pcanvas = document.getElementById('preview-canvas');
  const pctx = pcanvas.getContext('2d');

  function loop() {
    if (!isInventoryOpen) return;
    dollPreviewTime += 0.04;
    pctx.clearRect(0, 0, pcanvas.width, pcanvas.height);

    const mockPlayer = {
      x: 0, y: 0, vx: 0, vy: 0, radius: 14,
      isMoving: false, attackTimer: 0, isDashing: false, facing: 1,
      animTimer: dollPreviewTime,
      equipment: {
        helmet: userSave.equipped.helmet,
        armor: userSave.equipped.armor,
        gloves: userSave.equipped.gloves,
        boots: userSave.equipped.boots,
        accessory: userSave.equipped.accessory,
        talisman: userSave.equipped.talisman,
        weapon: userSave.equipped.meleeWeapon || { type: 'bare', name: '空手' }
      }
    };

    pctx.save();
    pctx.translate(pcanvas.width / 2, pcanvas.height / 2 + 10);
    pctx.scale(2.2, 2.2);
    drawPlayerPaperdoll(pctx, mockPlayer);
    pctx.restore();

    dollPreviewAnimId = requestAnimationFrame(loop);
  }
  loop();
}
