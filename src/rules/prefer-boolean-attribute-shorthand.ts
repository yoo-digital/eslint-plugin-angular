import { getTemplateParserServices } from '@angular-eslint/utils';
import type { TSESLint } from '@typescript-eslint/utils';

type MessageIds = 'preferTrue' | 'suggestTrue';

export const RULE_NAME = 'prefer-boolean-attribute-shorthand';

/**
 * This rule enforces shorthand syntax for boolean inputs bound to true.
 * 
 * BEHAVIOR:
 * - [attr]="true"  → Warns and suggests: attr
 * - [attr]="false" → No warning (ignored)
 * - attr           → OK (already shorthand)
 * 
 * ASSUMPTIONS:
 * This rule assumes that boolean inputs use Angular's booleanAttribute transform,
 * which allows the shorthand syntax to work correctly. The presence of the attribute
 * alone (without a binding) will be interpreted as true.
 * 
 * LIMITATIONS:
 * Cannot verify at lint-time whether:
 * - The input actually has `transform: booleanAttribute`
 * - The input's default value
 * 
 * Use this rule in projects where boolean inputs consistently use booleanAttribute.
 */

export const preferBooleanAttributeShorthandRule: TSESLint.RuleModule<MessageIds, []> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer boolean input attribute shorthand when binding to true (e.g., use "disabled" instead of [disabled]="true").',
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferTrue: 'Use attribute shorthand "{{attr}}" instead of [{{attr}}]="true".',
      suggestTrue: 'Replace with attribute shorthand {{attr}}',
    },
  },
  defaultOptions: [],
  create(context) {
    const parserServices = getTemplateParserServices(context);
    
    return {
      BoundAttribute(node: any) {
        const { value } = node;
        if (!value || !value.ast) return;
        const ast = value.ast;
        
        // Only check for boolean literals
        if (ast?.constructor?.name === 'LiteralPrimitive' && typeof ast.value === 'boolean') {
          // Only warn for [attr]="true", ignore [attr]="false"
          if (ast.value === true) {
            const attrName: string = node.name;
            const loc = parserServices.convertNodeSourceSpanToLoc(node.sourceSpan);
            const start: number = node.sourceSpan.start.offset;
            const end: number = node.sourceSpan.end.offset;
            
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
          }
          // [attr]="false" is explicitly ignored - no warning
        }
      },
    };
  },
};
