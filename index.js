const api = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require('@discordjs/voice');
const config = require("./config.json");
const { logs } = require('more-consoles');

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/update-status', (req, res) => {
  const { status } = req.body;
  // قم بتحديث حالة البوت هنا باستخدام القيمة المستلمة في الطلب
  const userclient = new api.Client();
  userclient.once("ready", async () => {
    userclient.user.setStatus(status || 'idle');
    console.log('Status updated to: ' + status);
  });
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

try {
  Hosting(process.env.TOKEN);

  function Hosting(token) {
    const userclient = new api.Client();

    userclient.once("ready", async () => {
      userclient.user.setStatus(config.status || 'idle');
      logs('Logged in successfully!', userclient);

      if (config.voice !== "voice-channel-id-here") {
        const vc = userclient.channels.cache.get(config.voice);
        if (vc && vc.type === 'GUILD_VOICE') {
          const connection = joinVoiceChannel({
            channelId: config.voice,
            guildId: vc.guildId,
            adapterCreator: vc.guild.voiceAdapterCreator,
            selfDeaf: config.deafen === 'true',
            selfMute: config.mute === 'true',
          });
          console.log('Connected to voice channel: ' + vc.name);
        } else {
          console.log('Invalid voice channel ID provided in the config.json file!');
        }
      } else {
        console.log('Voice channel ID not provided in the config.json file!');
      }

      console.log('Connected: ' + userclient.user.tag);
    });

    userclient.login(token).catch((err) => {
      console.log('Invalid Token');
      process.exit(1);
    }).then(() => {
      console.log('Logged in as: ' + userclient.user.tag);
    });
  }

  process.on('unhandledRejection', error => {
    console.log(error);
  });
} catch (err) {
  console.log(err);
}
