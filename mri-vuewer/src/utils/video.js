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
      if (code == 0) {
        console.info(stdout);
        callback(code, stdout);
      } else {
        console.info(stderr);
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
              item.video = {};
              item.video.codec_name = detail[0];
              item.video.pix_fmt = detail[1];
              const size = detail
                .filter(
                  x =>
                    x.match(/x/) &&
                    x.match(/\[/) &&
                    x.match(/\]/) &&
                    x.match(/ /)
                )[0]
                .split(" ")[0]
                .split("x");
              item.video.size = {
                width: Number(size[0]),
                height: Number(size[1])
              };
              item.video.bitrate = Number(
                detail
                  .filter(x => x.match(/kb\/s/))[0]
                  .split(" ")[0]
              );
              item.video.fps = Number(
                detail
                  .filter(x => x.match(/fps/))[0]
                  .split(" ")[0]
              );
              item.video.tbr = Number(
                detail
                  .filter(x => x.match(/tbr/))[0]
                  .split(" ")[0]
              );
              item.video.tbn = Number(
                detail
                  .filter(x => x.match(/tbn/))[0]
                  .split(" ")[0]
              );
              item.video.tbc = Number(
                detail
                  .filter(x => x.match(/tbc/))[0]
                  .split(" ")[0]
              );
            } else {
              item.audio = {};
              item.audio.codec_name = detail[0];
              item.audio.sample_rate = Number(
                detail[1].split(" ")[0]
              );
              item.audio.channel_layout = detail[2];
              item.audio.sample_fmt = detail[3];
              item.audio.bitrate = Number(
                detail[4].split(" ")[0]
              );
            }
          }
        }
      }
      callback(item);
    }
  });
  return result;
};

const getFrames = buff => {
  let stdout = "";
  let stderr = "";
  const video = new Uint8Array(buff);
  const result = ffmpeg({
    MEMFS: [{ name: "data.mp4", data: video }],
    arguments: [
      "-i",
      "data.mp4",
      "-vcodec",
      "mjpeg",
      "image_%03d.jpg"
    ],
    print: function(data) {
      stdout += data + "\n";
    },
    printErr: function(data) {
      stderr += data + "\n";
    },
    onExit: function(code) {
      console.info("Process exited with code " + code);
      if (code == 0) {
        console.log(stdout);
      } else {
        console.log(stderr);
      }
    }
  });
  return result;
};

export default {
  version: version,
  info: info,
  getFrames: getFrames
};
