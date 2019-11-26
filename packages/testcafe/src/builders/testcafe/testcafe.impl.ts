import {
	BuilderContext,
	BuilderOutput,
	createBuilder,
	targetFromTargetString,
    scheduleTargetAndForget
} from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import { SchemaObject as TestcafeBuilderSchema } from './schema';
import { isMatch } from "lodash";
import { map } from 'rxjs/operators';

const createTestCafe = require("testcafe");
  
async function runTestcafe(opts: TestcafeBuilderSchema, hostName) {
	const port1 = opts.ports && opts.ports[0];
	const port2 = opts.ports && opts.ports[1];
	const proxy = opts.proxy;
	const proxyBypass = opts.proxyBypass;

	const testCafe = await createTestCafe(
		hostName,
		port1,
		port2,
		opts.ssl,
		opts.dev
	);

	const runner = opts.live
		? testCafe.createLiveModeRunner()
		: testCafe.createRunner();

	runner.isCli = true;

	return runner
        .useProxy(proxy, proxyBypass)
        .startApp(`yarn ng run ${opts.devServerTarget}`, opts.devServerTargetTimeout)
		.src(opts.src instanceof Array ? opts.src : [ opts.src ])
		.tsConfigPath(opts.tsConfigPath)
		.browsers(opts.browsers)
		.reporter(opts.reporters)
		.concurrency(opts.concurrency || 1)
		.filter((testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
			if (opts.test && testName !== opts.test) return false;

			if (opts.testGrep && !RegExp(opts.testGrep).test(testName))
				return false;

			if (opts.fixture && fixtureName !== opts.fixture) return false;

			if (opts.fixtureGrep && !RegExp(opts.fixtureGrep).test(fixtureName))
				return false;

			if (opts.testMeta && !isMatch(testMeta, opts.testMeta)) return false;

			if (opts.fixtureMeta && !isMatch(fixtureMeta, opts.fixtureMeta))
				return false;

			return true;
		})
		.screenshots(opts.screenshots)
		.run({
			allowMultipleWindows: opts.allowMultipleWindows,
			assertionTimeout: opts.assertionTimeout,
			debugMode: opts.debugMode,
			debugOnFail: opts.debugOnFail,
			pageLoadTimeout: opts.pageLoadTimeout,
			quarantineMode: opts.quarantineMode,
			selectorTimeout: opts.selectorTimeout,
			skipJsErrors: opts.skipJsErrors,
			skipUncaughtErrors: opts.skipUncaughtErrors,
			speed: opts.speed,
			stopOnFirstFail: opts.stopOnFirstFail,
		});
}

async function execute(
	options: TestcafeBuilderSchema,
	context: BuilderContext
): Promise<BuilderOutput> {
	let server;
	let serverOptions;

	try {
	    const host = serverOptions ? serverOptions.host : options.host;
		const failedCount = await runTestcafe(options, host);
		if (failedCount > 0) {
			return { success: false }
		} else {
			return { success: true }
		}
	} catch (e) {
		console.error('Testcafe run failed!!! error:', e);
		return { success: false, error: e.message };
	} finally {
		if (server) {
			await server.stop();
		}
	}
}

export default createBuilder<JsonObject & TestcafeBuilderSchema>(execute);