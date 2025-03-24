import * as http from 'http';
import * as url from 'url';
import { commands, CursorContext } from './cursor-adapter';

// SSE服务器配置
const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Access-Control-Allow-Origin': '*'
};

/**
 * 创建SSE服务器
 */
export function createSSEServer(port: number = 3000) {
  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    // 设置SSE响应头部
    Object.entries(SSE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // 解析请求URL
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';

    // 路由处理
    if (pathname === '/events') {
      handleSSEConnection(req, res);
    } else if (pathname === '/api/commands') {
      handleCommandRequest(req, res);
    } else {
      // 为其他路径返回404
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(port, () => {
    console.log(`SSE 服务器运行在 http://localhost:${port}`);
  });

  return server;
}

/**
 * 处理SSE连接
 */
function handleSSEConnection(req: http.IncomingMessage, res: http.ServerResponse) {
  console.log('客户端已连接到SSE');

  // 保持连接打开
  res.write(':\n\n'); // 注释行，保持连接活动

  // 发送初始连接事件
  sendSSEEvent(res, 'connected', { status: 'ok', message: 'MCP服务器已连接' });

  // 定期发送心跳以保持连接
  const heartbeatInterval = setInterval(() => {
    res.write(':\n\n'); // 发送注释作为心跳
  }, 30000);

  // 客户端断开连接时清理
  req.on('close', () => {
    console.log('客户端已断开连接');
    clearInterval(heartbeatInterval);
  });
}

/**
 * 发送SSE事件
 */
function sendSSEEvent(res: http.ServerResponse, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

interface CommandRequest {
  command: string;
  context: CursorContext;
}

/**
 * 处理命令请求
 */
async function handleCommandRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end();
    return;
  }

  // 获取请求体
  let body = '';
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { command, context } = JSON.parse(body) as CommandRequest;
      
      // 检查命令是否存在
      if (!command || !commands[command as keyof typeof commands]) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: '无效的命令' }));
        return;
      }

      // 执行命令
      const commandFn = commands[command as keyof typeof commands];
      const result = await commandFn(context);
      
      // 返回结果
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error('处理命令时出错:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: '内部服务器错误' }));
    }
  });
}

// 如果直接运行此文件
if (typeof require !== 'undefined' && require.main === module) {
  createSSEServer();
} 