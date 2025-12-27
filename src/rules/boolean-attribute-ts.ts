import type { TSESLint } from '@typescript-eslint/utils';
import { TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'requireTransformDecorator' | 'requireTransformSignal';

export const RULE_NAME = 'boolean-attribute-ts';

/**
 * This rule enforces that boolean @Input() properties and input() signals
 * use the booleanAttribute transform.
 * 
 * BEHAVIOR:
 * - @Input() foo: boolean = true/false  → Requires @Input({ transform: booleanAttribute })
 * - input<boolean>(true/false)          → Requires input<boolean, BooleanInput>(..., { transform: booleanAttribute })
 * 
 * This ensures consistency across the codebase and enables the shorthand syntax
 * in templates (e.g., <comp disabled /> instead of <comp [disabled]="true" />).
 */

export const requireBooleanAttributeTransformRule: TSESLint.RuleModule<MessageIds, []> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require booleanAttribute transform on boolean @Input() properties and input() signals.',
    },
    schema: [],
    messages: {
      requireTransformDecorator: 'Boolean @Input() "{{name}}" must use transform: booleanAttribute',
      requireTransformSignal: 'Boolean input() signal "{{name}}" must use transform: booleanAttribute and BooleanInput type',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      // Handle both @Input() decorator syntax and input() signal syntax
      PropertyDefinition(node: TSESTree.PropertyDefinition) {
        // Case 1: Check for @Input() decorator with boolean type
        const hasInputDecorator = node.decorators?.some(
          (decorator) =>
            decorator.expression.type === 'CallExpression' &&
            decorator.expression.callee.type === 'Identifier' &&
            decorator.expression.callee.name === 'Input'
        );

        if (hasInputDecorator) {
          // Handle @Input() decorator
          if (!node.typeAnnotation || node.typeAnnotation.typeAnnotation.type !== 'TSBooleanKeyword') {
            return;
          }

          // Check if it already has transform: booleanAttribute
          const inputDecorator = node.decorators?.find(
            (decorator) =>
              decorator.expression.type === 'CallExpression' &&
              decorator.expression.callee.type === 'Identifier' &&
              decorator.expression.callee.name === 'Input'
          );

          if (inputDecorator?.expression.type === 'CallExpression') {
            const args = inputDecorator.expression.arguments;
            if (args.length > 0 && args[0].type === 'ObjectExpression') {
              const hasTransform = args[0].properties.some(
                (prop) =>
                  prop.type === 'Property' &&
                  prop.key.type === 'Identifier' &&
                  prop.key.name === 'transform' &&
                  prop.value.type === 'Identifier' &&
                  prop.value.name === 'booleanAttribute'
              );
              if (hasTransform) {
                return; // Already has transform
              }
            }
          }

          // Report the issue for @Input()
          const propertyName = node.key.type === 'Identifier' ? node.key.name : 'unknown';
          
          context.report({
            node: node.key,
            messageId: 'requireTransformDecorator',
            data: { name: propertyName },
          });
          return;
        }

        // Case 2: Check for input() signal syntax
        if (
          !node.value ||
          node.value.type !== 'CallExpression' ||
          node.value.callee.type !== 'Identifier' ||
          node.value.callee.name !== 'input'
        ) {
          return;
        }

        const callExpr = node.value;
        
        // Check if it's a boolean input (with or without type arguments)
        let isBooleanInput = false;
        
        if (callExpr.typeArguments && callExpr.typeArguments.params.length > 0) {
          const firstTypeParam = callExpr.typeArguments.params[0];
          isBooleanInput = firstTypeParam.type === 'TSBooleanKeyword';
        }
        
        if (!isBooleanInput) {
          return;
        }

        // At this point, we know typeArguments exists and has at least one boolean param
        const typeArgs = callExpr.typeArguments!;

        // Check if it already has BooleanInput as second type parameter
        const hasBooleanInput = typeArgs.params.length > 1 &&
          typeArgs.params[1].type === 'TSTypeReference' &&
          typeArgs.params[1].typeName.type === 'Identifier' &&
          typeArgs.params[1].typeName.name === 'BooleanInput';

        // Check if it already has transform in options
        const hasTransformOption = callExpr.arguments.length > 1 &&
          callExpr.arguments[1].type === 'ObjectExpression' &&
          callExpr.arguments[1].properties.some(
            (prop) =>
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'transform' &&
              prop.value.type === 'Identifier' &&
              prop.value.name === 'booleanAttribute'
          );

        // Both BooleanInput type and transform option are required
        // Only skip if BOTH are present
        if (hasBooleanInput && hasTransformOption) {
          return; // Already correctly configured
        }

        // If we reach here, at least one requirement is missing
        // Report the issue for input() signal
        const propertyName = node.key.type === 'Identifier' ? node.key.name : 'unknown';
        
        context.report({
          node: node.key,
          messageId: 'requireTransformSignal',
          data: { name: propertyName },
        });
      },

      // Handle input() signal syntax (standalone variable declarations - rare)
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (
          node.init?.type !== 'CallExpression' ||
          node.init.callee.type !== 'Identifier' ||
          node.init.callee.name !== 'input'
        ) {
          return;
        }

        const callExpr = node.init;
        
        // Check if it's a boolean input (with or without type arguments)
        let isBooleanInput = false;
        
        if (callExpr.typeArguments && callExpr.typeArguments.params.length > 0) {
          const firstTypeParam = callExpr.typeArguments.params[0];
          isBooleanInput = firstTypeParam.type === 'TSBooleanKeyword';
        }
        
        if (!isBooleanInput) {
          return;
        }

        // At this point, we know typeArguments exists and has at least one boolean param
        const typeArgs = callExpr.typeArguments!;

        // Check if it already has BooleanInput as second type parameter
        const hasBooleanInput = typeArgs.params.length > 1 &&
          typeArgs.params[1].type === 'TSTypeReference' &&
          typeArgs.params[1].typeName.type === 'Identifier' &&
          typeArgs.params[1].typeName.name === 'BooleanInput';

        // Check if it already has transform in options
        const hasTransformOption = callExpr.arguments.length > 1 &&
          callExpr.arguments[1].type === 'ObjectExpression' &&
          callExpr.arguments[1].properties.some(
            (prop) =>
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'transform' &&
              prop.value.type === 'Identifier' &&
              prop.value.name === 'booleanAttribute'
          );

        // Both BooleanInput type and transform option are required
        // Only skip if BOTH are present
        if (hasBooleanInput && hasTransformOption) {
          return; // Already correctly configured
        }

        // If we reach here, at least one requirement is missing
        // Report the issue
        const propertyName = node.id.type === 'Identifier' ? node.id.name : 'unknown';
        
        context.report({
          node: node.id,
          messageId: 'requireTransformSignal',
          data: { name: propertyName },
        });
      },
    };
  },
};
