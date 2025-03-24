/**
 * 帮助工具类，提供一些辅助功能
 */
export class Helper {
  /**
   * 格式化组件名称为Pascal命名规则 (PascalCase)
   * 例如: "my-component" => "MyComponent"
   */
  static formatComponentName(name: string): string {
    return name
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (c) => c.toUpperCase());
  }

  /**
   * 格式化属性名称为驼峰命名规则 (camelCase)
   * 例如: "background-color" => "backgroundColor"
   */
  static formatPropName(name: string): string {
    return name
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (c) => c.toLowerCase());
  }

  /**
   * 检查颜色是否有效
   */
  static isValidColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    const rgbColorRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const rgbaColorRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
    
    return hexColorRegex.test(color) || 
           rgbColorRegex.test(color) || 
           rgbaColorRegex.test(color);
  }

  /**
   * 从尺寸值中提取单位
   * 例如: "16px" => "px", "2rem" => "rem"
   */
  static getUnitFromSize(size: string): string {
    const match = size.match(/[a-z%]+$/i);
    return match ? match[0] : '';
  }

  /**
   * 从尺寸值中提取数值
   * 例如: "16px" => 16, "2rem" => 2
   */
  static getValueFromSize(size: string): number {
    const match = size.match(/^-?\d*\.?\d+/);
    return match ? parseFloat(match[0]) : 0;
  }
  
  /**
   * 将像素值转换为REM单位，基于给定的基础值
   * 例如: pixelToRem("16px", 16) => "1rem"
   */
  static pixelToRem(pixelValue: string, baseFontSize: number = 16): string {
    const value = this.getValueFromSize(pixelValue);
    return `${value / baseFontSize}rem`;
  }
  
  /**
   * 生成随机ID
   */
  static generateId(prefix: string = 'comp'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * 深度合并两个对象
   */
  static deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target };
    
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        const targetValue = (target as any)[key];
        const sourceValue = (source as any)[key];
        
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          (result as any)[key] = [...targetValue, ...sourceValue];
        } else if (isObject(targetValue) && isObject(sourceValue)) {
          (result as any)[key] = Helper.deepMerge(targetValue, sourceValue);
        } else {
          (result as any)[key] = sourceValue;
        }
      });
    }
    
    return result;
  }
}

// 辅助函数 - 检查是否为对象
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
} 