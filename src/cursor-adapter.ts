/**
 * Cursor MCP适配器 - 将MCP集成到Cursor编辑器中
 */

import { convertDesignToVue3 } from './index';

interface CursorContext {
  workspace: {
    rootPath: string;
  };
  figma?: {
    fileId?: string;
    token?: string;
  };
  configuration: {
    styleFormat: 'css' | 'scss' | 'less';
    includeProps: boolean;
    includeEvents: boolean;
  };
}

/**
 * 在Cursor环境中将Figma设计转换为Vue3组件
 */
export async function cursorConvertFigmaToVue3(context: CursorContext) {
  try {
    // 检查Figma配置
    if (!context.figma || !context.figma.fileId) {
      throw new Error('未提供Figma文件ID，请在配置中设置Figma文件ID');
    }

    // 获取工作区路径
    const workspacePath = context.workspace.rootPath;
    
    // 创建输出目录
    const outputDir = `${workspacePath}/src/components`;
    
    // 获取配置选项
    const options = {
      styleFormat: context.configuration.styleFormat || 'css',
      includeProps: context.configuration.includeProps !== false,
      includeEvents: context.configuration.includeEvents !== false
    };
    
    // 调用转换函数
    const outputPath = await convertDesignToVue3(
      context.figma.fileId,
      outputDir,
      options
    );
    
    return {
      success: true,
      message: `成功将Figma设计转换为Vue3组件: ${outputPath}`,
      componentPath: outputPath
    };
  } catch (error) {
    return {
      success: false,
      message: `转换失败: ${error.message}`,
      error: error.toString()
    };
  }
}

// 导出Cursor命令处理函数
export const commands = {
  'convert-figma-to-vue3': cursorConvertFigmaToVue3
}; 