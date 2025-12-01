import axios from "axios";
import { exec } from "child_process";
import { promisify } from "util";
import net from "net";

const execAsync = promisify(exec);

export interface CheckResult {
  status: "up" | "down";
  responseTime: number;
  statusCode?: number;
  message: string;
}

// HTTP/HTTPS Checker
export async function checkHttp(url: string, timeout: number = 30000): Promise<CheckResult> {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout,
      validateStatus: () => true, // Accept all status codes
      maxRedirects: 5,
    });

    const responseTime = Date.now() - startTime;

    return {
      status: response.status >= 200 && response.status < 400 ? "up" : "down",
      responseTime,
      statusCode: response.status,
      message: `HTTP ${response.status} - ${response.statusText}`,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      status: "down",
      responseTime,
      message: error.message || "Connection failed",
    };
  }
}

// Keyword Checker
export async function checkKeyword(
  url: string,
  keyword: string,
  timeout: number = 30000
): Promise<CheckResult> {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout,
      maxRedirects: 5,
    });

    const responseTime = Date.now() - startTime;
    const content = response.data.toString();
    const hasKeyword = content.includes(keyword);

    return {
      status: hasKeyword ? "up" : "down",
      responseTime,
      statusCode: response.status,
      message: hasKeyword
        ? `Keyword "${keyword}" ditemukan`
        : `Keyword "${keyword}" tidak ditemukan`,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      status: "down",
      responseTime,
      message: error.message || "Connection failed",
    };
  }
}

// Ping Checker (Windows & Linux)
export async function checkPing(host: string, timeout: number = 30): Promise<CheckResult> {
  const startTime = Date.now();

  try {
    // Windows uses -n, Linux uses -c
    const isWindows = process.platform === "win32";
    const command = isWindows
      ? `ping -n 4 -w ${timeout * 1000} ${host}`
      : `ping -c 4 -W ${timeout} ${host}`;

    const { stdout } = await execAsync(command);
    const responseTime = Date.now() - startTime;

    // Parse ping result
    const lines = stdout.split("\n");
    const hasReply = lines.some((line) =>
      line.toLowerCase().includes(isWindows ? "reply" : "bytes from")
    );

    // Extract average ping time
    let avgPing = responseTime;
    const avgLine = lines.find((line) => line.toLowerCase().includes("average"));
    if (avgLine) {
      const match = avgLine.match(/=?\s*(\d+(?:\.\d+)?)\s*ms/);
      if (match) {
        avgPing = parseFloat(match[1]);
      }
    }

    return {
      status: hasReply ? "up" : "down",
      responseTime: avgPing,
      message: hasReply ? `Ping sukses (${avgPing}ms)` : "Tidak ada balasan",
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      status: "down",
      responseTime,
      message: "Ping gagal",
    };
  }
}

// TCP Port Checker
export async function checkTcpPort(
  host: string,
  port: number,
  timeout: number = 30000
): Promise<CheckResult> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on("connect", () => {
      const responseTime = Date.now() - startTime;
      socket.destroy();
      resolve({
        status: "up",
        responseTime,
        message: `Port ${port} terbuka`,
      });
    });

    socket.on("timeout", () => {
      const responseTime = Date.now() - startTime;
      socket.destroy();
      resolve({
        status: "down",
        responseTime,
        message: "Connection timeout",
      });
    });

    socket.on("error", (error) => {
      const responseTime = Date.now() - startTime;
      socket.destroy();
      resolve({
        status: "down",
        responseTime,
        message: error.message,
      });
    });

    socket.connect(port, host);
  });
}
