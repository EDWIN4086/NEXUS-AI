const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

moment.tz.setDefault(conf.TZ);

zokou({
  nomCom: "owner",
  aliases: ["dev", "creator"],
  categorie: "General"
}, async (dest, zk, commandeOptions) => {

  const { ms } = commandeOptions;

  try {

    const time = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");

    let msg = `╭─❏ *👑 NEXUS-AI DEVELOPER*\n` +
              `│\n` +
              `│ 👤 Name: *PKDRILLER*\n` +
              `│ 🌍 Country: *Kenya 🇰🇪*\n` +
              `│ 📆 Date: *${date}*\n` +
              `│ 🕒 Time: *${time}*\n` +
              `│\n` +
              `│ 💬 WhatsApp: wa.me/${conf.NUMERO_OWNER}\n` +
              `│ 🌐 GitHub: ${conf.GURL}\n` +
              `│\n` +
              `╰───────────────❏`;

    await zk.sendMessage(dest, {
      text: msg,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363417804135599@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "👑 NEXUS-AI DEVELOPER",
          body: "Powered by PKDRILLER ⚡",
          thumbnailUrl: conf.LOGO,
          sourceUrl: conf.GURL,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ Owner Command Error:", e);
    await zk.sendMessage(dest, { text: `❌ Error: ${e}` }, { quoted: ms });
  }

});
