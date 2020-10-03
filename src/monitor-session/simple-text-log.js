import { printDuration, objectToHash } from './log-helpers';
import chalk from 'chalk';
import sessionHolder from './session-data';
import { StatusIcons, TestResults } from '../common/consts';

let isTitlePrinted = false;

const renderTest = ({platform, testData}) => {
  return `${StatusIcons[testData.status]} ${printDuration(testData.duration)} | TestName: ${testData.testName} | Platform: ${objectToHash(platform)}`;
}

const renderSpec = (spec) => {
  const failingText = spec.Failing ? chalk.red(`| Failing: ${spec.Failing}`) : '';
  return `${StatusIcons[spec.Status]} ${printDuration(spec.Duration)} ${spec.SPEC} | Tests: ${spec.Tests} | Passing: ${spec.Passing} ` + failingText;
};

export default (title, status, sessionData, ended) => {
  if (!isTitlePrinted) {
    isTitlePrinted = true;
    console.log(title);
  }

  if (!sessionData.tests) {
    return;
  }

  sessionData.tests.forEach((test) => {
    console.log(renderTest(test));

    if (test.testData.status === TestResults.FAILED) {
      console.error(chalk.red(test.testData.message));
    }
  });

  if (ended) {
    console.log('\nSpecs Summary');
    sessionHolder.getSpecsSummary().forEach(spec => console.log(renderSpec(spec)))
  }
};
