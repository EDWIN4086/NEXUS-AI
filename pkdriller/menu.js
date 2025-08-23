const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({
  nomCom: "menu",
  categorie: "Menu"
}, async (jid, sock, ctx) => {
  let { repondre } = ctx;
  let { cm } = require(__dirname + "/../framework/zokou");

  // Group commands by category
  let grouped = {};
  cm.map(cmd => {
    if (!grouped[cmd.categorie]) grouped[cmd.categorie] = [];
    grouped[cmd.categorie].push(cmd.nomCom);
  });

  // Mode check
  let mode = (s.MODE.toLowerCase() === "yes") ? "public" : "private";

  // Date
  moment.tz.setDefault("Etc/GMT");
  const date = moment().format("DD/MM/YYYY");

  // Header
  let header = `

╭━━━〔 ✦ 𝐍𝐄𝐗𝐔𝐒-𝐀𝐈 ✦ 〕━━━◆
┃ ◎ Owner     : ${s.OWNER_NAME}
┃ ◎ Prefix    : [ ${s.PREFIXE} ]
┃ ◎ Mode      : ${mode}
┃ ◎ RAM       : 8/132 GB
┃ ◎ Date      : ${date}
┃ ◎ Platform  : ${os.platform()}
┃ ◎ Creator   : PK Driller
┃ ◎ Commands  : ${cm.length}
┃ ◎ Theme     : NEXUS-AI
╰━━━━━━━━━━━━━━━━━━━━━━━◆
`;

  // Body
  let body = `\n✨ *Available Categories & Commands* ✨\n`;
  for (const cat in grouped) {
    body += `\n╭───❖ *${cat.toUpperCase()}* ❖───╮\n`;
    grouped[cat].forEach(cmd => {
      body += `│> • ${s.PREFIXE}*${cmd}*\n`;
    });
    body += `╰───────────────────────◆\n`;
  }

  // Footer
  let footer = `\n🚀 Powered by *Pkdriller* | Official Channel: @NEXUS-AI`;

  try {
    await sock.sendMessage(jid, {
      text: header + body + footer,
      contextInfo: {
        mentionedJid: [sock.user.id],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: -1
        },
        externalAdReply: {
          title: "NEXUS AI",
          body: "Tap to join the official channel",
          thumbnailUrl: "https://files.catbox.moe/q99uu1.jpg",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  } catch (err) {
    console.error("Menu error: ", err);
    repondre("Menu error: " + err);
  }
});
