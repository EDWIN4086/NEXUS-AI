const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

moment.tz.setDefault(conf.TZ);

// Owner/Dev only check function
const isOwner = (sender) => {
  const owners = conf.OWNER_NUMBERS || []; // Add owner numbers in set.js
  return owners.includes(sender.split('@')[0]);
};

zokou({ nomCom: "dev", categorie: "Owner", reaction: '👑', aliases: ["owner", "admincmd"] }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, auteur } = commandeOptions;
  
  // Check if user is owner/dev
  if (!isOwner(auteur)) {
    return repondre("❌ *Access Denied!*\nThis command is only for Bot Owner/Developer.");
  }

  try {
    const startTime = Date.now();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = os.loadavg();
    const totalMem = os.totalmem() / (1024 ** 3);
    const freeMem = os.freemem() / (1024 ** 3);
    const usedMem = totalMem - freeMem;
    
    // System Information
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      cores: os.cpus().length,
      hostname: os.hostname(),
      uptime: os.uptime()
    };
    
    // Bot Stats (you can add your own stats)
    const botStats = {
      groups: await zk.groupFetchAllParticipating() || {},
      commands: "Various", // Add your command count
      status: "🟢 Online"
    };
    
    const ping = Date.now() - startTime;
    const time = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");
    const uptime = moment.duration(os.uptime(), 'seconds');
    const botUptime = moment.duration(process.uptime(), 'seconds');
    
    let msg = `╭─❏ *👑 OWNER/DEV PANEL* ─❏\n` +
              `│\n` +
              `│ 👤 *Owner:* ${conf.BOT_OWNER || "NEXUS-AI"}\n` +
              `│ 🤖 *Bot Name:* ${conf.BOT_NAME || "NEXUS-AI"}\n` +
              `│ 📊 *Version:* ${conf.VERSION || "2.0.0"}\n` +
              `│\n` +
              `├─❏ *⚡ SYSTEM STATUS* ─❏\n` +
              `│\n` +
              `│ 💾 *Response Time:* ${ping}ms\n` +
              `│ 🖥️ *Platform:* ${systemInfo.platform} (${systemInfo.arch})\n` +
              `│ 🧠 *CPU Cores:* ${systemInfo.cores}\n` +
              `│ 📈 *CPU Load:* ${cpuUsage[0].toFixed(2)}%, ${cpuUsage[1].toFixed(2)}%, ${cpuUsage[2].toFixed(2)}%\n` +
              `│ 💻 *Node Version:* ${systemInfo.nodeVersion}\n` +
              `│\n` +
              `├─❏ *💾 MEMORY USAGE* ─❏\n` +
              `│\n` +
              `│ 📊 *Total RAM:* ${totalMem.toFixed(2)}GB\n` +
              `│ 🟢 *Free RAM:* ${freeMem.toFixed(2)}GB\n` +
              `│ 🔴 *Used RAM:* ${usedMem.toFixed(2)}GB\n` +
              `│ 📦 *Heap Used:* ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB\n` +
              `│ 📦 *Heap Total:* ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB\n` +
              `│\n` +
              `├─❏ *⏰ TIME INFO* ─❏\n` +
              `│\n` +
              `│ 📅 *Date:* ${date}\n` +
              `│ 🕐 *Time:* ${time}\n` +
              `│ ⏱️ *Bot Uptime:* ${botUptime.hours()}h ${botUptime.minutes()}m ${botUptime.seconds()}s\n` +
              `│ 🖥️ *System Uptime:* ${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s\n` +
              `│\n` +
              `├─❏ *📊 BOT STATISTICS* ─❏\n` +
              `│\n` +
              `│ 👥 *Total Groups:* ${Object.keys(botStats.groups).length}\n` +
              `│ 🟢 *Bot Status:* ${botStats.status}\n` +
              `│\n` +
              `└─❏ *Powered by ${conf.BOT_NAME || "NEXUS-AI"}* ─❏`;

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
          title: "👑 OWNER/DEV CONTROL PANEL",
          body: "Full System Access Granted ✅",
          thumbnailUrl: conf.LOGO,
          sourceUrl: conf.GURL,
          mediaType: 1
        }
      }
    }, { quoted: ms });
    
    // Additional owner-only reply with more sensitive info
    await repondre(`🔐 *Owner Access Granted*\n\nTerminal commands available:\n• .exec <code>\n• .eval <code>\n• .reboot\n• .shutdown\n• .broadcast <message>\n• .getvar <var>\n• .setvar <var> <value>`);
    
  } catch (e) {
    console.log("❌ Dev Command Error:", e);
    await repondre(`❌ Error: ${e.message}`);
  }
});

// Additional owner-only command: Execute shell commands
zokou({ nomCom: "exec", categorie: "Owner", reaction: '💻', aliases: ["$"] }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, auteur, arg } = commandeOptions;
  const { exec } = require('child_process');
  
  if (!isOwner(auteur)) {
    return repondre("❌ *Access Denied!*\nThis command is only for Bot Owner.");
  }
  
  if (!arg.length) {
    return repondre("❌ Please provide a command to execute!\nExample: .exec ls -la");
  }
  
  const command = arg.join(' ');
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return repondre(`❌ Error: ${error.message}`);
    }
    if (stderr) {
      return repondre(`⚠️ Stderr: ${stderr}`);
    }
    repondre(`✅ *Command Executed*\n\n📝 Command: ${command}\n\n📤 Output:\n${stdout || "No output"}`);
  });
});

// Broadcast message to all groups (owner only)
zokou({ nomCom: "broadcast", categorie: "Owner", reaction: '📢', aliases: ["bc"] }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, auteur, arg } = commandeOptions;
  
  if (!isOwner(auteur)) {
    return repondre("❌ *Access Denied!*\nThis command is only for Bot Owner.");
  }
  
  if (!arg.length) {
    return repondre("❌ Please provide a message to broadcast!\nExample: .broadcast Hello everyone!");
  }
  
  const message = arg.join(' ');
  const groups = await zk.groupFetchAllParticipating();
  let sent = 0;
  let failed = 0;
  
  await repondre(`📢 *Broadcasting to ${Object.keys(groups).length} groups...*`);
  
  for (let groupId in groups) {
    try {
      await zk.sendMessage(groupId, { text: `📢 *BROADCAST MESSAGE*\n\n${message}\n\n_From Bot Owner_` });
      sent++;
    } catch (e) {
      failed++;
    }
  }
  
  await repondre(`✅ *Broadcast Complete*\n\n📤 Sent: ${sent}\n❌ Failed: ${failed}`);
});

// Reboot bot command
zokou({ nomCom: "reboot", categorie: "Owner", reaction: '🔄' }, async (dest, zk, commandeOptions) => {
  const { repondre, auteur } = commandeOptions;
  
  if (!isOwner(auteur)) {
    return repondre("❌ *Access Denied!*");
  }
  
  await repondre("🔄 *Rebooting bot...*\n_Bot will be back online shortly_");
  process.exit(0);
});
