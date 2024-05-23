import ffmpeg from "fluent-ffmpeg";
import s3Helper from "./s3.helper";
import fs from "fs";
import path from "path";

class FFmpegHelper {
  public async videoTranscoding(videoUrl: string, videoId: string) {
    let index = 0;
    const outputPath = `output/${videoId}/index.m3u8`;
    const outputSegmentsPath = `output/${videoId}`;
    fs.mkdirSync(outputSegmentsPath, { recursive: true });

    const videoCommand = ffmpeg()
      .input(videoUrl)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-hls_time 10",
        "-hls_list_size 0",
        `-hls_segment_filename ${outputSegmentsPath}/segment_%03d.ts`,
      ])
      .output(outputPath);

    videoCommand.on("start", (commandLine) => {
      console.log("FFmpeg command ", commandLine);
    });

    videoCommand.on("error", (err) => {
      console.error("Error:", err);
    });

    videoCommand.on("data", async (chunk) => {
      index++;
    });

    videoCommand.on("end", () => {
      console.log("Completed");
    });

    // videoCommand.on("end", async () => {
    //   console.log("Transcoding finished.");
    //   const outputReadStream = fs.createReadStream(outputPath);
    //   try {
    //     await s3Helper.uploadToS3(
    //       fs.createReadStream(outputPath),
    //       `${videoId}/${videoId}.m3u8`
    //     );
    //   } catch (error) {
    //     console.error("Error uploading HLS playlist:", error);
    //   }

    //   for (let i = 0; i <= index; i++) {
    //     const segmentPath = path.join(
    //       outputSegmentsPath,
    //       `segment${index}_%03.ts`
    //     );
    //     try {
    //       await s3Helper.uploadToS3(
    //         fs.createReadStream(segmentPath),
    //         `${videoId}/segment${i}.ts`
    //       );
    //     } catch (error) {
    //       console.error(`Error uploading segment ${i}:`, error);
    //     }
    //   }
    // });

    videoCommand.run();
  }
}

export default new FFmpegHelper();
