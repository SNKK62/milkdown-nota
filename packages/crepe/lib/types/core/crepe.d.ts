import type { DefaultValue } from '@milkdown-nota/kit/core';
import { Editor } from '@milkdown-nota/kit/core';
import type { CrepeFeatureConfig } from '../feature';
import { CrepeFeature } from '../feature';
export interface CrepeConfig {
    features?: Partial<Record<CrepeFeature, boolean>>;
    featureConfigs?: CrepeFeatureConfig;
    root?: Node | string | null;
    defaultValue?: DefaultValue;
    onChange: (markdown: string) => void;
}
export declare class Crepe {
    #private;
    static Feature: typeof CrepeFeature;
    constructor({ root, features, featureConfigs, defaultValue, onChange, }: CrepeConfig);
    create(): Promise<Editor>;
    destroy(): Promise<Editor>;
    get editor(): Editor;
    setReadonly(value: boolean): this;
    getMarkdown(): string;
}
//# sourceMappingURL=crepe.d.ts.map