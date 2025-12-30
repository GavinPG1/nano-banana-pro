const fs = require('fs');
const path = require('path');

// Raw data from search results (Titles and IDs)
const rawCases = [
  { id: "998", title: "元旦特辑-粉色的秋千童话风", tags: ["festival", "fairytale", "pink"] },
  { id: "997", title: "元旦特辑-复古旗袍名媛风", tags: ["festival", "vintage", "fashion"] },
  { id: "996", title: "3D卡通形象击碎墙壁", tags: ["3d", "cartoon", "action"] },
  { id: "995", title: "时装设计师根据人物形象绘制草图", tags: ["fashion", "design", "sketch"] },
  { id: "994", title: "百科全书式信息卡片", tags: ["design", "layout", "info"] },
  { id: "993", title: "专业首饰类型设计全流程展示", tags: ["product", "jewelry", "process"] },
  { id: "992", title: "刺绣歌曲海报", tags: ["poster", "embroidery", "music"] },
  { id: "991", title: "超逼真的电影感肖像", tags: ["portrait", "cinematic", "realistic"] },
  { id: "990", title: "高级时装工作室照片拼贴画", tags: ["fashion", "collage", "studio"] },
  { id: "989", title: "一张竖版服装海报", tags: ["fashion", "poster", "vertical"] },
  { id: "988", title: "圣诞特辑-冷艳圣诞甜酷皆在方寸间", tags: ["christmas", "fashion", "cool"] },
  { id: "987", title: "九宫格拼贴画", tags: ["collage", "grid", "creative"] },
  { id: "986", title: "梦幻般的电影级增强现实视觉效果", tags: ["ar", "sci-fi", "visuals"] },
  { id: "985", title: "沙与风产品摄影", tags: ["product", "nature", "sand"] },
  { id: "984", title: "角色拆解艺术海报", tags: ["character", "deconstruction", "poster"] },
  { id: "983", title: "微型艺术家在巨大的人类指甲上作画", tags: ["miniature", "art", "creative"] },
  { id: "982", title: "技术图纸展示板", tags: ["tech", "blueprint", "layout"] },
  { id: "981", title: "童趣风格插画", tags: ["illustration", "kids", "fun"] },
  { id: "980", title: "涂鸦线条干刷色块", tags: ["graffiti", "abstract", "art"] },
  { id: "979", title: "超逼真专业的夜间烟火表演", tags: ["fireworks", "night", "realistic"] },
  { id: "978", title: "一张超写实的电影海报", tags: ["poster", "movie", "realistic"] },
  { id: "977", title: "运动少女照片", tags: ["portrait", "sports", "girl"] },
  { id: "976", title: "博物馆标本摄影", tags: ["museum", "specimen", "photography"] },
  { id: "975", title: "动漫风格的数字海报", tags: ["anime", "poster", "digital"] },
  { id: "974", title: "圣诞特辑-蜜桃背景里的圣诞少女小心思", tags: ["christmas", "girl", "peach"] },
  { id: "973", title: "圣诞特辑-圣诞限定大头贴", tags: ["christmas", "sticker", "cute"] },
  { id: "972", title: "圣诞特辑-美妆博主圣诞妆容教程界面", tags: ["christmas", "makeup", "ui"] },
  { id: "971", title: "第一人称射击游戏视角", tags: ["game", "fps", "perspective"] },
  { id: "970", title: "一个微缩场景模型", tags: ["miniature", "diorama", "model"] },
  { id: "969", title: "女子将食指向前伸出朝向相机镜头", tags: ["portrait", "pose", "interactive"] },
  { id: "968", title: "年轻漂亮的双马尾女子", tags: ["portrait", "girl", "cute"] },
  { id: "967", title: "三联拼贴画描绘了女性的三个连续瞬间", tags: ["collage", "story", "women"] },
  { id: "966", title: "建筑插画师为住宅制作的展示板", tags: ["architecture", "illustration", "board"] },
  { id: "965", title: "苹果iOS照片应用的图库网格视图", tags: ["ui", "ios", "mockup"] },
  { id: "964", title: "时髦的亚洲时尚博主", tags: ["fashion", "blogger", "asian"] },
  { id: "963", title: "圣诞特辑-圣诞姜饼跨框投喂", tags: ["christmas", "creative", "food"] },
  { id: "962", title: "圣诞特辑-圣诞小精灵", tags: ["christmas", "elf", "fantasy"] },
  { id: "961", title: "圣诞特辑-圣诞活动邀请卡", tags: ["christmas", "invitation", "card"] },
  { id: "960", title: "圣诞特辑-圣诞护肤品套装促销卡片", tags: ["christmas", "product", "promo"] },
  { id: "959", title: "电影级的增强现实视觉效果", tags: ["sci-fi", "ar", "cinematic"] },
  { id: "958", title: "卡通风格钥匙扣", tags: ["cartoon", "product", "cute"] },
  { id: "957", title: "高端专业平铺式产品摄影", tags: ["product", "knolling", "professional"] },
  { id: "956", title: "显示在2000年代初日本的手机屏幕上", tags: ["retro", "y2k", "device"] },
  { id: "955", title: "3D橡胶软管角色设计", tags: ["3d", "character", "rubberhose"] },
  { id: "954", title: "一张完整的产品高端宣传照", tags: ["product", "advertising", "high-end"] },
  { id: "953", title: "普通物体转化为巨型纪念碑", tags: ["surreal", "monument", "scale"] },
  { id: "952", title: "不同服装风格的贴纸", tags: ["sticker", "fashion", "set"] },
  { id: "951", title: "衣服悬浮在空中", tags: ["fashion", "floating", "creative"] },
  { id: "950", title: "圣诞特辑-我的圣诞与自己合拍", tags: ["christmas", "selfie", "creative"] },
  { id: "949", title: "圣诞特辑-红韵点睛圣诞风尚志", tags: ["christmas", "fashion", "red"] },
  { id: "948", title: "圣诞特辑-圣诞四格甜妹", tags: ["christmas", "comic", "girl"] },
  { id: "947", title: "圣诞特辑-人物定格在奇幻巨型玻璃雪球里", tags: ["christmas", "fantasy", "snowglobe"] },
  { id: "946", title: "指定年份的小玩意和发明可视化", tags: ["retro", "invention", "visual"] },
  { id: "945", title: "将你最喜欢的角色变成收藏品", tags: ["toy", "collectible", "character"] },
  { id: "944", title: "超逼真的Macbook屏幕视频会议图", tags: ["mockup", "tech", "realistic"] },
  { id: "943", title: "五联宽幅胶片拼贴作品", tags: ["collage", "film", "panoramic"] },
  { id: "942", title: "植发一年的改变图", tags: ["medical", "comparison", "before-after"] },
  { id: "941", title: "摆放着一个与本人相似的Q版模型", tags: ["toy", "chibi", "miniature"] },
  { id: "940", title: "钢铁侠可口可乐", tags: ["branding", "crossover", "marvel"] },
  { id: "939", title: "概念艺术杂志的编辑照片", tags: ["magazine", "editorial", "art"] },
  { id: "938", title: "女性正从她的手机屏幕中走出来", tags: ["surreal", "3d", "mobile"] },
  { id: "937", title: "电影感十足的肖像摄影作品", tags: ["portrait", "cinematic", "photography"] },
  { id: "936", title: "卡通画变成 Funko Pop 乙烯基人偶", tags: ["toy", "funkopop", "3d"] },
  { id: "935", title: "Y2K时代的拼贴海报", tags: ["y2k", "poster", "collage"] },
  { id: "934", title: "女性自拍照", tags: ["selfie", "portrait", "daily"] },
  { id: "933", title: "女性在奔跑时腾空而起", tags: ["action", "sports", "dynamic"] },
  { id: "932", title: "电影般的时尚网格图", tags: ["fashion", "grid", "cinematic"] },
  { id: "931", title: "年轻女性的韩式时尚特写肖像", tags: ["fashion", "korean", "portrait"] },
  { id: "930", title: "90年代复古黑白肖像照", tags: ["vintage", "bw", "90s"] },
  { id: "929", title: "女子面部的超近距离微距肖像", tags: ["macro", "portrait", "details"] },
  { id: "928", title: "女士手持一个自己的木质相框", tags: ["creative", "frame", "inception"] },
  { id: "927", title: "女性站在KAWS风格艺术雕塑旁", tags: ["art", "kaws", "sculpture"] },
  { id: "926", title: "金发女子跪在游艇甲板上", tags: ["lifestyle", "luxury", "yacht"] },
  { id: "925", title: "健身房自拍照", tags: ["gym", "selfie", "fitness"] },
  { id: "924", title: "电视新闻演播室现场", tags: ["news", "studio", "broadcast"] },
  { id: "923", title: "冬至海报", tags: ["festival", "winter", "poster"] },
  { id: "922", title: "产品高端商业营销设计", tags: ["product", "marketing", "design"] },
  { id: "921", title: "MacBook Pro打开了X应用的照片", tags: ["mockup", "tech", "app"] },
  { id: "920", title: "城市渲染数字艺术海报", tags: ["city", "digital", "art"] },
  { id: "919", title: "丁香色长裙女性双版本比例对比", tags: ["fashion", "comparison", "layout"] },
  { id: "918", title: "生成一周的服装搭配", tags: ["fashion", "outfit", "planning"] },
  { id: "917", title: "用手指操纵自己的复制品", tags: ["surreal", "creative", "miniature"] },
  { id: "916", title: "高端影棚肖像照", tags: ["portrait", "studio", "high-end"] },
  { id: "915", title: "照片转换成漫画", tags: ["style-transfer", "comic", "art"] },
  { id: "914", title: "复古风格", tags: ["vintage", "retro", "style"] },
  { id: "200", title: "真人和风格对照直出", tags: ["comparison", "style", "creative"] },
  { id: "199", title: "自定义纹理的复古玩具", tags: ["toy", "vintage", "texture"] },
  { id: "198", title: "可爱的设计师玩偶", tags: ["toy", "designer", "cute"] },
  { id: "197", title: "数字粘土雕塑", tags: ["3d", "clay", "art"] },
  { id: "196", title: "字母景观", tags: ["typography", "landscape", "creative"] },
  { id: "195", title: "经典的微型玩具风格", tags: ["toy", "miniature", "classic"] },
  { id: "194", title: "装饰艺术未来主义", tags: ["art-deco", "futuristic", "style"] },
  { id: "193", title: "将您的徽标放在月球上", tags: ["branding", "space", "creative"] },
  { id: "192", title: "月光屋顶茶话会", tags: ["lifestyle", "night", "party"] },
  { id: "191", title: "后世界末日氛围", tags: ["apocalypse", "atmospheric", "cinematic"] },
  { id: "190", title: "品牌虚拟人物", tags: ["branding", "character", "virtual"] },
  { id: "189", title: "心爱的角色制作动漫风格的签名", tags: ["anime", "signature", "character"] },
  { id: "188", title: "微型毛毡羊毛人物", tags: ["craft", "felt", "character"] },
  { id: "187", title: "新卡通风格", tags: ["cartoon", "style", "new"] },
  { id: "186", title: "装饰艺术大都会", tags: ["art-deco", "city", "metropolis"] },
  { id: "185", title: "人体工程学", tags: ["design", "ergonomics", "concept"] },
  { id: "184", title: "乐高风格套装", tags: ["lego", "toy", "set"] },
  { id: "183", title: "霓虹效果海报", tags: ["neon", "poster", "design"] },
  { id: "182", title: "鸟类羽毛制成LOGO", tags: ["branding", "nature", "creative"] },
  { id: "181", title: "抽象液体排版文字", tags: ["typography", "liquid", "abstract"] },
  { id: "180", title: "可爱粉彩乙烯基人物", tags: ["vinyl", "toy", "pastel"] },
  { id: "179", title: "创建多种3D风格头像", tags: ["3d", "avatar", "character"] },
  { id: "178", title: "生物发光", tags: ["nature", "bioluminescence", "light"] },
  { id: "177", title: "2D单词海报设计", tags: ["typography", "poster", "2d"] },
  { id: "176", title: "三维几何效果", tags: ["3d", "geometric", "abstract"] },
  { id: "175", title: "半透明晶体效果", tags: ["3d", "crystal", "translucent"] },
  { id: "174", title: "生成电影氛围图", tags: ["cinematic", "atmospheric", "movie"] },
  { id: "173", title: "复古风格图标", tags: ["icon", "vintage", "design"] },
  { id: "172", title: "棱柱形水晶", tags: ["crystal", "prism", "abstract"] },
  { id: "171", title: "霓虹灯品牌重新构想", tags: ["neon", "branding", "redesign"] },
  { id: "170", title: "新卡通风格", tags: ["cartoon", "style", "new"] },
  { id: "169", title: "微型透明胶囊", tags: ["3d", "capsule", "miniature"] },
  { id: "168", title: "水果蜡烛", tags: ["product", "candle", "fruit"] },
  { id: "167", title: "液态金属设计产品", tags: ["design", "liquid-metal", "product"] },
  { id: "166", title: "几何禅", tags: ["geometric", "zen", "abstract"] },
  { id: "165", title: "用气泡膜覆盖表情符号", tags: ["creative", "texture", "emoji"] },
  { id: "164", title: "将表情符号变成纸板", tags: ["craft", "cardboard", "emoji"] },
  { id: "163", title: "半透明玻璃物品ASMR", tags: ["3d", "glass", "asmr"] },
  { id: "162", title: "超现实主义蒸汽波", tags: ["surreal", "vaporwave", "art"] },
  { id: "161", title: "物品纹理处理", tags: ["texture", "design", "process"] },
  { id: "160", title: "新动漫风格", tags: ["anime", "style", "new"] },
  { id: "159", title: "渲染宝石", tags: ["3d", "gemstone", "render"] },
  { id: "158", title: "品牌3D卡通动物角色", tags: ["branding", "3d", "character"] },
  { id: "157", title: "最小天气小部件", tags: ["ui", "weather", "minimal"] },
  { id: "156", title: "作为家具的著名地标", tags: ["creative", "architecture", "furniture"] },
  { id: "155", title: "自己的国家地标时尚杂志", tags: ["fashion", "magazine", "landmark"] },
  { id: "154", title: "五颜六色的针织", tags: ["texture", "knitted", "colorful"] },
  { id: "153", title: "霓虹灯线框", tags: ["neon", "wireframe", "3d"] },
  { id: "152", title: "新动漫风格", tags: ["anime", "style", "new"] },
  { id: "151", title: "Neoglo风格Logo", tags: ["branding", "logo", "neoglo"] },
  { id: "150", title: "乙烯基玩具", tags: ["toy", "vinyl", "collectible"] },
  { id: "149", title: "Gorillaz风格角色", tags: ["style", "character", "gorillaz"] },
  { id: "148", title: "怀旧午后阳光", tags: ["atmospheric", "nostalgia", "sunlight"] },
  { id: "147", title: "玻璃变形海报", tags: ["design", "glass", "distortion"] },
  { id: "146", title: "全息叠加效果彩虹渐变", tags: ["holographic", "gradient", "overlay"] },
  { id: "145", title: "用自己的审美下棋", tags: ["creative", "chess", "aesthetic"] },
  { id: "144", title: "梦幻般的蒸汽波失真", tags: ["vaporwave", "distortion", "dreamy"] },
  { id: "143", title: "迪士尼鸡尾酒", tags: ["creative", "drink", "disney"] },
  { id: "142", title: "为任何品牌设计运动鞋", tags: ["product", "sneaker", "design"] },
  { id: "141", title: "监控级别的时尚洞察力", tags: ["fashion", "surveillance", "concept"] },
  { id: "140", title: "现代数字动漫风格", tags: ["anime", "digital", "modern"] },
  { id: "139", title: "将您最喜欢的品牌变成生活方式产品", tags: ["branding", "product", "lifestyle"] },
  { id: "138", title: "Gumroad样式图标", tags: ["icon", "style", "design"] },
  { id: "137", title: "透视一切", tags: ["x-ray", "transparent", "creative"] },
  { id: "136", title: "日常用品有皮肤", tags: ["surreal", "texture", "creative"] },
  { id: "135", title: "棱柱形玻璃图标", tags: ["icon", "glass", "prism"] },
  { id: "134", title: "生成真实电影海报", tags: ["poster", "movie", "realistic"] },
  { id: "133", title: "幽灵形态", tags: ["ghost", "effect", "creative"] },
  { id: "132", title: "悬浮魔幻现实主义", tags: ["surreal", "floating", "magic"] },
  { id: "131", title: "自定义毛绒钥匙扣", tags: ["product", "plush", "cute"] },
  { id: "130", title: "创建超现实不可能的图像", tags: ["surreal", "impossible", "art"] },
  { id: "129", title: "创建悬浮切片水果", tags: ["food", "floating", "creative"] },
  { id: "128", title: "一个字的无限反射", tags: ["typography", "reflection", "infinity"] },
  { id: "127", title: "符号冲突", tags: ["abstract", "symbol", "clash"] },
  { id: "126", title: "重新构想的超现实主义广告", tags: ["advertising", "surreal", "creative"] },
  { id: "125", title: "时尚品牌娃娃", tags: ["toy", "fashion", "doll"] },
  { id: "124", title: "磨砂模糊剪影", tags: ["silhouette", "frosted", "blur"] },
  { id: "123", title: "植物雕塑", tags: ["nature", "sculpture", "art"] },
  { id: "122", title: "史莱姆制成的玩具运输车", tags: ["toy", "slime", "creative"] },
  { id: "121", title: "文艺复兴时期的解剖学研究", tags: ["art", "anatomy", "renaissance"] },
  { id: "120", title: "奇趣风格3D乙烯基玩具", tags: ["toy", "3d", "funky"] },
  { id: "119", title: "城市绣花贴纸照片", tags: ["sticker", "embroidery", "city"] },
  { id: "118", title: "品牌产品数字广告", tags: ["advertising", "digital", "branding"] },
  { id: "117", title: "动漫机甲风格化机械设计图", tags: ["anime", "mecha", "blueprint"] },
  { id: "116", title: "任天堂风格的3D卡通插画", tags: ["cartoon", "nintendo", "3d"] },
  { id: "115", title: "冰爽优雅的产品海报", tags: ["poster", "product", "fresh"] },
  { id: "114", title: "Monochrome LCD效果", tags: ["retro", "lcd", "monochrome"] },
  { id: "113", title: "发光图标", tags: ["icon", "glowing", "design"] },
  { id: "112", title: "重点线条勾勒", tags: ["art", "line", "sketch"] },
  { id: "111", title: "3D超写实场景模型", tags: ["3d", "scene", "realistic"] },
  { id: "110", title: "皮克斯风格角色表", tags: ["character", "pixar", "sheet"] },
  { id: "109", title: "涂料飞溅Logo", tags: ["branding", "logo", "splash"] },
  { id: "108", title: "标志液化", tags: ["branding", "logo", "liquid"] },
  { id: "107", title: "超级动物英雄", tags: ["character", "animal", "hero"] },
  { id: "106", title: "时间之神", tags: ["fantasy", "god", "time"] },
  { id: "105", title: "刺绣logo", tags: ["branding", "logo", "embroidery"] },
  { id: "104", title: "珐琅马赛克瓷砖风格", tags: ["texture", "mosaic", "tile"] },
  { id: "103", title: "刺绣风格", tags: ["art", "embroidery", "style"] },
  { id: "102", title: "纹理化图片", tags: ["texture", "effect", "image"] },
  { id: "101", title: "将你的Logo变成吉祥物", tags: ["branding", "mascot", "logo"] }
];

// Unsplash keywords mapping for better image matching
const getImageKeyword = (tags, title) => {
  if (tags.includes('christmas')) return 'christmas';
  if (tags.includes('festival')) return 'festival';
  if (tags.includes('toy')) return 'toy';
  if (tags.includes('neon')) return 'neon';
  if (tags.includes('nature')) return 'nature';
  if (tags.includes('fashion')) return 'fashion';
  if (tags.includes('food')) return 'food';
  if (tags.includes('architecture')) return 'architecture';
  if (tags.includes('tech')) return 'technology';
  if (tags.includes('3d')) return '3d render';
  if (tags.includes('anime')) return 'anime style';
  if (tags.includes('portrait')) return 'portrait';
  return 'art';
};

// Generate full prompts list
const prompts = rawCases.map(item => {
  const keyword = getImageKeyword(item.tags, item.title);
  // Deterministic random-like image ID based on ID to keep it consistent
  const randomId = parseInt(item.id) * 12345 % 1000; 
  
  return {
    id: item.id,
    title: item.title,
    // Generate a descriptive prompt based on the title
    prompt: `High quality prompt for ${item.title}. A stunning visualization featuring ${item.tags.join(', ')} elements. Professional photography, 8k resolution, highly detailed, cinematic lighting, ${keyword} theme.`,
    tags: item.tags,
    // Use Unsplash source API which redirects to a relevant image
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + randomId}?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3` 
    // Note: Since we can't guarantee valid IDs with random numbers, we'll use the source API in the frontend or just reliable IDs if possible. 
    // Actually, let's use the source endpoint for "random" valid images: 
    // https://source.unsplash.com/800x800/?${keyword} (Deprecated/Slow)
    // Better: Use a fixed set of high quality base IDs and rotate them, or use the keyword search format if Next.js config allows.
    // Let's stick to the format we had but maybe just use a valid base image and rotate params?
    // To make it safe, I'll generate the TS file with a placeholder logic for images, 
    // or better yet, I will use a simple function to pick from a list of known good Unsplash IDs.
  };
});

// List of known good Unsplash Image IDs to rotate through
const stockImages = [
  "1512389142860-9c449e58a543", // Christmas/Red
  "1531746020798-e6953c6e8e04", // Portrait
  "1493246507139-91e8fad9978e", // Nature/Landscape
  "1523170335258-f5ed11844a49", // Product
  "1618005182384-a83a8bd57fbe", // Fashion
  "1632516643720-e7f5d7d6ecc9", // Creative
  "1620641782983-5b84aceea6b5", // 3D
  "1550745165-9bc0b252726f",    // Retro
  "1550751827-4bd374c3f58b",    // Tech
  "1535074153097-6062175bdb16", // Architecture
  "1515405295579-ba7f454363b2", // Neon
  "1519751138062-acf807802163", // Interior
  "1507525428034-b723cf961d3e", // Fireworks
  "1492684223066-81342ee5ff30", // Event
  "1513542789411-b6a5d4f31634"  // Space
];

// Assign images
prompts.forEach((p, index) => {
  const imgId = stockImages[index % stockImages.length];
  p.imageUrl = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=800`;
});

// Create the TS content
const fileContent = `export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  imageUrl: string;
}

export const prompts: Prompt[] = ${JSON.stringify(prompts, null, 2)};

export const allTags = Array.from(new Set(prompts.flatMap(p => p.tags))).sort();
`;

// Write file
fs.writeFileSync(path.join(__dirname, 'prompts.ts'), fileContent);
console.log(`Generated ${prompts.length} prompts.`);
