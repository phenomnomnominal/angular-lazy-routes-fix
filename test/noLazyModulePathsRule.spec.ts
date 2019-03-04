// Test Utilities:
import { Replacement } from 'tslint';
import { ast, expect } from './index';

// Under test:
import { Rule } from '../src/noLazyModulePathsRule';

describe('no-lazy-module-paths', () => {
    it('should fail when a `string` is passed to `loadChildren`', () => {
        const sourceFile = ast(`
            import { Route } from '@angular/router';

            const routes: Array<Route> = [
                {
                    path: '',
                    loadChildren: './lazy/lazy.module#LazyModule'
                }
            ];
        `);

        const rule = new Rule({ ruleArguments: [], ruleName: 'no-lazy-module-paths', ruleSeverity: 'error', disabledIntervals: [] });
        const errors = rule.apply(sourceFile);
        const [error] = errors;

        expect(errors.length).to.equal(1);
        expect(error.getFailure()).to.include('Found magic `loadChildren` string. Use a function with `import` instead.');
    });

    it('should create a lint fix with promises by default', () => {
        const sourceFile = ast(`
            import { Route } from '@angular/router';

            const routes: Array<Route> = [
                {
                    path: '',
                    loadChildren: './lazy/lazy.module#LazyModule'
                }
            ];
        `);

        const rule = new Rule({ ruleArguments: [], ruleName: 'no-lazy-module-paths', ruleSeverity: 'error', disabledIntervals: [] });
        const errors = rule.apply(sourceFile);
        const [error] = errors;

        expect(error.hasFix()).to.equal(true);
        expect((error.getFix() as Replacement).text).to.equal(`() => import('./lazy/lazy.module').then(m => m.LazyModule)`);
    });

    it('should create a lint fix with promises by default', () => {
        const sourceFile = ast(`
            import { Route } from '@angular/router';

            const routes: Array<Route> = [
                {
                    path: '',
                    loadChildren: './lazy/lazy.module#LazyModule'
                }
            ];
        `);

        const rule = new Rule({ ruleArguments: ['async'], ruleName: 'no-lazy-module-paths', ruleSeverity: 'error', disabledIntervals: [] });
        const errors = rule.apply(sourceFile);
        const [error] = errors;

        expect(error.hasFix()).to.equal(true);
        expect((error.getFix() as Replacement).text).to.equal(`async () => {
                        const { LazyModule } = await import('./lazy/lazy.module');
                        return LazyModule;
                    }`);
    });

    it('should not fail when a promise function is used', () => {
        const sourceFile = ast(`
            import { Route } from '@angular/router';

            const routes: Array<Route> = [
                {
                    path: '',
                    loadChildren: () => import('./lazy/lazy.module).then(m => m.LazyModule)
                }
            ];
        `);

        const rule = new Rule({ ruleArguments: [], ruleName: 'no-lazy-module-paths', ruleSeverity: 'error', disabledIntervals: [] });
        const errors = rule.apply(sourceFile).length;

        expect(errors).to.equal(0);
    });

    it('should not fail when an async function is used', () => {
        const sourceFile = ast(`
            import { Route } from '@angular/router';

            const routes: Array<Route> = [
                {
                    path: '',
                    loadChildren: () => {
                        const { LazyModule } = await import('./lazy/lazy.module);
                        return LazyModule;
                    }
                }
            ];
        `);

        const rule = new Rule({ ruleArguments: [], ruleName: 'no-lazy-module-paths', ruleSeverity: 'error', disabledIntervals: [] });
        const errors = rule.apply(sourceFile).length;

        expect(errors).to.equal(0);
    });
});
