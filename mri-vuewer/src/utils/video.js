import ffmpeg from "ffmpeg.js/ffmpeg-mp4.js";

const version = callback => {
  let stdout = "";
  let stderr = "";
  // Print FFmpeg's version.
  const result = ffmpeg({
    arguments: ["-version"],
    print: function(data) {
      stdout += data + "\n";
    },
    printErr: function(data) {
      stderr += data + "\n";
    },
    onExit: function(code) {
      console.log("Process exited with code " + code);
      if (code == 0) {
        console.log(stdout);
        callback(code, stdout);
      } else {
        console.log(stderr);
        callback(code, stdout);
      }
    }
  });
  return result;
};

const info = (buff, callback) => {
  const video = new Uint8Array(buff);
  let stdout = "";
  // Print FFmpeg's version.
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: ["-i", "data.mp4"],
    print: function(data) {
      stdout += data + "\n";
    },
    printErr: function(data) {
      stdout += data + "\n";
    },
    onExit: function() {
      let item = {};
      for (const line of stdout.split("\n")) {
        if (~line.indexOf("Stream")) {
          const info = line.split(": ");
          if (info.length == 3) {
            const detail = info[2].split(", ");
            if (info[1] == "Video") {
              const size = detail[2].split(" ")[0].split("x");
              item.video = {};
              item.video.codec_name = detail[0];
              item.video.pix_fmt = detail[1];
              item.video.size = [Number(size[0]), Number(size[0])];
              item.video.bitrate = Number(detail[3].split(" ")[0]);
              item.video.fps = Number(detail[4].split(" ")[0]);
              item.video.tbr = Number(detail[5].split(" ")[0]);
              item.video.tbn = Number(detail[6].split(" ")[0]);
              item.video.tbc = Number(detail[7].split(" ")[0]);
            } else {
              item.audio = {};
              item.audio.codec_name = detail[0];
              item.audio.sample_rate = Number(detail[1].split(" ")[0]);
              item.audio.channel_layout = detail[2];
              item.audio.sample_fmt = detail[3];
              item.audio.bitrate = Number(detail[4].split(" ")[0]);
            }
          }
        }
      }
      callback(item);
    }
  });
  return result;
};

export default {
  version: version,
  info: info
};
