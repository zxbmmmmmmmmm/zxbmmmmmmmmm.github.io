import type { ThemeRegistration } from 'shiki'

// Visual Studio Light (VS 2019+)
export const vsLight: ThemeRegistration = {
  name: 'vs-light',
  type: 'light',
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#000000',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: '#57A64A' },
    },
    {
      scope: [
        'keyword', 'keyword.control', 'keyword.operator.new',
        'keyword.operator.expression', 'keyword.operator.logical.python',
        'storage.type', 'storage.modifier',
        'constant.language',
      ],
      settings: { foreground: '#0000FF' },
    },
    {
      scope: [
        'entity.name.type', 'entity.name.class', 'entity.name.namespace',
        'entity.name.enum', 'entity.name.interface', 'entity.name.struct',
        'support.type', 'support.class',
      ],
      settings: { foreground: '#2B91AF' },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'],
      settings: { foreground: '#74531F' },
    },
    {
      scope: ['variable.parameter'],
      settings: { foreground: '#1F377F' },
    },
    {
      scope: ['string', 'string.quoted', 'string.template'],
      settings: { foreground: '#A31515' },
    },
    {
      scope: ['constant.character.escape', 'constant.other.placeholder'],
      settings: { foreground: '#FF0000' },
    },
    {
      scope: ['constant.numeric', 'number'],
      settings: { foreground: '#098052' },
    },
    {
      scope: ['entity.name.tag', 'meta.tag punctuation.definition.tag'],
      settings: { foreground: '#800000' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#FF0000' },
    },
    {
      scope: ['string.quoted.attribute-value', 'meta.attribute-with-value string'],
      settings: { foreground: '#0000FF' },
    },
    {
      scope: ['meta.preprocessor', 'keyword.control.directive'],
      settings: { foreground: '#9B9B9B' },
    },
    {
      scope: ['markup.heading', 'markup.heading entity.name'],
      settings: { foreground: '#0000FF', fontStyle: 'bold' },
    },
    {
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      scope: ['markup.inline.raw'],
      settings: { foreground: '#A31515' },
    },
  ],
}

// Visual Studio Dark
export const vsDark: ThemeRegistration = {
  name: 'vs-dark',
  type: 'dark',
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#DCDCDC',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: '#57A64A' },
    },
    {
      scope: [
        'keyword', 'keyword.control', 'keyword.operator.new',
        'keyword.operator.expression', 'keyword.operator.logical.python',
        'storage.type', 'storage.modifier',
        'constant.language',
      ],
      settings: { foreground: '#569CD6' },
    },
    {
      scope: [
        'entity.name.type', 'entity.name.class', 'entity.name.namespace',
        'entity.name.enum', 'entity.name.interface', 'entity.name.struct',
        'support.type', 'support.class',
      ],
      settings: { foreground: '#4EC9B0' },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'],
      settings: { foreground: '#DCDCAA' },
    },
    {
      scope: ['variable.parameter', 'variable.other.readwrite'],
      settings: { foreground: '#9CDCFE' },
    },
    {
      scope: ['string', 'string.quoted', 'string.template'],
      settings: { foreground: '#D69D85' },
    },
    {
      scope: ['constant.character.escape', 'constant.other.placeholder'],
      settings: { foreground: '#D7BA7D' },
    },
    {
      scope: ['constant.numeric', 'number'],
      settings: { foreground: '#B5CEA8' },
    },
    {
      scope: ['entity.name.tag', 'meta.tag punctuation.definition.tag'],
      settings: { foreground: '#569CD6' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#9CDCFE' },
    },
    {
      scope: ['string.quoted.attribute-value', 'meta.attribute-with-value string'],
      settings: { foreground: '#CE9178' },
    },
    {
      scope: ['meta.preprocessor', 'keyword.control.directive'],
      settings: { foreground: '#9B9B9B' },
    },
    {
      scope: ['markup.heading', 'markup.heading entity.name'],
      settings: { foreground: '#569CD6', fontStyle: 'bold' },
    },
    {
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      scope: ['markup.inline.raw'],
      settings: { foreground: '#CE9178' },
    },
  ],
}
