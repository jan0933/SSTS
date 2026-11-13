/**
 * SSTS - 全球選關、金幣升星、分部位詞條疊加系統、總戰力計算、存檔碼轉移與一鍵拆解 (map.js)
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

/* ==================== 動物靈獸圖示對照表 (無詞條，依白/藍/黃/橘進化不同動物) ==================== */
const ANIMAL_ICON_MAP = {
  seagull: "🕊️ 機械偵察海鷗",
  turtle:  "🐢 深海碧波靈龜",
  shark:   "🦈 雷霆虎鯊獵犬",
  dragon:  "🐉 太古蒼穹應龍"
};

/* ==================== 存檔系統 (四品階：白/藍/黃/橘) ==================== */
const SAVE_KEY = "SSTS_SURFACE_SURVIVORS_SAVE_V8";

function getStarterWeapon() {
  if (typeof MASTER_EQUIPMENT_DB !== 'undefined') {
    const w = MASTER_EQUIPMENT_DB.find(i => i.id === "w_01");
    if (w) return { ...w, rank: 1, affixes: [] };
  }
  return { id: "w_01", slot: "weapon", rank: 1, name: "新兵製式獵弓", type: "bow", tier: "common", stars: 1, damage: 30, speed: 10, desc: "基礎電磁弦弓 (傷害 30)", affixes: [] };
}

function getStarterArtifact() {
  if (typeof MASTER_EQUIPMENT_DB !== 'undefined') {
    const a = MASTER_EQUIPMENT_DB.find(i => i.id === "art_01");
    if (a) return { ...a, rank: 1, cooldownFrames: 240, affixes: [] };
  }
  return { id: "art_01", slot: "artifact", rank: 1, name: "基礎爆裂手雷核", skillType: "nova", tier: "common", stars: 1, skillMult: 1.0, cooldownFrames: 240, desc: "主動技：周圍 360 度烈焰爆炸", affixes: [] };
}

const defaultSaveState = {
  unlockedCountryStage: 1,
  currentSelectedStage: 1,
  stageProgress: { 1: 0 },
  playerGold: 150,
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
    weapon: getStarterWeapon(),
    artifact: getStarterArtifact()
  }
};

let userSave = { ...defaultSaveState };

function loadGameSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      userSave = { ...defaultSaveState, ...parsed };
      if (typeof userSave.playerGold !== 'number') userSave.playerGold = 150;
      if (!userSave.equipped.weapon) userSave.equipped.weapon = getStarterWeapon();
      if (!userSave.equipped.artifact) userSave.equipped.artifact = getStarterArtifact();
      return true;
    }
  } catch(e) {
    console.warn("無法讀取存檔", e);
  }
  userSave = {
    ...defaultSaveState,
    equipped: {
      ...defaultSaveState.equipped,
      weapon: getStarterWeapon(),
      artifact: getStarterArtifact()
    }
  };
  return false;
}

function saveGameProgress() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(userSave));
    const statusText = document.getElementById('map-save-status');
    if (statusText) statusText.innerText = "進度已即時存檔 (" + new Date().toLocaleTimeString() + ")";
    updateGoldDisplays();
  } catch(e) {
    console.warn("存檔失敗", e);
  }
}

function updateGoldDisplays() {
  const g = userSave.playerGold || 0;
  const mapGold = document.getElementById('map-gold-display');
  const invGold = document.getElementById('inv-gold-badge');
  if (mapGold) mapGold.innerText = `💰 金幣: ${g}`;
  if (invGold) invGold.innerText = `💰 金幣: ${g}`;
}

function resetSaveData() {
  if (confirm("確定要重設所有遊戲進度、關卡與裝備嗎？這將無法復原。")) {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
}

/* ==================== 跨裝置存檔碼匯出 / 匯入系統 ==================== */
function exportSaveCode() {
  try {
    saveGameProgress();
    const jsonStr = JSON.stringify(userSave);
    const encoded = 'SSTS1_' + btoa(unescape(encodeURIComponent(jsonStr)));

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(encoded).then(() => {
        alert('✅ 存檔碼已複製到剪貼簿！\n請貼上並傳送至另一台裝置的「匯入存檔碼」視窗即可無縫接續進度。');
      }).catch(() => {
        prompt('請全選並複製下方存檔碼：', encoded);
      });
    } else {
      prompt('請全選並複製下方存檔碼：', encoded);
    }
    if (typeof playTone === 'function') playTone(780, 'sine', 0.15);
  } catch (e) {
    alert('匯出存檔碼失敗：' + e.message);
  }
}

function importSaveCode() {
  const input = prompt('請貼上從其他裝置匯出的存檔碼（以 SSTS1_ 開頭）：');
  if (!input) return;

  const trimmed = input.trim();
  if (!trimmed.startsWith('SSTS1_')) {
    alert('❌ 存檔碼格式錯誤！請確認是否完整複製了以 SSTS1_ 開頭的字串。');
    return;
  }

  try {
    const base64Part = trimmed.slice(6);
    const jsonStr = decodeURIComponent(escape(atob(base64Part)));
    const parsed = JSON.parse(jsonStr);

    if (typeof parsed !== 'object' || typeof parsed.unlockedCountryStage !== 'number' || !parsed.equipped) {
      throw new Error('存檔結構不完整');
    }

    userSave = { ...defaultSaveState, ...parsed };
    if (!userSave.equipped.weapon) userSave.equipped.weapon = getStarterWeapon();
    if (!userSave.equipped.artifact) userSave.equipped.artifact = getStarterArtifact();

    saveGameProgress();
    updateSelectedStageUI();
    updateGoldDisplays();
    if (typeof playTone === 'function') playTone(920, 'triangle', 0.3, 0.15);
    alert(`🎉 存檔匯入成功！\n已恢復至：第 ${userSave.unlockedCountryStage} 國 · Lv.${userSave.playerLevel} · 金幣 ${userSave.playerGold}`);
  } catch (e) {
    alert('❌ 存檔碼解析失敗或已損毀，請確認貼上的字串沒有遺漏字元。');
  }
}

function ensureSaveTransferButtons() {
  const resetBtn = document.querySelector('.btn-clear-save');
  if (!resetBtn || document.getElementById('save-transfer-row')) return;

  const row = document.createElement('div');
  row.id = 'save-transfer-row';
  row.style.cssText = 'display: flex; gap: 6px; margin-top: 8px;';

  const btnExport = document.createElement('button');
  btnExport.type = 'button';
  btnExport.innerText = '📤 匯出存檔碼';
  btnExport.style.cssText = 'flex: 1; background: rgba(14, 165, 233, 0.18); border: 1px solid #38bdf8; color: #bae6fd; font-size: 11px; font-weight: bold; padding: 6px; border-radius: 6px; cursor: pointer;';
  btnExport.onclick = exportSaveCode;

  const btnImport = document.createElement('button');
  btnImport.type = 'button';
  btnImport.innerText = '📥 匯入存檔碼';
  btnImport.style.cssText = 'flex: 1; background: rgba(16, 185, 129, 0.18); border: 1px solid #34d399; color: #a7f3d0; font-size: 11px; font-weight: bold; padding: 6px; border-radius: 6px; cursor: pointer;';
  btnImport.onclick = importSaveCode;

  row.appendChild(btnExport);
  row.appendChild(btnImport);
  resetBtn.parentNode.insertBefore(row, resetBtn);
}

/* ==================== 首頁單一入口按鈕：自動判斷接續進度或播放開場劇情 ==================== */
function handleStartGame() {
  if (typeof initAudio === 'function') initAudio();
  const hasExistingSave = loadGameSave();

  const hasProgress = hasExistingSave && (
    (userSave.unlockedCountryStage || 1) > 1 ||
    (userSave.stageProgress && (userSave.stageProgress[1] || 0) > 0) ||
    (userSave.playerLevel || 1) > 1 ||
    (userSave.myInventory && userSave.myInventory.length > 0)
  );

  if (hasProgress) {
    openWorldMapScreen();
  } else if (typeof startStory === 'function') {
    startStory();
  } else {
    openWorldMapScreen();
  }
}

function continueGameFromSave() {
  handleStartGame();
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

  ensureSaveTransferButtons();
  updateSelectedStageUI();
  updateGoldDisplays();
  saveGameProgress();

  if (!globeAnimId) drawGlobeScene();
}

/* ==================== 人體工學紙娃娃裝備面板 (分部位詞條 / 靈獸進化 / 法器倍率 / 一鍵拆解) ==================== */
let isInventoryOpen = false;
let currentSelectingSlot = null;

const SALVAGE_BASE_BY_TIER = {
  common: 25,
  rare: 60,
  elite: 140,
  legendary: 400
};

function getTierDisplayMeta(tier) {
  const t = tier || 'common';
  const base = (typeof TIER_META !== 'undefined' && TIER_META[t]) ? TIER_META[t] : { name: '普通', color: '#f1f5f9', affixCount: 0 };
  return {
    name: base.name,
    color: base.color,
    class: `tier-${t}`,
    affixCount: base.affixCount || 0,
    salvageBase: SALVAGE_BASE_BY_TIER[t] || 25
  };
}

function getSalvageBonusMultiplier() {
  let bonus = 0;
  const eq = userSave.equipped || {};
  for (const key in eq) {
    const item = eq[key];
    if (!item || item.slot === 'talisman' || item.slot === 'artifact') continue;
    const list = (typeof getItemAffixList === 'function') ? getItemAffixList(item) : [];
    list.forEach(aff => {
      if (aff && aff.id === 'a_salvage_up') {
        bonus += (aff.val || 0.15);
      }
    });
  }
  return 1 + Math.min(0.75, bonus);
}

function calcItemSalvageGold(item) {
  if (!item) return 0;
  const tierMeta = getTierDisplayMeta(item.tier);
  const curStars = item.stars || 1;
  const rank = item.rank || 1;
  const raw = (tierMeta.salvageBase + (rank - 1) * 15) * (1 + (curStars - 1) * 0.4);
  return Math.floor(raw * getSalvageBonusMultiplier());
}

function bulkSalvageIdleLowTier() {
  if (!userSave || !Array.isArray(userSave.myInventory)) return;

  const targets = userSave.myInventory.filter(item => item.tier === 'common' || item.tier === 'rare');
  if (targets.length === 0) {
    alert("背包中目前沒有閒置的「普通(白)」或「稀有(藍)」裝備可拆解！");
    return;
  }

  let totalGold = 0;
  targets.forEach(t => { totalGold += calcItemSalvageGold(t); });

  if (!confirm(`確定要一鍵拆解背包內 ${targets.length} 件閒置白裝與藍裝嗎？\n預計回收：💰 +${totalGold} 金幣`)) {
    return;
  }

  userSave.myInventory = userSave.myInventory.filter(item => item.tier !== 'common' && item.tier !== 'rare');
  userSave.playerGold = (userSave.playerGold || 0) + totalGold;

  saveGameProgress();
  updatePaperdollSlotsDisplay();
  if (currentSelectingSlot) selectSlotForEquip(currentSelectingSlot);
  playTone(860, 'triangle', 0.22, 0.15);
}

function updateBulkSalvageButton() {
  const invHeader = document.querySelector('#inventory-modal .inv-header');
  if (!invHeader) return;

  let bulkBtn = document.getElementById('btn-bulk-salvage-low');
  if (!bulkBtn) {
    bulkBtn = document.createElement('button');
    bulkBtn.id = 'btn-bulk-salvage-low';
    bulkBtn.className = 'btn-bulk-salvage';
    bulkBtn.type = 'button';
    bulkBtn.onclick = bulkSalvageIdleLowTier;

    const closeBtn = invHeader.querySelector('.close-btn');
    if (closeBtn) invHeader.insertBefore(bulkBtn, closeBtn);
    else invHeader.appendChild(bulkBtn);
  }

  const targets = (userSave.myInventory || []).filter(item => item.tier === 'common' || item.tier === 'rare');
  const estGold = targets.reduce((sum, it) => sum + calcItemSalvageGold(it), 0);
  bulkBtn.innerText = targets.length > 0
    ? `♻️ 一鍵拆解閒置白/藍 (${targets.length}件 · +${estGold}G)`
    : `♻️ 無閒置白/藍裝`;
  bulkBtn.disabled = targets.length === 0;
}

function toggleInventory() {
  isInventoryOpen = !isInventoryOpen;
  const modal = document.getElementById('inventory-modal');

  if (isInventoryOpen) {
    modal.style.display = 'flex';
    updatePaperdollSlotsDisplay();
    selectSlotForEquip('weapon');
    startDollPreviewLoop();
    playTone(520, 'sine', 0.1);
  } else {
    modal.style.display = 'none';
    if (dollPreviewAnimId) cancelAnimationFrame(dollPreviewAnimId);
    playTone(380, 'sine', 0.1);
  }
}

function renderStarsStr(num) {
  const n = Math.min(5, Math.max(1, num || 1));
  return "★".repeat(n);
}

function updateTotalStatsPanel() {
  const eq = userSave.equipped || {};

  const baseLevelDmg = ((userSave.playerLevel || 1) - 1) * 5;
  const baseHp = userSave.playerMaxHp || 100;
  const baseSpd = 2.8;

  let wepDmg = (eq.weapon && eq.weapon.damage) ? eq.weapon.damage : 0;
  let gearDmg = 0;
  let gearHp = 0;
  let gearSpd = 0;
  let dmgReduce = 0;
  let fireRateMult = 1.0;
  let dashCdMult = 1.0;

  let hpPctAdd = 0;
  let spdPctAdd = 0;
  let armorAffixReduce = 0;
  let rushAffixReduce = 0;
  const affixNameCounts = {};

  const defMap = {};
  if (typeof WEAPON_AFFIX_POOL !== 'undefined') WEAPON_AFFIX_POOL.forEach(a => defMap[a.id] = a);
  if (typeof ARMOR_AFFIX_POOL !== 'undefined') ARMOR_AFFIX_POOL.forEach(a => defMap[a.id] = a);

  for (const key in eq) {
    const item = eq[key];
    if (!item) continue;

    if (item.bonusDmg) gearDmg += item.bonusDmg;
    if (item.bonusHp) gearHp += item.bonusHp;
    if (item.bonusSpeed) gearSpd += item.bonusSpeed;
    if (item.dmgReduce) dmgReduce += item.dmgReduce;
    if (item.fireRateMult) fireRateMult *= item.fireRateMult;
    if (item.dashCdMult) dashCdMult *= item.dashCdMult;

    if (item.slot !== 'talisman' && item.slot !== 'artifact') {
      const itemAffixes = (typeof getItemAffixList === 'function') ? getItemAffixList(item) : [];
      itemAffixes.forEach(aff => {
        if (!aff || !aff.id) return;
        const d = defMap[aff.id] || aff;
        affixNameCounts[d.name] = (affixNameCounts[d.name] || 0) + 1;

        if (aff.id === "a_hp_pct") hpPctAdd = Math.min(0.80, hpPctAdd + (d.val || 0.12));
        if (aff.id === "a_move_spd") spdPctAdd = Math.min(0.45, spdPctAdd + (d.val || 0.08));
        if (aff.id === "a_armor") armorAffixReduce = 1 - (1 - armorAffixReduce) * (1 - (d.val || 0.14));
        if (aff.id === "a_rush") rushAffixReduce = 1 - (1 - rushAffixReduce) * (1 - (d.val || 0.18));
      });
    }
  }

  const totalAtk = baseLevelDmg + wepDmg + gearDmg;
  const totalHp = Math.round((baseHp + gearHp) * (1 + hpPctAdd));
  const totalSpd = ((baseSpd + gearSpd) * (1 + spdPctAdd)).toFixed(2);
  const combinedDef = Math.min(85, Math.round((1 - (1 - Math.min(0.75, dmgReduce)) * (1 - armorAffixReduce)) * 100));
  const totalRatePct = Math.max(0, Math.round((1 - fireRateMult) * 100));
  const totalDashPct = Math.max(0, Math.round((1 - dashCdMult * (1 - rushAffixReduce)) * 100));

  const elAtk = document.getElementById('stat-total-atk');
  const elHp = document.getElementById('stat-total-hp');
  const elSpd = document.getElementById('stat-total-spd');
  const elDef = document.getElementById('stat-total-def');
  const elRate = document.getElementById('stat-total-rate');
  const elDash = document.getElementById('stat-total-dash');
  const elAffixBox = document.getElementById('stat-active-affixes');

  if (elAtk) elAtk.innerText = totalAtk;
  if (elHp) elHp.innerText = totalHp;
  if (elSpd) elSpd.innerText = totalSpd;
  if (elDef) elDef.innerText = `${combinedDef}%`;
  if (elRate) elRate.innerText = `+${totalRatePct}%`;
  if (elDash) elDash.innerText = `-${totalDashPct}%`;

  if (elAffixBox) {
    const entries = Object.entries(affixNameCounts);
    if (entries.length === 0) {
      elAffixBox.innerHTML = `<span style="color:#64748b;">目前無裝備附魔詞條 (武器攻擊型 / 防具可跨部位疊加)</span>`;
    } else {
      elAffixBox.innerHTML = entries
        .map(([name, cnt]) => `<span class="active-affix-pill">${name}${cnt > 1 ? ` ×${cnt}` : ''}</span>`)
        .join('');
    }
  }
}

function updatePaperdollSlotsDisplay() {
  const eq = userSave.equipped;
  const formatSlot = (slotKey, item, defaultName) => {
    if (!item) return { name: defaultName, stars: "", affixText: "", affixColor: "#34d399" };
    const tierMeta = getTierDisplayMeta(item.tier);

    if (slotKey === "talisman") {
      const animalLabel = ANIMAL_ICON_MAP[item.petAnimal] || "🐾 伴生靈獸";
      return {
        name: item.name || defaultName,
        stars: renderStarsStr(item.stars),
        color: tierMeta.color,
        affixText: `${animalLabel} (${item.petPower || 1.0}x)`,
        affixColor: "#34d399"
      };
    }

    if (slotKey === "artifact") {
      return {
        name: item.name || defaultName,
        stars: renderStarsStr(item.stars),
        color: tierMeta.color,
        affixText: `💥 威力 ${item.skillMult || 1.0}x`,
        affixColor: "#c084fc"
      };
    }

    const affList = (typeof getItemAffixList === 'function') ? getItemAffixList(item) : [];
    return {
      name: item.name || defaultName,
      stars: renderStarsStr(item.stars),
      color: tierMeta.color,
      affixText: affList.length > 0 ? affList.map(a => a.name).join(" · ") : "",
      affixColor: "#fde047"
    };
  };

  const slots = ["helmet", "weapon", "armor", "gloves", "boots", "talisman", "artifact"];
  slots.forEach(s => {
    const formatted = formatSlot(s, eq[s], "未裝備");
    const elVal = document.getElementById(`val-${s}`);
    const elStar = document.getElementById(`star-${s}`);
    const elAffix = document.getElementById(`affix-${s}`);
    if (elVal) {
      elVal.innerText = formatted.name;
      elVal.style.color = formatted.color || "#f8fafc";
    }
    if (elStar) elStar.innerText = formatted.stars;
    if (elAffix) {
      elAffix.innerText = formatted.affixText;
      elAffix.style.color = formatted.affixColor;
    }
  });

  updateBulkSalvageButton();
  updateTotalStatsPanel();
}

function buildDynamicDesc(item) {
  const parts = [];
  if (item.damage) parts.push(`傷害 ${item.damage}`);
  if (item.bonusDmg) parts.push(`攻擊 +${item.bonusDmg}`);
  if (item.bonusHp) parts.push(`生命 +${item.bonusHp}`);
  if (item.bonusSpeed) parts.push(`移速 +${item.bonusSpeed}`);
  if (item.dmgReduce) parts.push(`減傷 ${Math.round(item.dmgReduce * 100)}%`);
  if (item.fireRateMult) parts.push(`射速 +${Math.round((1 - item.fireRateMult) * 100)}%`);
  if (item.dashCdMult) parts.push(`衝刺冷卻 -${Math.round((1 - item.dashCdMult) * 100)}%`);
  if (item.skillMult && item.slot === "artifact") parts.push(`技能威力倍率 ${item.skillMult}x`);
  if (item.petPower && item.slot === "talisman") parts.push(`靈獸威力倍率 ${item.petPower}x`);

  if (parts.length > 0) {
    const baseText = item.desc ? item.desc.replace(/^\[.*?\]\s*/, '').split('(')[0].trim() : '';
    return baseText ? `${baseText} (${parts.join('，')})` : parts.join('，');
  }
  return item.desc || '';
}

function renderAffixesHtml(item) {
  if (!item) return "";

  if (item.slot === "talisman") {
    const animalLabel = ANIMAL_ICON_MAP[item.petAnimal] || "🐾 伴生靈獸";
    return `<div style="font-size:10px; color:#34d399; font-weight:bold; margin-top:2px;">${animalLabel} · 隨品質進化動物型態（無附魔詞條）</div>`;
  }

  if (item.slot === "artifact") {
    const cdSec = ((item.cooldownFrames || 240) / 60).toFixed(1);
    return `<div style="font-size:10px; color:#c084fc; font-weight:bold; margin-top:2px;">🔮 奧義技能倍率 ${item.skillMult || 1.0}x · 冷卻 ${cdSec}秒（無附魔詞條）</div>`;
  }

  const list = (typeof getItemAffixList === 'function') ? getItemAffixList(item) : [];
  if (list.length === 0) return "";
  return list.map(a => `<div class="card-affix-badge">${a.name} · ${a.tag || a.desc || ''}</div>`).join("");
}

function selectSlotForEquip(slotKey) {
  currentSelectingSlot = slotKey;
  const title = document.getElementById('inv-panel-title');
  const scrollBox = document.getElementById('inv-items-scroll');
  scrollBox.innerHTML = '';

  const slotTitles = {
    helmet: "頭盔管理 (防具多元詞條可跨部位疊加)",
    weapon: "遠程武器管理 (純攻擊型詞條 / 升星強化)",
    armor: "胸甲管理 (防具多元詞條可跨部位疊加)",
    gloves: "戰術手套管理 (防具多元詞條可跨部位疊加)",
    boots: "推進戰靴管理 (防具多元詞條可跨部位疊加)",
    talisman: "護符 (靈獸) 管理 (依品質進化不同動物)",
    artifact: "戰術法器管理 (依品質提升毀滅性威力倍率)"
  };
  title.innerText = slotTitles[slotKey] || "裝備管理";

  document.querySelectorAll('.gear-slot').forEach(el => el.classList.remove('active-selecting'));
  const activeEl = document.getElementById(`slot-${slotKey}`);
  if (activeEl) activeEl.classList.add('active-selecting');

  const equippedItem = userSave.equipped[slotKey];
  const matchingInventory = userSave.myInventory.filter(item => item.slot === slotKey);

  if (!equippedItem && matchingInventory.length === 0) {
    scrollBox.innerHTML = `<div style="color: #64748b; font-size: 11px; padding: 20px 0; text-align: center;">此部位目前未穿戴裝備，且無備用庫存<br>擊破第 5 關與第 10 關 Boss 獲取！</div>`;
    return;
  }

  // 1. 穿戴中裝備置頂
  if (equippedItem && equippedItem.id) {
    const tierMeta = getTierDisplayMeta(equippedItem.tier);
    const curStars = equippedItem.stars || 1;
    const rankTag = equippedItem.rank ? `T${equippedItem.rank}·` : '';
    const upgradeCost = curStars * 80 + (curStars >= 4 ? 120 : 0);
    const salvageGold = calcItemSalvageGold(equippedItem);
    const isStarterGear = (equippedItem.id === "w_start" || equippedItem.id === "w_01" || equippedItem.id === "art_01");

    const equippedCard = document.createElement('div');
    equippedCard.className = 'inv-equip-card is-currently-equipped';
    equippedCard.innerHTML = `
      <div class="card-header-row">
        <span style="font-size: 12.5px; font-weight: bold; color: ${tierMeta.color};">
          ${equippedItem.name} <span style="color: #facc15;">${renderStarsStr(curStars)}</span>
        </span>
        <div style="display: flex; gap: 4px; align-items: center;">
          <span class="card-tier-tag ${tierMeta.class}">${rankTag}${tierMeta.name}</span>
          <span class="equipped-tag">穿戴中</span>
        </div>
      </div>
      <div style="font-size: 10.5px; color: #cbd5e1;">${buildDynamicDesc(equippedItem)}</div>
      ${renderAffixesHtml(equippedItem)}
      <div class="card-actions-row">
        ${curStars < 5 
          ? `<button class="btn-card-action btn-upgrade" onclick="upgradeItemStar('${equippedItem.id}', this)">升星 (${upgradeCost}金)</button>` 
          : `<span style="font-size: 10px; color: #facc15; font-weight: bold;">5★ 滿星強化</span>`
        }
        ${!isStarterGear 
          ? `<button class="btn-card-action btn-unequip" onclick="unequipSlotItem('${slotKey}')">卸下</button>
             <button class="btn-card-action btn-salvage" onclick="salvageItem('${equippedItem.id}')">拆解 (+${salvageGold}金)</button>` 
          : `<span style="font-size: 10px; color: #64748b;">(基礎核心不可拆解)</span>`
        }
      </div>
    `;
    scrollBox.appendChild(equippedCard);
  }

  // 2. 備用庫存裝備（依品質高到低、階級高到低排序）
  const tierOrder = { legendary: 4, elite: 3, rare: 2, common: 1 };
  const sortedInv = [...matchingInventory].sort((a, b) => {
    const tDiff = (tierOrder[b.tier] || 1) - (tierOrder[a.tier] || 1);
    if (tDiff !== 0) return tDiff;
    return (b.rank || 1) - (a.rank || 1);
  });

  sortedInv.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'inv-equip-card';

    const tierMeta = getTierDisplayMeta(item.tier);
    const curStars = item.stars || 1;
    const rankTag = item.rank ? `T${item.rank}·` : '';
    const upgradeCost = curStars * 80 + (curStars >= 4 ? 120 : 0);
    const salvageGold = calcItemSalvageGold(item);

    card.innerHTML = `
      <div class="card-header-row">
        <span style="font-size: 12.5px; font-weight: bold; color: ${tierMeta.color};">
          ${item.name} <span style="color: #facc15;">${renderStarsStr(curStars)}</span>
        </span>
        <span class="card-tier-tag ${tierMeta.class}">${rankTag}${tierMeta.name}</span>
      </div>
      <div style="font-size: 10.5px; color: #94a3b8;">${buildDynamicDesc(item)}</div>
      ${renderAffixesHtml(item)}
      <div class="card-actions-row">
        ${curStars < 5 
          ? `<button class="btn-card-action btn-upgrade" onclick="upgradeItemStar('${item.id}', this)">升星 (${upgradeCost}金)</button>` 
          : `<span style="font-size: 10px; color: #facc15; font-weight: bold;">5★ 滿星強化</span>`
        }
        <button class="btn-card-action btn-equip" onclick="equipItemToSlot('${slotKey}', '${item.id}')">穿戴</button>
        <button class="btn-card-action btn-salvage" onclick="salvageItem('${item.id}')">拆解 (+${salvageGold}金)</button>
      </div>
    `;
    scrollBox.appendChild(card);
  });
}

function unequipSlotItem(slotKey) {
  const currentEquipped = userSave.equipped[slotKey];
  if (!currentEquipped || currentEquipped.id === "w_start" || currentEquipped.id === "w_01" || currentEquipped.id === "art_01") return;

  userSave.myInventory.push({ ...currentEquipped });
  userSave.equipped[slotKey] = null;

  saveGameProgress();
  updatePaperdollSlotsDisplay();
  selectSlotForEquip(slotKey);
  playTone(450, 'sine', 0.1);
}

function equipItemToSlot(slotKey, itemId) {
  const itemIndex = userSave.myInventory.findIndex(i => i.id === itemId);
  if (itemIndex === -1) return;
  const item = userSave.myInventory[itemIndex];

  const currentEquipped = userSave.equipped[slotKey];
  if (currentEquipped && currentEquipped.id) {
    userSave.myInventory.push(currentEquipped);
  }

  userSave.equipped[slotKey] = { ...item };
  userSave.myInventory.splice(itemIndex, 1);

  saveGameProgress();
  updatePaperdollSlotsDisplay();
  selectSlotForEquip(slotKey);
  playTone(700, 'triangle', 0.1);
}

function playStarUpgradeSound(isMaxStar) {
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const baseFreqs = isMaxStar ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [587.33, 739.99, 880.00, 1174.66];
    
    baseFreqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = isMaxStar ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.35);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.36);
    });
  } catch(e) {}
}

function spawnStarBurstParticles(targetElement, isMaxStar) {
  if (!targetElement) return;

  targetElement.classList.add('star-particles-anchor');
  targetElement.classList.remove('upgrade-success-flash');
  void targetElement.offsetWidth;
  targetElement.classList.add('upgrade-success-flash');

  const particleCount = isMaxStar ? 18 : 12;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'star-fx-particle';
    p.innerText = isMaxStar ? (i % 2 === 0 ? '✦' : '★') : '★';

    if (isMaxStar) {
      p.style.color = i % 2 === 0 ? '#fb923c' : '#fde047';
    }

    const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5) * 0.4;
    const distance = 35 + Math.random() * 45;
    const dx = `${Math.cos(angle) * distance}px`;
    const dy = `${Math.sin(angle) * distance}px`;
    const rot = `${(Math.random() - 0.5) * 360}deg`;

    p.style.setProperty('--dx', dx);
    p.style.setProperty('--dy', dy);
    p.style.setProperty('--rot', rot);

    p.style.left = `50%`;
    p.style.top = `50%`;

    targetElement.appendChild(p);
    setTimeout(() => { p.remove(); }, 750);
  }
}

function upgradeItemStar(itemId, clickedButtonElem) {
  let item = userSave.myInventory.find(i => i.id === itemId);
  let isEquipped = false;
  let equippedKey = null;

  if (!item) {
    for (const key in userSave.equipped) {
      if (userSave.equipped[key] && userSave.equipped[key].id === itemId) {
        item = userSave.equipped[key];
        isEquipped = true;
        equippedKey = key;
        break;
      }
    }
  }
  if (!item) return;

  const curStars = item.stars || 1;
  if (curStars >= 5) {
    alert("此裝備已達最高 5 ★ 級別！");
    return;
  }

  const cost = curStars * 80 + (curStars >= 4 ? 120 : 0);
  if (userSave.playerGold < cost) {
    alert(`金幣不足！升到 ${curStars + 1} ★ 需要 ${cost} 金幣。`);
    return;
  }

  userSave.playerGold -= cost;
  item.stars = curStars + 1;

  if (item.damage) item.damage = Math.floor(item.damage * 1.3);
  if (item.bonusHp) item.bonusHp = Math.floor(item.bonusHp * 1.25);
  if (item.bonusDmg) item.bonusDmg = Math.floor(item.bonusDmg * 1.25);
  if (item.bonusSpeed) item.bonusSpeed = parseFloat((item.bonusSpeed * 1.15).toFixed(2));
  if (item.skillMult) item.skillMult = parseFloat((item.skillMult * 1.25).toFixed(2));
  if (item.petPower) item.petPower = parseFloat((item.petPower * 1.25).toFixed(2));

  const isMaxStar = (item.stars === 5);

  if (isEquipped && equippedKey) {
    userSave.equipped[equippedKey] = { ...item };
  }

  playStarUpgradeSound(isMaxStar);

  const cardElem = clickedButtonElem ? clickedButtonElem.closest('.inv-equip-card') : null;
  if (cardElem) {
    spawnStarBurstParticles(cardElem, isMaxStar);
  }

  saveGameProgress();
  updatePaperdollSlotsDisplay();

  setTimeout(() => {
    if (currentSelectingSlot) selectSlotForEquip(currentSelectingSlot);
  }, 160);
}

function salvageItem(itemId) {
  let index = userSave.myInventory.findIndex(i => i.id === itemId);
  let item = null;
  let isEquipped = false;
  let equippedKey = null;

  if (index !== -1) {
    item = userSave.myInventory[index];
  } else {
    for (const key in userSave.equipped) {
      if (userSave.equipped[key] && userSave.equipped[key].id === itemId) {
        item = userSave.equipped[key];
        isEquipped = true;
        equippedKey = key;
        break;
      }
    }
  }

  if (!item) return;
  if (item.id === "w_start" || item.id === "w_01" || item.id === "art_01") {
    alert("基礎核心裝備不可拆解！");
    return;
  }

  const salvageGold = calcItemSalvageGold(item);

  const promptMsg = isEquipped 
    ? `【${item.name}】目前正在穿戴中，確定要直接拆解嗎？拆解將獲得 ${salvageGold} 金幣並卸除該裝備。` 
    : `確定要拆解【${item.name}】嗎？將獲得 ${salvageGold} 金幣。`;

  if (confirm(promptMsg)) {
    userSave.playerGold += salvageGold;

    if (isEquipped) {
      userSave.equipped[equippedKey] = null;
    } else {
      userSave.myInventory.splice(index, 1);
    }

    saveGameProgress();
    updatePaperdollSlotsDisplay();
    if (currentSelectingSlot) selectSlotForEquip(currentSelectingSlot);
    playTone(400, 'sawtooth', 0.15);
  }
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
        helmet: userSave.equipped.helmet ? userSave.equipped.helmet.val : null,
        armor: userSave.equipped.armor ? userSave.equipped.armor.val : null,
        gloves: userSave.equipped.gloves ? userSave.equipped.gloves.val : null,
        boots: userSave.equipped.boots ? userSave.equipped.boots.val : null,
        accessory: userSave.equipped.accessory ? userSave.equipped.accessory.val : null,
        talisman: userSave.equipped.talisman ? userSave.equipped.talisman.val : null,
        weapon: userSave.equipped.weapon || { type: 'bare', name: '赤手脈衝' }
      }
    };

    const eqTal = userSave.equipped.talisman;
    const mockPet = {
      active: !!eqTal,
      animal: (eqTal && eqTal.petAnimal) ? eqTal.petAnimal : 'seagull',
      x: -18,
      y: -14 + Math.sin(dollPreviewTime * 3) * 3
    };

    pctx.save();
    pctx.translate(pcanvas.width / 2 + 4, pcanvas.height / 2 + 12);
    pctx.scale(2.0, 2.0);
    drawPlayerPaperdoll(pctx, mockPlayer);
    if (typeof drawPet === 'function') drawPet(pctx, mockPet, mockPlayer, dollPreviewTime);
    pctx.restore();

    dollPreviewAnimId = requestAnimationFrame(loop);
  }
  loop();
}
