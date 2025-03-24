import { DesignProcessor, DesignData, ProcessorOptions } from '../core/DesignProcessor';

interface PropDefinition {
  name: string;
  type: string;
  hasDefault: boolean;
  default: string;
}

interface EventDefinition {
  name: string;
  event: string;
}

export class FigmaParser extends DesignProcessor {
  constructor(options: ProcessorOptions) {
    super(options);
  }

  async extractDesignData(figmaFileId: string): Promise<DesignData> {
    // 这里应该调用Figma API获取设计数据
    const designData = await this.fetchFigmaAPI(figmaFileId);
    
    return {
      id: designData.id || figmaFileId,
      name: designData.name || 'FigmaComponent',
      type: designData.type || 'component',
      elements: this.extractElements(designData),
      styles: this.extractStyles(designData),
      variables: this.extractVariables(designData)
    };
  }

  private async fetchFigmaAPI(figmaFileId: string): Promise<any> {
    // 在实际实现中，应该使用Figma API客户端
    // 这里仅作为示例
    console.log(`获取Figma文件: ${figmaFileId}`);
    return {
      id: figmaFileId,
      name: 'SampleComponent',
      styles: {
        colors: { primary: '#1976d2' },
        typography: { heading: { fontSize: '24px', fontWeight: 'bold' } }
      },
      components: [
        { id: 'btn1', type: 'button', text: '点击我', styles: { width: '120px', height: '40px' } }
      ]
    };
  }

  private extractElements(data: any): any[] {
    // 提取组件元素
    return (data.components || []).map((comp: any) => ({
      id: comp.id,
      type: comp.type,
      className: `${comp.type}-element`,
      hasText: !!comp.text,
      text: comp.text || '',
      hasIcon: !!comp.icon,
      iconClass: comp.icon || '',
      hasImage: !!comp.image,
      imageSrc: comp.image || '',
      imageAlt: comp.imageAlt || comp.text || 'image'
    }));
  }

  private extractStyles(data: any): Record<string, any> {
    // 提取样式信息
    const styles: Record<string, any> = {
      container: [],
      elements: []
    };

    // 提取容器样式
    if (data.styles) {
      styles.container = [
        { property: 'color', value: data.styles.colors?.primary || '#333' },
        { property: 'font-family', value: data.styles.typography?.fontFamily || 'sans-serif' }
      ];
    }

    // 提取元素样式
    (data.components || []).forEach((comp: any) => {
      if (comp.styles) {
        styles.elements.push({
          className: `${comp.type}-element`,
          properties: Object.entries(comp.styles).map(([name, value]) => ({ name, value }))
        });
      }
    });

    return styles;
  }

  private extractVariables(data: any): Record<string, any> {
    // 提取设计变量
    return {
      colors: data.styles?.colors || {},
      spacing: data.styles?.spacing || {},
      typography: data.styles?.typography || {}
    };
  }

  generateComponentData(designData: DesignData): Record<string, any> {
    // 根据目标框架生成相应的组件数据
    const componentData: Record<string, any> = {
      componentName: this.formatComponentName(designData.name),
      elements: designData.elements,
      styles: designData.styles,
      props: [] as PropDefinition[],
      imports: [],
      events: [] as EventDefinition[]
    };

    // 如果需要生成属性
    if (this.options.includeProps) {
      componentData.props = this.generateProps(designData);
    }

    // 如果需要生成事件
    if (this.options.includeEvents) {
      componentData.events = this.generateEvents(designData);
    }

    return componentData;
  }

  private formatComponentName(name: string): string {
    // 转换组件名为帕斯卡命名法 (PascalCase)
    return name
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (c) => c.toUpperCase());
  }

  private generateProps(designData: DesignData): PropDefinition[] {
    // 根据设计数据生成组件属性
    const props: PropDefinition[] = [];

    // 为每个元素添加一个属性
    designData.elements.forEach((element) => {
      if (element.hasText) {
        props.push({
          name: `${element.type}Text`,
          type: 'String',
          hasDefault: true,
          default: `'${element.text}'`
        });
      }
    });

    // 添加主题颜色属性
    if (designData.variables?.colors?.primary) {
      props.push({
        name: 'themeColor',
        type: 'String',
        hasDefault: true,
        default: `'${designData.variables.colors.primary}'`
      });
    }

    return props;
  }

  private generateEvents(designData: DesignData): EventDefinition[] {
    // 生成组件事件
    const events: EventDefinition[] = [];

    // 为按钮元素添加点击事件
    designData.elements.forEach((element) => {
      if (element.type === 'button') {
        events.push({
          name: 'handleClick',
          event: 'click'
        });
      }
    });

    return events;
  }
}