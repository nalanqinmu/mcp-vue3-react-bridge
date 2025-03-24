import { convertDesignToVue3 } from '../index';

/**
 * 这个示例演示如何使用MCP工具将Figma设计转换为Vue3组件
 */
async function runExample() {
  try {
    // Figma文件ID - 实际使用时需要替换为有效的文件ID
    const figmaFileId = 'EXAMPLE_FIGMA_FILE_ID'; 
    
    // 输出目录
    const outputDir = './output/components';
    
    // 设置选项
    const options = {
      styleFormat: 'css',
      includeProps: true,
      includeEvents: true
    };
    
    console.log('开始转换Figma设计为Vue3组件...');
    
    // 调用转换函数
    const outputPath = await convertDesignToVue3(figmaFileId, outputDir, options);
    
    console.log(`转换成功! 组件已生成于: ${outputPath}`);
    
    // 输出使用示例
    console.log('\n使用示例:');
    console.log('----------------------------------------');
    console.log(`
import MyComponent from '${outputPath}';

export default {
  components: {
    MyComponent
  }
}
`);
    console.log('----------------------------------------');
    
  } catch (error) {
    console.error('转换过程中出错:', error);
  }
}

// 运行示例
if (require.main === module) {
  runExample()
    .then(() => console.log('示例完成'))
    .catch(err => console.error('示例执行失败:', err));
} 