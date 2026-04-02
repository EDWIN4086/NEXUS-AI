const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
  nomCom: "forwardg",
  aliases: ["forwardg", "fwdg", "bcg"],
  categorie: "Owner"
}, async (dest, zk, commandeOptions) => {

  const { ms, repondre, auteur } = commandeOptions;

  // 🔐 Owner Only
  if (!conf.OWNER.includes(auteur)) {
    return repondre("❌ This command is for bot owner only.");
  }

  // ⚠️ Must reply to a message
  if (!ms.quoted) {
    return repondre("⚠️ Reply to a message you want to forward to all groups.");
  }

  try {

    let message = ms.quoted;

    // 📌 Get all chats
    let chats = await zk.groupFetchAllParticipating();

    let groups = Object.keys(chats);

    if (!groups.length) {
      return repondre("❌ No groups found.");
    }

    let success = 0;
    let failed = 0;

    // 🚀 Forward to each group
    for (let jid of groups) {
      try {
        await zk.forwardMessage(jid, message, false);
        success++;

        // ⏱ Small delay (ANTI-BAN SAFE)
        await new Promise(res => setTimeout(res, 1500));

      } catch (e) {
        failed++;
      }
    }

    // ✅ Result
    await repondre(
      `📢 Broadcast to Groups Completed\n\n✅ Sent: ${success}\n❌ Failed: ${failed}`
    );

  } catch (err) {
    console.log(err);
    repondre("❌ Error while forwarding to groups.");
  }
});
