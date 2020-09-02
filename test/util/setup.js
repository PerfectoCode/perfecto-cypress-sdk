import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiArrays from 'chai-arrays'
import chaiAsPromised from 'chai-as-promised'

chai.should();
chai.use(sinonChai);
chai.use(chaiArrays);
chai.use(chaiAsPromised);
