import type { DefaultValue } from '@milkdown-nota/kit/core'
import {
  Editor,
  defaultValueCtx,
  editorViewOptionsCtx,
  rootCtx,
} from '@milkdown-nota/kit/core'

import { listener, listenerCtx } from '@milkdown-nota/kit/plugin/listener'
import { commonmark } from '@milkdown-nota/kit/preset/commonmark'
import { gfm } from '@milkdown-nota/kit/preset/gfm'
import { history } from '@milkdown-nota/kit/plugin/history'
import { indent, indentConfig } from '@milkdown-nota/kit/plugin/indent'
import { getMarkdown } from '@milkdown-nota/kit/utils'
import { clipboard } from '@milkdown-nota/kit/plugin/clipboard'
import { trailing } from '@milkdown-nota/kit/plugin/trailing'
import { math } from '@milkdown-nota/kit/plugin/math'

import type { CrepeFeatureConfig } from '../feature'
import { CrepeFeature, defaultFeatures, loadFeature } from '../feature'
import { configureFeatures } from './slice'

export interface CrepeConfig {
  features?: Partial<Record<CrepeFeature, boolean>>
  featureConfigs?: CrepeFeatureConfig
  root?: Node | string | null
  defaultValue?: DefaultValue
  onChange: (markdown: string) => void
}

export class Crepe {
  static Feature = CrepeFeature
  readonly #editor: Editor
  readonly #rootElement: Node
  #editable = true

  constructor({
    root,
    features = {},
    featureConfigs = {},
    defaultValue = '',
    onChange,
  }: CrepeConfig) {
    const enabledFeatures = Object.entries({
      ...defaultFeatures,
      ...features,
    })
      .filter(([, enabled]) => enabled)
      .map(([feature]) => feature as CrepeFeature)

    this.#rootElement =
      (typeof root === 'string' ? document.querySelector(root) : root) ??
      document.body
    this.#editor = Editor.make()
      .config(configureFeatures(enabledFeatures))
      .config((ctx) => {
        ctx.set(rootCtx, this.#rootElement)
        ctx.set(defaultValueCtx, defaultValue)
        ctx.set(editorViewOptionsCtx, {
          editable: () => this.#editable,
        })
        ctx.update(indentConfig.key, (value) => ({
          ...value,
          size: 4,
        }))
      })
      .config((ctx) => {
        // sync markdown to the outside
        const lis = ctx.get(listenerCtx)
        lis.markdownUpdated((_ctx, newMarkdown, prevMarkdown) => {
          if (newMarkdown !== prevMarkdown) {
            onChange(newMarkdown)
          }
        })
      })
      .use(listener)
      .use(commonmark)
      .use(history)
      .use(indent)
      .use(trailing)
      .use(clipboard)
      .use(gfm)
      .use(math)

    enabledFeatures.forEach((feature) => {
      const config = (featureConfigs as Partial<Record<CrepeFeature, never>>)[
        feature
      ]
      loadFeature(feature, this.#editor, config)
    })
  }

  async create() {
    return this.#editor.create()
  }

  async destroy() {
    return this.#editor.destroy()
  }

  get editor(): Editor {
    return this.#editor
  }

  setReadonly(value: boolean) {
    this.#editable = !value
    return this
  }

  getMarkdown() {
    return this.#editor.action(getMarkdown())
  }
}
