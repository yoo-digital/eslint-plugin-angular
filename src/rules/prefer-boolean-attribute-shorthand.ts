import { getTemplateParserServices } from '@angular-eslint/utils';
import type { TSESLint } from '@typescript-eslint/utils';

interface Options {
  allowFalseLiteral?: boolean;
}
type MessageIds = 'preferTrue' | 'preferFalse' | 'suggestTrue' | 'suggestRemove';

export const RULE_NAME = 'prefer-boolean-attribute-shorthand';

export const preferBooleanAttributeShorthandRule: TSESLint.RuleModule<MessageIds, Options[]> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer boolean input attribute shorthand instead of binding to literal true/false.',
    },
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          allowFalseLiteral: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferTrue: 'Use attribute shorthand "{{attr}}" instead of [{{attr}}]="true".',
      preferFalse: 'Avoid binding [{{attr}}]="false"; remove the binding or ensure default is false.',
      suggestTrue: 'Replace with attribute shorthand {{attr}}',
      suggestRemove: 'Remove the false binding',
    },
  },
  defaultOptions: [
    {
      allowFalseLiteral: false,
    },
  ],
  create(context) {
    // Robust to missing options: default to [{}] if undefined
    const optionsArr = context.options ?? [{}];
    const options = optionsArr[0] ?? {};
    const allowFalseLiteral = options.allowFalseLiteral ?? false;
    const parserServices = getTemplateParserServices(context);
    return {
      BoundAttribute(node: any) {
        const { value } = node;
        if (!value || !value.ast) return;
        const ast = value.ast;
        if (ast?.constructor?.name === 'LiteralPrimitive' && typeof ast.value === 'boolean') {
          const attrName: string = node.name;
          const loc = parserServices.convertNodeSourceSpanToLoc(node.sourceSpan);
          const start: number = node.sourceSpan.start.offset;
          const end: number = node.sourceSpan.end.offset;
          if (ast.value === true) {
            context.report({
              loc,
              messageId: 'preferTrue',
              data: { attr: attrName },
              suggest: [
                {
                  messageId: 'suggestTrue',
                  data: { attr: attrName },
                  fix: (fixer) => fixer.replaceTextRange([start, end], attrName),
                },
              ],
            });
          } else if (ast.value === false && !allowFalseLiteral) {
            context.report({
              loc,
              messageId: 'preferFalse',
              data: { attr: attrName },
              suggest: [
                {
                  messageId: 'suggestRemove',
                  data: { attr: attrName },
                  fix: (fixer) => fixer.replaceTextRange([start, end], ''),
                },
              ],
            });
          }
        }
      },
    };
  },
};
