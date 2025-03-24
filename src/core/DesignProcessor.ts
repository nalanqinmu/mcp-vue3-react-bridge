export interface DesignData {
  id: string;
  name: string;
  type: string;
  elements: any[];
  styles: Record<string, any>;
  variables?: Record<string, any>;
}

export interface ProcessorOptions {
  targetFramework: 'vue3' | 'react';
  styleFormat?: 'css' | 'scss' | 'less';
  includeProps?: boolean;
  includeEvents?: boolean;
}

export abstract class DesignProcessor {
  protected options: ProcessorOptions;

  constructor(options: ProcessorOptions) {
    this.options = {
      styleFormat: 'css',
      includeProps: true,
      includeEvents: true,
      ...options
    };
  }

  abstract extractDesignData(source: any): Promise<DesignData>;
  
  abstract generateComponentData(designData: DesignData): Record<string, any>;
  
  async process(source: any): Promise<Record<string, any>> {
    const designData = await this.extractDesignData(source);
    return this.generateComponentData(designData);
  }
} 