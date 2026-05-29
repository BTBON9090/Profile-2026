const CDN_BASE = "https://cdn.btbon.cn/music";
const LRC_CDN_BASE = "https://cdn.btbon.cn/music/lyrics";
const DEFAULT_COVER = "https://cdn.btbon.cn/images/head.jpg";

export interface Track {
  url: string;
  title: string;
  artist: string;
  cover: string;
  lrc: string;
}

function makeTrack(filename: string, title: string, artist: string): Track {
  const base = filename.replace(/\.mp3$/, "");
  return {
    url: `${CDN_BASE}/${filename}`,
    title,
    artist,
    cover: DEFAULT_COVER,
    lrc: `${LRC_CDN_BASE}/${base}.lrc`,
  };
}

export const PLAYLIST: Track[] = [
  makeTrack("BLACKPINK_As_If_It's_Your_Last.mp3", "As If It's Your Last", "BLACKPINK"),
  makeTrack("BLACKPINK_DDU_DU_DDU_DU.mp3", "DDU DU DDU DU", "BLACKPINK"),
  makeTrack("BLACKPINK_Kill_This_Love.mp3", "Kill This Love", "BLACKPINK"),
  makeTrack("Bruno_Mars_I_Just_Might.mp3", "I Just Might", "Bruno Mars"),
  makeTrack("G.E.M._邓紫棋_桃花诺.mp3", "桃花诺", "G.E.M. 邓紫棋"),
  makeTrack("Jessie_J_&Ariana_Grande_&Nicki_Minaj_Bang_Bang.mp3", "Bang Bang", "Jessie J, Ariana Grande, Nicki Minaj"),
  makeTrack("Justin_Bieber_Ludacris_Baby.mp3", "Baby", "Justin Bieber, Ludacris"),
  makeTrack("Lady_Gaga_&Bruno_Mars_Die_With_A_Smile.mp3", "Die With A Smile", "Lady Gaga, Bruno Mars"),
  makeTrack("Justin_Bieber_Ludacris_Baby.mp3", "Baby", "Justin Bieber, Ludacris"),
  makeTrack("Lady_Gaga_&Bruno_Mars_Die_With_A_Smile.mp3", "Die With A Smile", "Lady Gaga, Bruno Mars"),
  makeTrack("Lil_Nas_X_STAR_WALKIN'.mp3", "STAR WALKIN'", "Lil Nas X"),
  makeTrack("Linkin_Park_Heavy_Is_the_Crown.mp3", "Heavy Is the Crown", "Linkin Park"),
  makeTrack("Luis_Fonsi_&Daddy_Yankee_&Justin_Bieber_Despacito.mp3", "Despacito", "Luis Fonsi, Daddy Yankee, Justin Bieber"),
  makeTrack("NewJeans-登神-GODS.mp3", "登神 (GODS)", "NewJeans"),
  makeTrack("Rachid_Boutaicha_Midnight_Whisper.mp3", "Midnight Whisper", "Rachid Boutaicha"),
  makeTrack("STARS.mp3", "POP/STARS", "K/DA"),
  makeTrack("Supaderb_Neon_Nights.mp3", "Neon Nights", "Supaderb"),
  makeTrack("Taylor_Swift_Blank_Space_(Taylor's_Version).mp3", "Blank Space (Taylor's Version)", "Taylor Swift"),
  makeTrack("Taylor_Swift_I_Knew_You_Were_Trouble.mp3", "I Knew You Were Trouble", "Taylor Swift"),
  makeTrack("Taylor_Swift_Love_Story.mp3", "Love Story", "Taylor Swift"),
  makeTrack("Taylor_Swift_Opalite.mp3", "Opalite", "Taylor Swift"),
  makeTrack("Taylor_Swift_Shake_It_Off.mp3", "Shake It Off", "Taylor Swift"),
  makeTrack("Taylor_Swift_Style.mp3", "Style", "Taylor Swift"),
  makeTrack("Taylor_Swift_The_Fate_of_Ophelia.mp3", "The Fate of Ophelia", "Taylor Swift"),
  makeTrack("The_Kid_LAROI_&Justin_Bieber_STAY.mp3", "STAY (Explicit)", "The Kid LAROI, Justin Bieber"),
  makeTrack("The_Weeknd_After_Hours.mp3", "After Hours", "The Weeknd"),
  makeTrack("X_&EJAE_&AUDREY_NUNA_&REI_AMI_&KPop_Demon_Hunters_Cast_Golden.mp3", "KPop", "X, JAE, AUDREY NUNA, REL AMI"),
  makeTrack("周杰伦_菊花台.mp3", "菊花台", "周杰伦"),
  makeTrack("周深_璀璨冒险人.mp3", "璀璨冒险人", "周深"),
  makeTrack("张芸京_偏爱.mp3", "偏爱", "张芸京"),
  makeTrack("胡歌_六月的雨.mp3", "六月的雨", "胡歌"),
  makeTrack("胡歌_忘记时间.mp3", "忘记时间", "胡歌"),
  makeTrack("胡歌_逍遥叹.mp3", "逍遥叹", "胡歌"),
  makeTrack("英雄联盟_&G.E.M._邓紫棋_Sacrifice_(争).mp3", "Sacrifice (争)", "英雄联盟, G.E.M. 邓紫棋"),
  makeTrack("英雄联盟_&MAX_&Jeremy_McKinnon_&HENRY刘宪华_Take_Over.mp3", "Physically Electric", "英雄联盟, MAX, Jeremy McKinnon, HENRY 刘宪华"),
  makeTrack("英雄联盟_不可阻挡_(Burn_It_All_Down).mp3", "不可阻挡 (Burn It All Down)", "英雄联盟"),
  makeTrack("英雄联盟_涅槃_(Phoenix).mp3", "涅槃 (Phoenix)", "英雄联盟"),
  makeTrack("阿桑_一直很安静.mp3", "一直很安静", "阿桑"),
  makeTrack("陈子晴_偏向.mp3", "偏向", "陈子晴"),
  makeTrack("青鸟飞鱼_此生不换.mp3", "此生不换", "青鸟飞鱼"),
];
