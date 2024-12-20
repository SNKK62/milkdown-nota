import type { Ctx } from '@milkdown-nota/kit/ctx';
import type { BlockEditFeatureConfig } from '../index';
export declare const menu: import("@milkdown-nota/kit/plugin/slash").SlashPlugin<"CREPE_MENU", any>;
export interface MenuAPI {
    show: (pos: number) => void;
    hide: () => void;
}
export declare const menuAPI: import("@milkdown-nota/kit/utils").$Ctx<MenuAPI, "menuAPICtx">;
export declare function configureMenu(ctx: Ctx, config?: BlockEditFeatureConfig): void;
//# sourceMappingURL=index.d.ts.map