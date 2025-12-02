import { getTemplateParserServices } from '@angular-eslint/utils';
import type { TSESLint } from '@typescript-eslint/utils';

interface Options {
  allowFalseLiteral?: boolean;
}
type MessageIds = 'preferTrue' | 'preferFalse' | 'suggestTrue' | 'suggestRemove';

export const RULE_NAME = 'prefer-boolean-attribute-shorthand';

/**
 * IMPORTANT LIMITATIONS:
 * 
 * Angular ESLint template rules cannot directly access the TypeScript component class
 * to check for booleanAttribute transforms or default values. This would require:
 * 1. Access to the TypeScript program (not available in template parser services)
 * 2. Cross-file analysis (template -> component.ts)
 * 3. Complex AST traversal and decorator/signal input analysis
 * 
 * The current implementation enforces shorthand syntax for [attr]="true" bindings
 * but cannot verify:
 * - Whether the input has `transform: booleanAttribute`
 * - What the default value of the input is
 * 
 * RECOMMENDATIONS FOR USERS:
 * 1. Only use this rule in projects where ALL boolean inputs have booleanAttribute
 * 2. If an input has default=true, manually disable the rule for that binding
 * 3. Consider the rule as a style guide enforcer, not a safety checker
 * 
 * FUTURE ENHANCEMENTS:
 * To implement the full feature set requested would require creating a SEPARATE
 * TypeScript ESLint rule that:
 * - Runs on .ts component files (not templates)
 * - Analyzes @Component decorators to find template  references
 * - Parses templates and cross-references with component inputs
 * - Reports errors in both .ts and template files
 * 
 * This would be a significantly more complex multi-file analysis rule.
 */

export const preferBooleanAttributeShorthandRule: TSESLint.RuleModule<MessageIds, Options[]> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer boolean input attribute shorthand instead of binding to literal true/false. NOTE: This rule assumes inputs have booleanAttribute transform and does not have default=true.',
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
      preferTrue: 'Use attribute shorthand "{{attr}}" instead of [{{attr}}]="true". WARNING: Only works if input has booleanAttribute transform.',
      preferFalse: 'Avoid binding [{{attr}}]="false"; remove the binding if default is false.',
      suggestTrue: 'Replace with attribute shorthand {{attr}}',
      suggestRemove: 'Remove the false binding',
    },
  },
  defaultOptions: [
    {
      allowFalseLiteral: true, // Changed default to true for safety
    },
  ],
  create(context) {
    // Robust to missing options: default to [{}] if undefined
    const optionsArr = context.options ?? [{}];
    const options = optionsArr[0] ?? {};
    const allowFalseLiteral = options.allowFalseLiteral ?? true; // Default to true for safety
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
            // Enforce shorthand for true bindings
            // NOTE: This assumes the input has booleanAttribute and default != true
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
            // Only flag false bindings if explicitly configured
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
