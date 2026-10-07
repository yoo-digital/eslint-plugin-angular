import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'preferTrue' | 'suggestTrue';

export const RULE_NAME = 'boolean-attribute-shorthand';

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

interface TemplateParserServices {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertNodeSourceSpanToLoc(sourceSpan: any): TSESTree.SourceLocation;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertElementSourceSpanToLoc(context: unknown, node: any): TSESTree.SourceLocation;
}

/**
 * Same logic as `getTemplateParserServices` from `@angular-eslint/utils`, inlined so the plugin
 * has no undeclared runtime dependency (strict package managers like pnpm would not resolve it).
 * Throws if `@angular-eslint/template-parser` is not the configured parser.
 */
function getTemplateParserServices(context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>): TemplateParserServices {
  const parserServices = context.sourceCode.parserServices as Partial<TemplateParserServices> | undefined;
  if (!parserServices?.convertNodeSourceSpanToLoc || !parserServices?.convertElementSourceSpanToLoc) {
    throw new Error("You have used a rule which requires '@angular-eslint/template-parser' to be used as the 'parser' in your ESLint config.");
  }
  return parserServices as TemplateParserServices;
}

export const preferBooleanAttributeShorthandRule: TSESLint.RuleModule<MessageIds, []> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer boolean input attribute shorthand when binding to true (e.g., use "disabled" instead of [disabled]="true").',
      url: 'https://github.com/yoo-digital/eslint-plugin-angular#boolean-attribute-shorthand',
    },
    fixable: 'code',
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              fix: (fixer) => fixer.replaceTextRange([start, end], attrName),
            });
          }
          // [attr]="false" is explicitly ignored - no warning
        }
      },
    };
  },
};
