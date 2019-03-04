// Dependencies:
import { tsquery } from '@phenomnomnominal/tsquery';
import { Replacement, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

// Constants:
const LOAD_CHILDREN_SPLIT = '#';
const LOAD_CHILDREN_VALUE_QUERY = `StringLiteral[value=/.*${LOAD_CHILDREN_SPLIT}.*/]`;
const LOAD_CHILDREN_ASSIGNMENT_QUERY = `ObjectLiteralExpression > PropertyAssignment:has(Identifier[name="loadChildren"]):has(${LOAD_CHILDREN_VALUE_QUERY})`;

const FAILURE_MESSAGE = 'Found magic `loadChildren` string. Use a function with `import` instead.';

export class Rule extends Rules.AbstractRule {
    public apply(sourceFile: SourceFile): Array<RuleFailure> {
        const options = this.getOptions();
        const [preferAsync] = options.ruleArguments;

        return tsquery(sourceFile, LOAD_CHILDREN_ASSIGNMENT_QUERY).map(result => {
            const [valueNode] = tsquery(result, LOAD_CHILDREN_VALUE_QUERY);
            let fix = preferAsync === 'async' ? this._asyncReplacement(valueNode.text) : this._promiseReplacement(valueNode.text);

            // Try to fix indentation in replacement:
            const { character } = sourceFile.getLineAndCharacterOfPosition(result.getStart());
            fix = fix.replace(/\n/g, `\n${' '.repeat(character)}`);

            const replacement = new Replacement(valueNode.getStart(), valueNode.getWidth(), fix);
            return new RuleFailure(sourceFile, result.getStart(), result.getEnd(), FAILURE_MESSAGE, this.ruleName, replacement);
        });
    }

    private _promiseReplacement (loadChildren: string): string {
        const [path, moduleName] = this._getChunks(loadChildren);
        return `() => import('${path}').then(m => m.${moduleName})`;
    }

    private _asyncReplacement (loadChildren: string): string {
        const [path, moduleName] = this._getChunks(loadChildren);
        return `async () => {
    const { ${moduleName} } = await import('${path}');
    return ${moduleName};
}`;
    }

    private _getChunks (loadChildren: string): Array<string> {
        return loadChildren.split(LOAD_CHILDREN_SPLIT);
    }
}
