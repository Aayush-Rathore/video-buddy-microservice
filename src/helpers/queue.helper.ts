import { Worker, Job } from "bullmq";
import ffmpegHelper from "./ffmpeg.helper";

class QueueHelper {
  private worker = new Worker("video-queue", async (job: Job) => {}, {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS,
    },
    concurrency: 1,
  });

  public async startQueueWorker() {
    this.worker.on("completed", async (job: Job) => {
      const data: { videoUrl: string; videoId: string } = job.data;
      await ffmpegHelper.videoTranscoding(data.videoUrl, data.videoId);
    });
  }
}

export default new QueueHelper();
