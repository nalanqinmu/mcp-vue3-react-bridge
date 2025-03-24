import { DesignProcessor } from './core/DesignProcessor';
import { FigmaParser } from './processors/FigmaParser';
import { Vue3Adapter } from './adapters/Vue3Adapter';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { commands } from './cursor-adapter';
import { createSSEServer } from './server';

// 读取配置文件
function loadConfig(configPath: string): any {
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    return yaml.load(configContent);
  } catch (error) {
    console.error('加载配置文件失败:', error);
    throw error;
  }
}

// 主函数：将设计文件转换为Vue3组件
export async function convertDesignToVue3(
  figmaFileId: string, 
  outputDir: string,
  options = {
    styleFormat: 'css',
    includeProps: true,
    includeEvents: true
  }
) {
  try {
    // 加载框架映射配置
    const configPath = path.resolve(__dirname, '../config/framework-mapping.yaml');
    const config = loadConfig(configPath);
    
    // 创建Figma设计数据处理器
    const figmaProcessor = new FigmaParser({
      targetFramework: 'vue3',
      styleFormat: options.styleFormat as any,
      includeProps: options.includeProps,
      includeEvents: options.includeEvents
    });
    
    // 解析Figma设计数据
    const componentData = await figmaProcessor.process(figmaFileId);
    
    // 创建Vue3适配器
    const vue3Adapter = new Vue3Adapter({
      outputDir,
      templatePath: path.resolve(__dirname, '../', config.vue3.componentTemplate),
      styleAdapter: config.vue3.styleAdapter
    });
    
    // 生成Vue3组件
    const outputPath = await vue3Adapter.generateComponent(componentData);
    
    console.log(`成功将Figma设计转换为Vue3组件: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('转换设计为Vue3组件时出错:', error);
    throw error;
  }
}

// 命令行接口
if (require.main === module) {
  // 如果直接运行该文件
  const args = process.argv.slice(2);
  
  // 启动SSE服务器
  if (args[0] === 'server') {
    const port = parseInt(args[1]) || 3000;
    createSSEServer(port);
  } else if (args.length >= 2) {
    // 正常的命令行处理
    const [figmaFileId, outputDir] = args;
    
    convertDesignToVue3(figmaFileId, outputDir)
      .then(outputPath => {
        console.log(`组件已生成: ${outputPath}`);
      })
      .catch(error => {
        console.error('转换失败:', error);
        process.exit(1);
      });
  } else {
    console.log('用法: node index.js <Figma文件ID> <输出目录>');
    console.log('或者: node index.js server [端口号]');
    process.exit(1);
  }
}

// 导出所有可用类
export {
  DesignProcessor,
  FigmaParser,
  Vue3Adapter,
  commands,
  createSSEServer
}; 